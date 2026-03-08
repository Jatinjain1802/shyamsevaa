import {
  saveInboundWhatsappMessage,
  updateWhatsappMessageStatusByWamid,
  upsertWhatsappContact,
} from "../models/whatsapp.model.js";
import crypto from "crypto";
import { normalizePhone } from "../utils/whatsapp.service.js";

let signatureSecretWarningLogged = false;

const isValidWhatsappWebhookSignature = (req) => {
  const appSecret = process.env.WHATSAPP_APP_SECRET || process.env.META_APP_SECRET;
  if (!appSecret) {
    if (!signatureSecretWarningLogged) {
      console.warn(
        "WHATSAPP APP SECRET NOT SET: webhook signature validation is skipped."
      );
      signatureSecretWarningLogged = true;
    }
    return true;
  }

  const incomingSignature = req.get("x-hub-signature-256");
  if (!incomingSignature || !incomingSignature.startsWith("sha256=")) {
    return false;
  }

  if (!req.rawBody || !Buffer.isBuffer(req.rawBody)) {
    return false;
  }

  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", appSecret)
    .update(req.rawBody)
    .digest("hex")}`;

  const incomingBuffer = Buffer.from(incomingSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (incomingBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(incomingBuffer, expectedBuffer);
};

export const verifyWhatsappWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken =
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || process.env.WEBHOOK_VERIFY_TOKEN;

  if (!mode || !token) {
    return res.sendStatus(400);
  }

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WHATSAPP WEBHOOK] Verification successful.");
    return res.status(200).send(challenge);
  }

  console.warn("[WHATSAPP WEBHOOK] Verification failed.");
  return res.sendStatus(403);
};

export const handleWhatsappWebhook = async (req, res) => {
  try {
    if (!isValidWhatsappWebhookSignature(req)) {
      console.warn("[WHATSAPP WEBHOOK] Signature validation failed.");
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const body = req.body;

    if (body?.object !== "whatsapp_business_account") {
      console.log("[WHATSAPP WEBHOOK] Ignored non-whatsapp payload.");
      return res.sendStatus(200);
    }

    const io = req.app.get("io");
    const entries = body.entry || [];
    let totalStatuses = 0;
    let totalMessages = 0;

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        const value = change.value || {};

        const statuses = value.statuses || [];
        totalStatuses += statuses.length;
        for (const statusObj of statuses) {
          await updateWhatsappMessageStatusByWamid({
            wamid: statusObj.id,
            status: statusObj.status,
            timestamp: statusObj.timestamp,
            errorLog: statusObj?.errors?.[0]?.message || null,
          });

          if (io) {
            io.emit("whatsapp_status_update", {
              wamid: statusObj.id,
              status: statusObj.status,
              timestamp: statusObj.timestamp,
              recipient: statusObj.recipient_id,
            });
          }
        }

        const messages = value.messages || [];
        totalMessages += messages.length;
        for (const msg of messages) {
          const phone = normalizePhone(msg.from, process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91");
          if (!phone) continue;

          const messageType = msg.type || "text";
          let content = "";

          if (messageType === "text") {
            content = msg?.text?.body || "";
          } else {
            content = `[${messageType}]`;
          }

          await saveInboundWhatsappMessage({
            wamid: msg.id,
            phone,
            messageType,
            content,
            sentAt: msg.timestamp ? new Date(Number(msg.timestamp) * 1000) : new Date(),
          });

          await upsertWhatsappContact({
            phone,
            optInStatus: "opted_in",
            optInSource: "inbound_message",
            lastInboundAt: new Date(),
          });

          if (io) {
            io.emit("whatsapp_inbound_message", {
              wamid: msg.id,
              phone,
              messageType,
              content,
              timestamp: msg.timestamp,
            });
          }
        }
      }
    }

    console.log(
      `[WHATSAPP WEBHOOK] Event processed. entries=${entries.length}, statuses=${totalStatuses}, messages=${totalMessages}`
    );
    return res.sendStatus(200);
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return res.sendStatus(500);
  }
};
