import db from "../config/db.js";

const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const upsertWhatsappContact = async ({
  userId = null,
  phone,
  name = null,
  optInStatus = "unknown",
  optInSource = null,
  lastInboundAt = null,
}) => {
  if (!phone) return null;

  await db.query(
    `
      INSERT INTO whatsapp_contacts
      (user_id, phone_e164, name, opt_in_status, opt_in_source, opt_in_at, last_inbound_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        user_id = COALESCE(VALUES(user_id), user_id),
        name = COALESCE(VALUES(name), name),
        opt_in_status = COALESCE(VALUES(opt_in_status), opt_in_status),
        opt_in_source = COALESCE(VALUES(opt_in_source), opt_in_source),
        opt_in_at = COALESCE(VALUES(opt_in_at), opt_in_at),
        last_inbound_at = COALESCE(VALUES(last_inbound_at), last_inbound_at)
    `,
    [
      userId,
      phone,
      name,
      optInStatus,
      optInSource,
      optInStatus === "opted_in" ? new Date() : null,
      lastInboundAt,
    ]
  );

  return phone;
};

export const enqueueWhatsappJob = async ({
  jobType,
  phone,
  payload,
  orderId = null,
  bookingId = null,
  campaignId = null,
  scheduledAt = null,
  maxAttempts = 5,
}) => {
  const [result] = await db.query(
    `
      INSERT INTO whatsapp_jobs
      (job_type, status, phone, payload, order_id, booking_id, campaign_id, max_attempts, scheduled_at)
      VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      jobType,
      phone,
      JSON.stringify(payload || {}),
      orderId,
      bookingId,
      campaignId,
      maxAttempts,
      scheduledAt || new Date(),
    ]
  );

  return result.insertId;
};

export const getPendingWhatsappJobs = async (limit = 10) => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM whatsapp_jobs
      WHERE status = 'pending'
        AND scheduled_at <= NOW()
      ORDER BY scheduled_at ASC, id ASC
      LIMIT ?
    `,
    [Number(limit)]
  );

  return rows.map((row) => ({
    ...row,
    payload: parseJson(row.payload, {}),
  }));
};

export const lockWhatsappJob = async (jobId) => {
  const [result] = await db.query(
    `
      UPDATE whatsapp_jobs
      SET status = 'processing', locked_at = NOW()
      WHERE id = ? AND status = 'pending'
    `,
    [jobId]
  );

  return result.affectedRows === 1;
};

export const markWhatsappJobCompleted = async (jobId) => {
  await db.query(
    `
      UPDATE whatsapp_jobs
      SET status = 'completed', locked_at = NULL, updated_at = NOW()
      WHERE id = ?
    `,
    [jobId]
  );
};

export const markWhatsappJobForRetry = async ({
  jobId,
  errorMessage,
  nextRunAt,
  maxAttemptsReached,
}) => {
  await db.query(
    `
      UPDATE whatsapp_jobs
      SET status = ?,
          attempts = attempts + 1,
          last_error = ?,
          scheduled_at = ?,
          locked_at = NULL,
          updated_at = NOW()
      WHERE id = ?
    `,
    [
      maxAttemptsReached ? "failed" : "pending",
      errorMessage,
      nextRunAt,
      jobId,
    ]
  );
};

export const createWhatsappMessageLog = async ({
  wamid = null,
  direction = "outbound",
  messageType = "template",
  phone,
  templateName = null,
  content = null,
  mediaUrl = null,
  status = "sent",
  orderId = null,
  bookingId = null,
  errorLog = null,
  sentAt = null,
  deliveredAt = null,
  readAt = null,
  failedAt = null,
}) => {
  await db.query(
    `
      INSERT INTO whatsapp_messages
      (wamid, direction, message_type, phone, template_name, content, media_url, status, order_id, booking_id, error_log, sent_at, delivered_at, read_at, failed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        error_log = COALESCE(VALUES(error_log), error_log),
        delivered_at = COALESCE(VALUES(delivered_at), delivered_at),
        read_at = COALESCE(VALUES(read_at), read_at),
        failed_at = COALESCE(VALUES(failed_at), failed_at)
    `,
    [
      wamid,
      direction,
      messageType,
      phone,
      templateName,
      content,
      mediaUrl,
      status,
      orderId,
      bookingId,
      errorLog,
      sentAt,
      deliveredAt,
      readAt,
      failedAt,
    ]
  );
};

export const saveInboundWhatsappMessage = async ({
  wamid,
  phone,
  messageType,
  content,
  mediaUrl = null,
  sentAt = null,
}) => {
  await createWhatsappMessageLog({
    wamid,
    direction: "inbound",
    messageType,
    phone,
    content,
    mediaUrl,
    status: "delivered",
    sentAt: sentAt || new Date(),
    deliveredAt: sentAt || new Date(),
  });
};

export const updateWhatsappMessageStatusByWamid = async ({
  wamid,
  status,
  timestamp,
  errorLog = null,
}) => {
  if (!wamid || !status) return;

  const statusTime = timestamp ? new Date(Number(timestamp) * 1000) : new Date();

  let deliveredAt = null;
  let readAt = null;
  let failedAt = null;

  if (status === "delivered") deliveredAt = statusTime;
  if (status === "read") readAt = statusTime;
  if (status === "failed") failedAt = statusTime;

  await db.query(
    `
      UPDATE whatsapp_messages
      SET status = ?,
          error_log = COALESCE(?, error_log),
          delivered_at = COALESCE(?, delivered_at),
          read_at = COALESCE(?, read_at),
          failed_at = COALESCE(?, failed_at)
      WHERE wamid = ?
    `,
    [status, errorLog, deliveredAt, readAt, failedAt, wamid]
  );
};

export const getWhatsappContacts = async () => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM whatsapp_contacts
      ORDER BY last_inbound_at DESC, created_at DESC
    `
  );
  return rows;
};

export const getWhatsappContactByPhone = async (phone) => {
  const [rows] = await db.query(
    `SELECT * FROM whatsapp_contacts WHERE phone_e164 = ? LIMIT 1`,
    [phone]
  );
  return rows[0] || null;
};

export const saveOutboundWhatsappMessage = async ({
  wamid,
  phone,
  messageType,
  content,
  mediaUrl = null,
  status = "sent",
  sentAt = null,
}) => {
  await createWhatsappMessageLog({
    wamid,
    direction: "outbound",
    messageType,
    phone,
    content,
    mediaUrl,
    status,
    sentAt: sentAt || new Date(),
  });
};


export const getWhatsappMessageHistory = async (phone) => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM whatsapp_messages
      WHERE phone = ?
      ORDER BY created_at ASC
    `,
    [phone]
  );
  return rows;
};

export const getWhatsappDashboardStats = async () => {
  // 1. Total Messages Sent (Outbound)
  const [totalOutbound] = await db.query(
    "SELECT COUNT(*) as count FROM whatsapp_messages WHERE direction = 'outbound'"
  );

  // 2. Message Status Breakdown
  const [statusBreakdown] = await db.query(
    "SELECT status, COUNT(*) as count FROM whatsapp_messages WHERE direction = 'outbound' GROUP BY status"
  );

  // 3. Total Campaigns
  const [totalCampaigns] = await db.query(
    "SELECT COUNT(*) as count FROM whatsapp_campaigns"
  );

  // 4. Campaign Stats (Recipients, Sent, etc.)
  const [campaignStats] = await db.query(
    `SELECT 
      SUM(total_recipients) as total_recipients,
      SUM(sent_count) as sent_count,
      SUM(delivered_count) as delivered_count,
      SUM(read_count) as read_count,
      SUM(failed_count) as failed_count
     FROM whatsapp_campaigns`
  );

  // 5. Total Templates
  const [totalTemplates] = await db.query(
    "SELECT COUNT(*) as count FROM whatsapp_templates"
  );

  // 6. Total Contacts
  const [totalContacts] = await db.query(
    "SELECT COUNT(*) as count FROM whatsapp_contacts"
  );

  return {
    totalOutbound: totalOutbound[0].count,
    statusBreakdown: statusBreakdown.reduce((acc, curr) => ({ ...acc, [curr.status]: curr.count }), {}),
    totalCampaigns: totalCampaigns[0].count,
    campaignAggregates: campaignStats[0],
    totalTemplates: totalTemplates[0].count,
    totalContacts: totalContacts[0].count
  };
};

