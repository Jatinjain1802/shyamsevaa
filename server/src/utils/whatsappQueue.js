import {
  createWhatsappMessageLog,
  enqueueWhatsappJob,
  getPendingWhatsappJobs,
  lockWhatsappJob,
  markWhatsappJobCompleted,
  markWhatsappJobForRetry,
  upsertWhatsappContact,
} from "../models/whatsapp.model.js";
import {
  buildOrderTemplateComponents,
  normalizePhone,
  sendDocumentMessage,
  sendTemplateMessage,
  toPublicUrl,
} from "./whatsapp.service.js";

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

export const queueOrderWhatsappNotifications = async ({
  userId,
  orderId,
  customerPhone,
  customerName,
  orderNumber,
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

  const orderTemplate = process.env.WHATSAPP_ORDER_TEMPLATE || null;
  if (orderTemplate) {
    await enqueueWhatsappJob({
      jobType: "order_confirmation_template",
      phone: normalizedPhone,
      orderId,
      payload: {
        templateName: orderTemplate,
        languageCode: process.env.WHATSAPP_ORDER_TEMPLATE_LANG || "en_US",
        customerName,
        orderNumber,
      },
    });
    queued += 1;
  }

  const invoiceUrl = toPublicUrl(invoicePath);
  if (invoiceUrl) {
    await enqueueWhatsappJob({
      jobType: "invoice_document",
      phone: normalizedPhone,
      orderId,
      payload: {
        documentUrl: invoiceUrl,
        fileName: `invoice_${orderNumber || orderId}.pdf`,
        caption: `Invoice for order ${orderNumber || orderId}`,
      },
    });
    queued += 1;
  }

  return { queued, phone: normalizedPhone };
};

export const queuePoojaVideoNotification = async ({
  userId,
  bookingId,
  customerPhone,
  customerName,
  videoUrl,
}) => {
  const templateName = process.env.WHATSAPP_POOJA_COMPLETED_TEMPLATE || null;
  const normalizedPhone = normalizePhone(
    customerPhone,
    process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91"
  );

  if (!templateName || !normalizedPhone || !videoUrl) {
    return { queued: 0 };
  }

  await upsertWhatsappContact({
    userId,
    phone: normalizedPhone,
    name: customerName,
    optInStatus: "opted_in",
    optInSource: "pooja_completed",
  });

  await enqueueWhatsappJob({
    jobType: "pooja_completed_template",
    phone: normalizedPhone,
    bookingId,
    payload: {
      templateName,
      languageCode: process.env.WHATSAPP_POOJA_TEMPLATE_LANG || "en_US",
      customerName,
      videoUrl,
    },
  });

  return { queued: 1, phone: normalizedPhone };
};

const processJob = async (job, io) => {
  const payload = job.payload || {};

  if (job.job_type === "order_confirmation_template") {
    const components = buildOrderTemplateComponents({
      customerName: payload.customerName,
      orderNumber: payload.orderNumber,
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
      content: `Order confirmation sent for order ${payload.orderNumber || job.order_id}`,
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
    const components = [
      {
        type: "body",
        parameters: [
          { type: "text", text: String(payload.customerName || "Devotee") },
          { type: "text", text: String(payload.videoUrl || "") },
        ],
      },
    ];

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

  throw new Error(`Unsupported whatsapp job type: ${job.job_type}`);
};

export const processWhatsappQueueBatch = async (io) => {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const jobs = await getPendingWhatsappJobs(BATCH_SIZE);

    for (const job of jobs) {
      const locked = await lockWhatsappJob(job.id);
      if (!locked) continue;

      try {
        await processJob(job, io);
        await markWhatsappJobCompleted(job.id);
      } catch (error) {
        const nextAttempt = Number(job.attempts || 0) + 1;
        const maxAttemptsReached = nextAttempt >= Number(job.max_attempts || 5);
        const nextRunAt = computeNextRun(nextAttempt - 1);

        await markWhatsappJobForRetry({
          jobId: job.id,
          errorMessage: error.message,
          nextRunAt,
          maxAttemptsReached,
        });

        if (maxAttemptsReached) {
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
