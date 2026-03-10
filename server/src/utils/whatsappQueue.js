import {
  createWhatsappMessageLog,
  enqueueWhatsappJob,
  getPendingWhatsappJobs,
  lockWhatsappJob,
  markWhatsappJobCompleted,
  markWhatsappJobForRetry,
  upsertWhatsappContact,
} from "../models/whatsapp.model.js";
import { getWhatsappUseCaseMappingByUseCase } from "../models/whatsappTemplate.model.js";
import {
  buildOrderFollowupLine,
  buildTemplateComponentsFromVariableMapping,
  normalizePhone,
  sendDocumentMessage,
  sendTemplateMessage,
  toPublicUrl,
} from "./whatsapp.service.js";
import { 
  updateCampaignStats, 
  getScheduledCampaigns, 
  getCampaignById, 
  getQueuedRecipients, 
  updateCampaignStatus, 
  updateCampaignLog 
} from "../models/whatsappCampaign.model.js";
import db from "../config/db.js";

const POLL_MS = Number(process.env.WHATSAPP_QUEUE_POLL_MS || 5000);
const BATCH_SIZE = Number(process.env.WHATSAPP_QUEUE_BATCH_SIZE || 10);

let workerTimer = null;
let isProcessing = false;

const backoffSeconds = [30, 120, 600, 1800, 3600];
const computeNextRun = (attempts) => {
  const index = Math.min(Math.max(attempts, 0), backoffSeconds.length - 1);
  const seconds = backoffSeconds[index];
  return new Date(Date.now() + seconds * 1000);
};

const isAssignedTemplateUsable = (mapping) => {
  if (!mapping || !mapping.template_name) return false;
  if (Number(mapping.template_is_active) !== 1) return false;

  const metaStatus = String(mapping.template_meta_status || "").toUpperCase();
  const localStatus = String(mapping.template_status || "").toLowerCase();

  return metaStatus === "APPROVED" || localStatus === "approved";
};

const parseMaybeJson = (val, fallback = []) => {
  if (!val) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const resolveTemplateConfigForUseCase = async ({
  useCase,
  fallbackTemplateName = null,
  fallbackLanguageCode = "en_US",
  fallbackVariableMapping = {},
}) => {
  try {
    const mapping = await getWhatsappUseCaseMappingByUseCase(useCase);

    if (isAssignedTemplateUsable(mapping)) {
      const structure = parseMaybeJson(mapping.structure_json, []);
      const hasDocumentHeader = structure.some(
        (c) =>
          String(c.type).toUpperCase() === "HEADER" &&
          String(c.format).toUpperCase() === "DOCUMENT"
      );

      return {
        templateName: mapping.template_name,
        languageCode: mapping.template_language || "en_US",
        variableMapping: mapping.variable_mapping || {},
        structure,
        hasDocumentHeader,
        source: "use_case_mapping",
      };
    }
  } catch (error) {
    console.error(`[WHATSAPP QUEUE] Failed to load mapping for ${useCase}:`, error.message);
  }

  if (fallbackTemplateName) {
    return {
      templateName: fallbackTemplateName,
      languageCode: fallbackLanguageCode,
      variableMapping: fallbackVariableMapping || {},
      hasDocumentHeader: false,
      source: "env_fallback",
    };
  }

  return null;
};

const buildOrderTemplateContext = ({ customerName, itemName, followupLine, orderNumber }) => ({
  customer_name: customerName,
  item_name: itemName,
  followup_line: followupLine,
  order_number: orderNumber,
});

export const queueOrderWhatsappNotifications = async ({
  userId,
  orderId,
  customerPhone,
  customerName,
  orderNumber,
  itemName,
  productType,
  invoicePath,
}) => {
  const normalizedPhone = normalizePhone(
    customerPhone,
    process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91"
  );

  if (!normalizedPhone) {
    return { queued: 0, reason: "no_valid_phone" };
  }

  await upsertWhatsappContact({
    userId,
    phone: normalizedPhone,
    name: customerName,
    optInStatus: "opted_in",
    optInSource: "order_checkout",
  });

  let queued = 0;
  const invoiceUrl = toPublicUrl(invoicePath);
  const followupLine = buildOrderFollowupLine(productType);

  const templateConfig = await resolveTemplateConfigForUseCase({
    useCase: "order_confirmed",
  });

  const shouldMergeInvoice = templateConfig?.hasDocumentHeader && invoiceUrl;

  if (templateConfig?.templateName) {
    await enqueueWhatsappJob({
      jobType: "order_confirmation_template",
      phone: normalizedPhone,
      orderId,
      payload: {
        templateName: templateConfig.templateName,
        languageCode: templateConfig.languageCode || "en_US",
        variableMapping: templateConfig.variableMapping || {},
        structure: templateConfig.structure || [],
        headerDocumentUrl: shouldMergeInvoice ? invoiceUrl : null,
        headerFileName: `invoice_${orderNumber || orderId}.pdf`,
        templateContext: {
          ...buildOrderTemplateContext({
            customerName,
            itemName,
            followupLine,
            orderNumber,
          }),
          order_details: `${itemName} (Order: #${orderNumber || orderId})`,
        },
      },
    });
    queued++;

    if (shouldMergeInvoice) {
      console.log(`[WHATSAPP QUEUE] Invoice merged into template header for order ${orderId}`);
    } else if (invoiceUrl) {
      await enqueueWhatsappJob({
        jobType: "invoice_document",
        phone: normalizedPhone,
        orderId,
        payload: {
          documentUrl: invoiceUrl,
          fileName: `invoice_${orderNumber || orderId}.pdf`,
          caption: `Here is your invoice for ${itemName}.`,
        },
      });
      queued++;
    }
  } else {
    console.warn(`[WHATSAPP QUEUE] No template configured for order_confirmed. Skipping.`);
    if (invoiceUrl) {
      await enqueueWhatsappJob({
        jobType: "invoice_document",
        phone: normalizedPhone,
        orderId,
        payload: {
          documentUrl: invoiceUrl,
          fileName: `invoice_${orderNumber || orderId}.pdf`,
          caption: `Your order for ${itemName} is received. Here is your invoice.`,
        },
      });
      queued++;
    }
  }

  return { queued, phone: normalizedPhone };
};

export const queuePoojaCompletionNotification = async ({
  userId,
  bookingId,
  customerPhone,
  customerName,
  poojaName,
  poojaDate,
  videoUrl,
}) => {
  const normalizedPhone = normalizePhone(
    customerPhone,
    process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91"
  );

  if (!normalizedPhone) {
    return { queued: 0, reason: "no_valid_phone" };
  }

  await upsertWhatsappContact({
    userId,
    phone: normalizedPhone,
    name: customerName,
    optInStatus: "opted_in",
    optInSource: "pooja_completion",
  });

  const templateConfig = await resolveTemplateConfigForUseCase({
    useCase: "pooja_completed",
  });

  if (templateConfig && templateConfig.templateName) {
    await enqueueWhatsappJob({
      jobType: "pooja_completed_template",
      phone: normalizedPhone,
      bookingId,
      payload: {
        templateName: templateConfig.templateName,
        languageCode: templateConfig.languageCode || "en_US",
        variableMapping: templateConfig.variableMapping || {},
        structure: templateConfig.structure || [],
        videoUrl,
        templateContext: {
          customer_name: customerName,
          pooja_name: poojaName,
          pooja_date: poojaDate,
          video_link: videoUrl,
        },
      },
    });
  }

  return { queued: 1, phone: normalizedPhone };
};

const processJob = async (job, io) => {
  const payload = job.payload || {};

  if (job.job_type === "order_confirmation_template") {
    if (!payload.templateName) {
      throw new Error("Template name missing in job payload.");
    }

    const components = buildTemplateComponentsFromVariableMapping({
      variableMapping: payload.variableMapping || {},
      structure: payload.structure || [],
      headerDocumentUrl: payload.headerDocumentUrl,
      headerFileName: payload.headerFileName,
      headerImageUrl: payload.headerImageUrl,
      headerVideoUrl: payload.headerVideoUrl,
      context: payload.templateContext || {},
    });

    const result = await sendTemplateMessage({
      to: job.phone,
      templateName: payload.templateName,
      languageCode: payload.languageCode || "en_US",
      components,
    });

    await createWhatsappMessageLog({
      wamid: result.wamid,
      direction: "outbound",
      messageType: "template",
      phone: job.phone,
      templateName: payload.templateName,
      content: `Order confirmation sent for ${payload.itemName || payload.orderNumber || job.order_id}`,
      status: "sent",
      orderId: job.order_id,
      sentAt: new Date(),
    });

    if (io) {
      io.emit("whatsapp_job_sent", {
        jobId: job.id,
        phone: job.phone,
        type: job.job_type,
        wamid: result.wamid,
      });
    }

    return;
  }

  if (job.job_type === "invoice_document") {
    const result = await sendDocumentMessage({
      to: job.phone,
      documentUrl: payload.documentUrl,
      caption: payload.caption,
      fileName: payload.fileName,
    });

    await createWhatsappMessageLog({
      wamid: result.wamid,
      direction: "outbound",
      messageType: "document",
      phone: job.phone,
      templateName: null,
      mediaUrl: payload.documentUrl,
      content: payload.caption || "Invoice document sent",
      status: "sent",
      orderId: job.order_id,
      sentAt: new Date(),
    });

    if (io) {
      io.emit("whatsapp_job_sent", {
        jobId: job.id,
        phone: job.phone,
        type: job.job_type,
        wamid: result.wamid,
      });
    }

    return;
  }

  if (job.job_type === "pooja_completed_template") {
    const components = buildTemplateComponentsFromVariableMapping({
      variableMapping: payload.variableMapping || {},
      structure: payload.structure || [],
      context:
        payload.templateContext || {
          customer_name: payload.customerName,
          pooja_name: payload.poojaName,
          pooja_date: payload.poojaDate,
          video_link: payload.videoUrl,
        },
      headerImageUrl: payload.headerImageUrl,
      headerVideoUrl: payload.headerVideoUrl || payload.videoUrl,
    });

    const result = await sendTemplateMessage({
      to: job.phone,
      templateName: payload.templateName,
      languageCode: payload.languageCode || "en_US",
      components,
    });

    await createWhatsappMessageLog({
      wamid: result.wamid,
      direction: "outbound",
      messageType: "template",
      phone: job.phone,
      templateName: payload.templateName,
      content: `Pooja completion link sent: ${payload.videoUrl || ""}`,
      status: "sent",
      bookingId: job.booking_id,
      sentAt: new Date(),
    });

    return;
  }

  if (job.job_type === "campaign_message") {
    const components = buildTemplateComponentsFromVariableMapping({
      variableMapping: payload.variableMapping || {},
      structure: payload.structure || [],
      headerImageUrl: payload.headerImageUrl,
      headerVideoUrl: payload.headerVideoUrl,
      context: payload.templateContext || {},
    });

    const result = await sendTemplateMessage({
      to: job.phone,
      templateName: payload.templateName,
      languageCode: payload.languageCode || "en_US",
      components,
    });

    if (payload.campaignLogId) {
      await db.query(
        "UPDATE whatsapp_campaign_logs SET wamid = ?, status = 'sent', sent_at = NOW() WHERE id = ?",
        [result.wamid, payload.campaignLogId]
      );
      await updateCampaignStats(job.campaign_id);
      if (io) io.emit("whatsapp_campaign_update", { campaignId: job.campaign_id });
    }

    await createWhatsappMessageLog({
      wamid: result.wamid,
      direction: "outbound",
      messageType: "template",
      phone: job.phone,
      templateName: payload.templateName,
      content: `Campaign message: ${payload.templateName}`,
      status: "sent",
      sentAt: new Date(),
    });

    return;
  }

  throw new Error(`Unsupported whatsapp job type: ${job.job_type}`);
};

export const launchCampaign = async (campaignId, io) => {
  const campaign = await getCampaignById(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  if (campaign.status !== "draft" && campaign.status !== "paused" && campaign.status !== "failed") {
    return; // Already processing or done
  }

  const recipients = await getQueuedRecipients(campaignId);

  // Fetch template details
  const [templateRows] = await db.query(
    "SELECT structure_json, language, sample_media_url FROM whatsapp_templates WHERE name = ?",
    [campaign.template_name]
  );
  
  let structure = [];
  let languageCode = "en_US";
  if (templateRows.length > 0) {
    languageCode = templateRows[0].language || "en_US";
    try {
      structure = typeof templateRows[0].structure_json === "string"
        ? JSON.parse(templateRows[0].structure_json)
        : templateRows[0].structure_json;
    } catch (e) {
      console.error("Error parsing template structure:", e);
    }
  }

  // Update status to processing
  await updateCampaignStatus(campaignId, "processing");

  // Queue jobs for each recipient
  const mediaUrl = campaign.custom_media_url || templateRows[0]?.sample_media_url;

  for (const recipient of recipients) {
    const payload = {
      templateName: campaign.template_name,
      languageCode: languageCode,
      variableMapping: campaign.variable_mapping,
      structure: structure,
      templateContext: recipient.context,
      campaignLogId: recipient.id,
      headerImageUrl: mediaUrl,
      headerVideoUrl: mediaUrl,
    };

    await enqueueWhatsappJob({
      jobType: "campaign_message",
      phone: recipient.phone,
      campaignId: campaign.id,
      payload,
    });

    await updateCampaignLog(recipient.id, { status: "queued_to_meta" });
  }

  if (io) io.emit("whatsapp_campaign_update", { campaignId });
  console.log(`[CAMPAIGN SCHEDULER] Launched campaign #${campaignId}: ${campaign.name}`);
};

export const processScheduledCampaigns = async (io) => {
  try {
    const dueCampaigns = await getScheduledCampaigns();
    for (const campaign of dueCampaigns) {
      console.log(`[CAMPAIGN SCHEDULER] Found due campaign: ${campaign.name} (ID: ${campaign.id})`);
      await launchCampaign(campaign.id, io);
    }
  } catch (error) {
    console.error(`[CAMPAIGN SCHEDULER] Error processing scheduled campaigns:`, error.message);
  }
};

export const processWhatsappQueueBatch = async (io) => {
  if (isProcessing) return;
  isProcessing = true;

  try {
    // Check for scheduled campaigns first
    await processScheduledCampaigns(io);

    const jobs = await getPendingWhatsappJobs(BATCH_SIZE);

    for (const job of jobs) {
      const locked = await lockWhatsappJob(job.id);
      if (!locked) continue;

      console.log(`[WHATSAPP QUEUE] Processing Job #${job.id} (${job.job_type}) for ${job.phone}`);

      try {
        await processJob(job, io);
        await markWhatsappJobCompleted(job.id);
        console.log(`[WHATSAPP QUEUE] Job #${job.id} COMPLETED.`);
      } catch (error) {
        // --- SAFE RETRY LOGIC ---
        // Certain Meta error codes mean we should NOT retry at all (Policy, Invalid Number, Limit Reached)
        // 131048: Messaging limit reached (Daily limit exhausted)
        // 131056: Too many messages (Spam rate limiting)
        const HARD_FAILURE_CODES = [368, 131030, 100, 131009, 132001, 131026, 131048, 131056];
        const isHardFailure = error.type === "meta_graph_error" && HARD_FAILURE_CODES.includes(Number(error.code));

        const nextAttempt = Number(job.attempts || 0) + 1;
        
        // If it's a hard failure OR we hit max attempts, stop retrying
        const maxAttemptsReached = isHardFailure || nextAttempt >= Number(job.max_attempts || 5);
        const nextRunAt = computeNextRun(nextAttempt - 1);

        const errorMsgPrefix = isHardFailure ? "[HARD FAILURE - NO RETRY] " : "";
        console.error(`[WHATSAPP QUEUE] Job #${job.id} FAILED: ${errorMsgPrefix}${error.message}`);

        await markWhatsappJobForRetry({
          jobId: job.id,
          errorMessage: error.message,
          nextRunAt,
          maxAttemptsReached,
        });

        if (maxAttemptsReached) {
          // 1. General message log
          await createWhatsappMessageLog({
            direction: "outbound",
            messageType: "template",
            phone: job.phone,
            status: "failed",
            orderId: job.order_id,
            bookingId: job.booking_id,
            errorLog: error.message,
            failedAt: new Date(),
          });

          // 2. Campaign specific handling
          if (job.job_type === "campaign_message" && payload.campaignLogId) {
            await updateCampaignLog(payload.campaignLogId, { 
              status: "failed", 
              error_message: error.message 
            });
            if (job.campaign_id) {
              await updateCampaignStats(job.campaign_id);
              if (io) io.emit("whatsapp_campaign_update", { campaignId: job.campaign_id });
            }
          }
        }

        console.error(`WhatsApp job ${job.id} failed:`, error.message);
      }
    }
  } finally {
    isProcessing = false;
  }
};

export const startWhatsappWorker = (io) => {
  if (workerTimer) return;

  processWhatsappQueueBatch(io).catch((err) => {
    console.error("Initial WhatsApp queue run failed:", err.message);
  });

  workerTimer = setInterval(() => {
    processWhatsappQueueBatch(io).catch((err) => {
      console.error("WhatsApp queue processing error:", err.message);
    });
  }, POLL_MS);

  console.log(`WhatsApp queue worker started (poll=${POLL_MS}ms, batch=${BATCH_SIZE})`);
};

export const stopWhatsappWorker = () => {
  if (!workerTimer) return;
  clearInterval(workerTimer);
  workerTimer = null;
};
