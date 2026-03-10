import db from "../config/db.js";

export const createCampaign = async (campaignData) => {
  const { name, template_id, template_meta_id, template_name, variable_mapping, scheduled_at, created_by, custom_media_url } = campaignData;
  const [result] = await db.query(
    `INSERT INTO whatsapp_campaigns (name, template_id, template_meta_id, template_name, variable_mapping, custom_media_url, scheduled_at, created_by, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
    [name, template_id, template_meta_id, template_name, JSON.stringify(variable_mapping), custom_media_url, scheduled_at, created_by]
  );
  return result.insertId;
};

export const getCampaignById = async (id) => {
  const [rows] = await db.query("SELECT * FROM whatsapp_campaigns WHERE id = ?", [id]);
  return rows[0];
};

export const listCampaigns = async () => {
  const [rows] = await db.query("SELECT * FROM whatsapp_campaigns ORDER BY created_at DESC");
  return rows;
};

export const updateCampaignStatus = async (id, status) => {
  await db.query("UPDATE whatsapp_campaigns SET status = ? WHERE id = ?", [status, id]);
};

export const updateCampaignStats = async (id) => {
  const [statsRows] = await db.query(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status IN ('sent', 'delivered', 'read') THEN 1 ELSE 0 END) as sent,
      SUM(CASE WHEN status IN ('delivered', 'read') THEN 1 ELSE 0 END) as delivered,
      SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_count,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
     FROM whatsapp_campaign_logs WHERE campaign_id = ?`,
    [id]
  );
  
  const stats = statsRows[0];
  const total = Number(stats.total || 0);
  const sent = Number(stats.sent || 0);
  const delivered = Number(stats.delivered || 0);
  const read_count = Number(stats.read_count || 0);
  const failed = Number(stats.failed || 0);
  
  // Determine if it should be marked as completed
  // A campaign is completed if all recipients have reached a final-ish state (sent/delivered/read or failed)
  let statusUpdate = "";
  if (total > 0 && (sent + failed) >= total) {
    statusUpdate = ", status = 'completed'";
  }

  await db.query(
    `UPDATE whatsapp_campaigns SET 
      total_recipients = ?, 
      sent_count = ?, 
      delivered_count = ?, 
      read_count = ?, 
      failed_count = ? 
      ${statusUpdate}
     WHERE id = ?`,
    [total, sent, delivered, read_count, failed, id]
  );
};

export const addCampaignRecipient = async (campaignId, recipient) => {
  const { phone, context } = recipient;
  const [result] = await db.query(
    `INSERT INTO whatsapp_campaign_logs (campaign_id, phone, context, status)
     VALUES (?, ?, ?, 'queued')`,
    [campaignId, phone, JSON.stringify(context)]
  );
  return result.insertId;
};

export const updateCampaignLog = async (id, updateData) => {
  const fields = Object.keys(updateData).map(key => `${key} = ?`).join(", ");
  const values = Object.values(updateData);
  await db.query(`UPDATE whatsapp_campaign_logs SET ${fields} WHERE id = ?`, [...values, id]);
};

export const getQueuedRecipients = async (campaignId) => {
  const [rows] = await db.query(
    "SELECT * FROM whatsapp_campaign_logs WHERE campaign_id = ? AND status = 'queued'",
    [campaignId]
  );
  return rows;
};

export const updateCampaignLogByWamid = async (wamid, status, timestamp = null, errorMessage = null) => {
  const [log] = await db.query("SELECT id, campaign_id FROM whatsapp_campaign_logs WHERE wamid = ?", [wamid]);
  if (!log || log.length === 0) return null;

  const updateData = { status };
  if (status === 'delivered') updateData.delivered_at = timestamp ? new Date(Number(timestamp) * 1000) : new Date();
  if (status === 'read') updateData.read_at = timestamp ? new Date(Number(timestamp) * 1000) : new Date();
  if (status === 'failed') updateData.error_message = errorMessage;

  const fields = Object.keys(updateData).map(key => `${key} = ?`).join(", ");
  const values = Object.values(updateData);
  await db.query(`UPDATE whatsapp_campaign_logs SET ${fields} WHERE wamid = ?`, [...values, wamid]);
  
  return log[0].campaign_id;
};

export const deleteCampaign = async (id) => {
  await db.query("DELETE FROM whatsapp_campaigns WHERE id = ?", [id]);
};

export const getCampaignLogs = async (campaignId) => {
  const [rows] = await db.query(
    "SELECT * FROM whatsapp_campaign_logs WHERE campaign_id = ? ORDER BY id DESC",
    [campaignId]
  );
  return rows;
};

export const getScheduledCampaigns = async () => {
  const [rows] = await db.query(
    "SELECT * FROM whatsapp_campaigns WHERE status = 'draft' AND scheduled_at IS NOT NULL AND scheduled_at <= NOW()"
  );
  return rows;
};
