import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  createMessageTemplate,
  deleteMessageTemplateByName,
  extractBodyTextFromComponents,
  extractVariableNumbers,
  listMessageTemplates,
  normalizePhone,
  sanitizeTemplateName,
  sendTextMessage,
} from "../utils/whatsapp.service.js";
import {
  saveInboundWhatsappMessage,
  updateWhatsappMessageStatusByWamid,
  upsertWhatsappContact,
  getWhatsappContactByPhone,
  saveOutboundWhatsappMessage,
} from "../models/whatsapp.model.js";
import {
  createWhatsappTemplateRecord,
  deleteWhatsappTemplateRecord,
  findWhatsappTemplateById,
  findWhatsappTemplateByNameLanguage,
  getWhatsappUseCaseMappingByUseCase,
  getWhatsappUseCaseMappings,
  listWhatsappTemplateRecords,
  toggleWhatsappTemplateActive,
  updateWhatsappTemplateMeta,
  upsertWhatsappTemplateFromMeta,
  upsertWhatsappUseCaseMapping,
} from "../models/whatsappTemplate.model.js";
import { updateCampaignLogByWamid, updateCampaignStats } from "../models/whatsappCampaign.model.js";
import {
  getWhatsappUseCaseConfig,
  getWhatsappUseCaseList,
  isValidWhatsappUseCase,
} from "../utils/whatsappTemplateUsecases.js";
import { uploadToMeta } from "../utils/metaUpload.js";

let signatureSecretWarningLogged = false;

const normalizeMetaStatus = (status) => String(status || "PENDING").toUpperCase();

const mapMetaStatusToLocal = (metaStatus) => {
  const key = normalizeMetaStatus(metaStatus);
  if (key === "APPROVED") return "approved";
  if (key === "REJECTED") return "rejected";
  if (key === "PENDING") return "submitted";
  return "submitted";
};

const parseMaybeJson = (value, fallback) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const buildBodyComponent = (text, variableExamples = {}) => {
  const cleanText = String(text || "").trim();
  const variableNumbers = extractVariableNumbers(cleanText);

  const component = {
    type: "BODY",
    text: cleanText,
  };

  if (variableNumbers.length > 0) {
    const values = variableNumbers.map((n) => {
      const byString = variableExamples?.[String(n)];
      const byNumber = variableExamples?.[n];
      return String(byString || byNumber || `sample_${n}`);
    });

    component.example = {
      body_text: [values],
    };
  }

  return component;
};

const resolveHeaderMediaFormat = (mimetype) => {
  const type = String(mimetype || "").toLowerCase();
  if (type.startsWith("image/")) return "IMAGE";
  if (type.startsWith("video/")) return "VIDEO";
  if (type === "application/pdf") return "DOCUMENT";
  return null;
};

const sanitizeUploadFileName = (fileName) =>
  String(fileName || "header_media")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_");

const persistTemplateSampleMedia = async (file) => {
  const templatesDir = path.join(process.cwd(), "uploads", "templates");
  await fs.promises.mkdir(templatesDir, { recursive: true });

  const safeName = sanitizeUploadFileName(file?.originalname);
  const uniqueName = `${Date.now()}-${safeName}`;
  const targetPath = path.join(templatesDir, uniqueName);

  await fs.promises.writeFile(targetPath, file.buffer);
  return `/uploads/templates/${uniqueName}`;
};

const buildHeaderComponent = ({
  headerType,
  headerText,
  headerMediaFormat,
  headerMediaHandle,
}) => {
  const cleanHeaderType = String(headerType || "none").toLowerCase();

  if (cleanHeaderType === "text" && String(headerText || "").trim()) {
    return {
      type: "HEADER",
      format: "TEXT",
      text: String(headerText || "").trim(),
    };
  }

  if (cleanHeaderType === "media" && headerMediaFormat && headerMediaHandle) {
    return {
      type: "HEADER",
      format: String(headerMediaFormat).toUpperCase(),
      example: {
        header_handle: [String(headerMediaHandle)],
      },
    };
  }

  return null;
};

const upsertHeaderComponent = (components, headerComponent) => {
  if (!headerComponent) return components;

  const list = Array.isArray(components) ? [...components] : [];
  const existingIndex = list.findIndex(
    (component) => String(component?.type || "").toUpperCase() === "HEADER"
  );

  if (existingIndex >= 0) {
    list[existingIndex] = headerComponent;
  } else {
    list.unshift(headerComponent);
  }

  return list;
};

const buildMetaComponentsFromRequest = ({
  components,
  content,
  headerType,
  headerText,
  headerMediaFormat,
  headerMediaHandle,
  footerText,
  buttonType,
  buttons,
  variableExamples,
}) => {
  const parsedComponents = parseMaybeJson(components, null);
  const headerComponent = buildHeaderComponent({
    headerType,
    headerText,
    headerMediaFormat,
    headerMediaHandle,
  });

  if (Array.isArray(parsedComponents) && parsedComponents.length > 0) {
    return upsertHeaderComponent(parsedComponents, headerComponent);
  }

  const messageText = String(content || "").trim();
  if (!messageText) {
    return [];
  }

  const list = [];
  if (headerComponent) {
    list.push(headerComponent);
  }

  list.push(buildBodyComponent(messageText, parseMaybeJson(variableExamples, {})));

  if (String(footerText || "").trim()) {
    list.push({
      type: "FOOTER",
      text: String(footerText || "").trim(),
    });
  }

  const buttonTypeKey = String(buttonType || "none").toLowerCase();
  const buttonList = parseMaybeJson(buttons, []);
  if (Array.isArray(buttonList) && buttonList.length > 0 && buttonTypeKey !== "none") {
    const mappedButtons = buttonList
      .map((btn) => {
        if (buttonTypeKey === "quick_reply") {
          if (!btn?.text) return null;
          return {
            type: "QUICK_REPLY",
            text: String(btn.text),
          };
        }

        if (buttonTypeKey === "call_to_action") {
          if (!btn?.text) return null;

          if (String(btn?.type || "").toLowerCase() === "url" && btn?.value) {
            return {
              type: "URL",
              text: String(btn.text),
              url: String(btn.value),
            };
          }

          if (String(btn?.type || "").toLowerCase() === "phone" && btn?.value) {
            return {
              type: "PHONE_NUMBER",
              text: String(btn.text),
              phone_number: String(btn.value),
            };
          }
        }

        return null;
      })
      .filter(Boolean);

    if (mappedButtons.length > 0) {
      list.push({
        type: "BUTTONS",
        buttons: mappedButtons,
      });
    }
  }

  return list;
};

const hasMetaCredentials = () => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
  const wabaId = process.env.WHATSAPP_WABA_ID || process.env.META_WABA_ID;
  return !!(accessToken && wabaId);
};

const fetchAllMetaTemplates = async ({ category = null } = {}) => {
  const all = [];
  let after = null;
  let pageCount = 0;
  const maxPages = 20;

  while (pageCount < maxPages) {
    const page = await listMessageTemplates({
      limit: 100,
      after,
      category,
    });

    const items = Array.isArray(page?.data) ? page.data : [];
    all.push(...items);

    const next = page?.paging?.cursors?.after || null;
    if (!next) break;

    after = next;
    pageCount += 1;
  }

  return all;
};

const syncMetaTemplatesToLocal = async ({ category = null } = {}) => {
  if (!hasMetaCredentials()) {
    return {
      synced: 0,
      fetched: 0,
      skipped: true,
      reason: "Meta credentials are missing.",
    };
  }

  const templates = await fetchAllMetaTemplates({ category });
  let synced = 0;

  for (const item of templates) {
    const name = sanitizeTemplateName(item?.name);
    if (!name) continue;

    const language = String(item?.language || "en_US");
    const metaStatus = normalizeMetaStatus(item?.status || "PENDING");

    await upsertWhatsappTemplateFromMeta({
      name,
      category: String(item?.category || "UTILITY").toUpperCase(),
      language,
      structure: Array.isArray(item?.components) ? item.components : [],
      status: mapMetaStatusToLocal(metaStatus),
      metaStatus,
      metaTemplateId: item?.id || null,
      rejectionReason: item?.rejected_reason || null,
    });

    synced += 1;
  }

  return {
    synced,
    fetched: templates.length,
    skipped: false,
  };
};

const buildDefaultVariableMapping = (useCaseConfig, variableNumbers) => {
  const defaults = useCaseConfig?.defaultVariableMapping || {};
  const allowed = (useCaseConfig?.allowedVariables || []).map((v) => v.key);
  const fallback = allowed[0] || "customer_name";
  const map = {};

  for (const n of variableNumbers) {
    const key =
      defaults[n] ||
      defaults[String(n)] ||
      defaults[Number(n)] ||
      fallback;

    map[String(n)] = key;
  }

  return map;
};

const validateVariableMapping = ({ mapping, variableNumbers, useCaseConfig }) => {
  const allowed = new Set((useCaseConfig?.allowedVariables || []).map((v) => v.key));

  for (const n of variableNumbers) {
    const key = mapping?.[String(n)] || mapping?.[n];
    if (!key) {
      return `Missing variable mapping for {{${n}}}.`;
    }

    if (!allowed.has(key)) {
      return `Variable '{{${n}}}' uses unsupported key '${key}'.`;
    }
  }

  return null;
};

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

  console.log(`[WHATSAPP WEBHOOK] Verification attempt. Mode: ${mode}, Token: ${token}`);

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

    // --- TERMINAL LOGGING FOR DEBUGGING ---
    console.log("--- [WHATSAPP WEBHOOK RECEIVED] ---");
    console.log(JSON.stringify(body, null, 2));
    console.log("-----------------------------------");

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
          console.log(`[WHATSAPP WEBHOOK] Status Update: ${statusObj.status} for wamid: ${statusObj.id}`);
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

          // Campaign Updates
          const campaignId = await updateCampaignLogByWamid(
            statusObj.id,
            statusObj.status,
            statusObj.timestamp,
            statusObj?.errors?.[0]?.message || null
          );
          if (campaignId) {
            await updateCampaignStats(campaignId);
            if (io) io.emit("whatsapp_campaign_update", { campaignId });
          }
        }

        const messages = value.messages || [];
        totalMessages += messages.length;
        for (const msg of messages) {
          const phone = normalizePhone(msg.from, process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91");
          if (!phone) continue;

          console.log(`[WHATSAPP WEBHOOK] Inbound Message from ${phone}, type: ${msg.type}`);

          const messageType = msg.type || "text";
          let content = "";
          // ... (keep the rest of the logic)
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

    if (totalStatuses > 0 || totalMessages > 0) {
      console.log(
        `[WHATSAPP WEBHOOK] Event processed. entries=${entries.length}, statuses=${totalStatuses}, messages=${totalMessages}`
      );
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return res.sendStatus(500);
  }
};

export const createWhatsappTemplate = async (req, res) => {
  try {
    const name = sanitizeTemplateName(req.body?.name);
    const category = String(req.body?.category || "").toUpperCase();
    const language = String(req.body?.language || "en_US").trim() || "en_US";

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Template name is required.",
      });
    }

    if (!["UTILITY", "MARKETING"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Template category must be UTILITY or MARKETING.",
      });
    }

    const normalizedHeaderType = String(req.body?.headerType || "none").toLowerCase();
    let headerMediaHandle = null;
    let headerMediaFormat = null;
    let sampleMediaUrl = null;

    if (normalizedHeaderType === "media") {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "headerMedia file is required when headerType is media.",
        });
      }

      headerMediaFormat = resolveHeaderMediaFormat(req.file.mimetype);
      if (!headerMediaFormat) {
        return res.status(400).json({
          success: false,
          message: "Unsupported media type. Use image, video, or PDF document.",
        });
      }

      try {
        headerMediaHandle = await uploadToMeta(req.file);
      } catch (uploadError) {
        return res.status(502).json({
          success: false,
          message: uploadError.message || "Failed to upload media to Meta.",
        });
      }

      try {
        sampleMediaUrl = await persistTemplateSampleMedia(req.file);
      } catch (persistError) {
        console.warn(`[WHATSAPP TEMPLATE] Failed to save local media sample: ${persistError.message}`);
      }
    }

    const components = buildMetaComponentsFromRequest({
      components: req.body?.components,
      content: req.body?.bodyContent,
      headerType: normalizedHeaderType,
      headerText: req.body?.headerText,
      headerMediaFormat,
      headerMediaHandle,
      footerText: req.body?.footerText,
      buttonType: req.body?.buttonType,
      buttons: req.body?.buttons,
      variableExamples: req.body?.variableExamples,
    });

    const bodyText = extractBodyTextFromComponents(components);
    if (!bodyText) {
      return res.status(400).json({
        success: false,
        message: "Template body content is required.",
      });
    }

    const existing = await findWhatsappTemplateByNameLanguage(name, language);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Template '${name}' (${language}) already exists in local records.`,
        data: existing,
      });
    }

    const templateId = await createWhatsappTemplateRecord({
      name,
      category,
      language,
      structure: components,
      status: "local_pending",
      sampleMediaUrl,
      createdBy: req.user?.id || null,
    });

    if (!hasMetaCredentials()) {
      await updateWhatsappTemplateMeta({
        id: templateId,
        status: "local_only",
        metaStatus: null,
        rejectionReason: null,
      });

      const localTemplate = await findWhatsappTemplateById(templateId);
      return res.status(201).json({
        success: true,
        message: "Template created locally. Meta credentials are missing, so submission is skipped.",
        data: localTemplate,
      });
    }

    try {
      const meta = await createMessageTemplate({
        name,
        category,
        language,
        components,
        allowCategoryChange: true,
      });

      const metaStatus = normalizeMetaStatus(meta?.status || "PENDING");
      await updateWhatsappTemplateMeta({
        id: templateId,
        status: mapMetaStatusToLocal(metaStatus),
        metaStatus,
        metaTemplateId: meta?.id || null,
        rejectionReason: null,
      });

      const created = await findWhatsappTemplateById(templateId);
      return res.status(201).json({
        success: true,
        message: "Template created and submitted to Meta.",
        data: created,
      });
    } catch (metaError) {
      await updateWhatsappTemplateMeta({
        id: templateId,
        status: "failed_meta",
        metaStatus: "ERROR",
        rejectionReason: metaError.message,
      });

      const failedRecord = await findWhatsappTemplateById(templateId);
      return res.status(502).json({
        success: false,
        message: metaError.message || "Failed to create template on Meta.",
        data: failedRecord,
      });
    }
  } catch (error) {
    console.error("WhatsApp template create error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create template",
    });
  }
};

export const listWhatsappTemplates = async (req, res) => {
  try {
    const sync = String(req.query?.sync || "").toLowerCase();
    const shouldSync = sync === "1" || sync === "true";
    const limit = Math.min(Math.max(Number(req.query?.limit || 100), 1), 200);
    const offset = Math.max(Number(req.query?.offset || 0), 0);
    const category = req.query?.category ? String(req.query.category).toUpperCase() : null;
    const status = req.query?.status ? String(req.query.status).toLowerCase() : null;
    const search = req.query?.search ? String(req.query.search).trim() : null;

    let syncSummary = null;
    if (shouldSync) {
      syncSummary = await syncMetaTemplatesToLocal({ category });
    }

    const data = await listWhatsappTemplateRecords({
      category,
      status,
      search,
      limit,
      offset,
    });

    return res.json({
      success: true,
      data,
      sync: syncSummary,
    });
  } catch (error) {
    console.error("WhatsApp template list error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to list templates",
    });
  }
};

export const syncWhatsappTemplates = async (req, res) => {
  try {
    const category = req.body?.category ? String(req.body.category).toUpperCase() : null;
    const syncSummary = await syncMetaTemplatesToLocal({ category });

    return res.json({
      success: true,
      message: syncSummary.skipped
        ? "Sync skipped. Meta credentials are missing."
        : "Template sync completed.",
      data: syncSummary,
    });
  } catch (error) {
    console.error("WhatsApp template sync error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to sync templates",
    });
  }
};

export const toggleWhatsappTemplateStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const isActive = req.body?.isActive;

    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid template id.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be boolean.",
      });
    }

    const updated = await toggleWhatsappTemplateActive({ id, isActive });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    const data = await findWhatsappTemplateById(id);
    return res.json({
      success: true,
      message: `Template marked as ${isActive ? "active" : "inactive"}.`,
      data,
    });
  } catch (error) {
    console.error("WhatsApp template toggle error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update template active status",
    });
  }
};

export const deleteWhatsappTemplate = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleteOnMeta = String(req.query?.delete_meta || "").toLowerCase();

    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid template id.",
      });
    }

    const record = await findWhatsappTemplateById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    if ((deleteOnMeta === "1" || deleteOnMeta === "true") && hasMetaCredentials()) {
      try {
        await deleteMessageTemplateByName(record.name);
      } catch (metaErr) {
        console.warn(`Meta delete skipped/failed for template '${record.name}': ${metaErr.message}`);
      }
    }

    const deleted = await deleteWhatsappTemplateRecord(id);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete template.",
      });
    }

    return res.json({
      success: true,
      message: "Template deleted successfully.",
    });
  } catch (error) {
    console.error("WhatsApp template delete error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete template",
    });
  }
};

export const getWhatsappTemplateUseCases = async (req, res) => {
  try {
    const mappings = await getWhatsappUseCaseMappings();
    return res.json({
      success: true,
      use_cases: getWhatsappUseCaseList(),
      mappings,
    });
  } catch (error) {
    console.error("WhatsApp template use-case list error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load template use-cases",
    });
  }
};

export const saveWhatsappTemplateUseCase = async (req, res) => {
  try {
    const useCase = String(req.params.useCase || "").trim();
    if (!isValidWhatsappUseCase(useCase)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported use-case '${useCase}'.`,
      });
    }

    const templateId = Number(req.body?.templateId);
    if (!Number.isFinite(templateId) || templateId <= 0) {
      return res.status(400).json({
        success: false,
        message: "templateId is required.",
      });
    }

    const template = await findWhatsappTemplateById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    if (Number(template.is_active) !== 1) {
      return res.status(400).json({
        success: false,
        message: "Only active templates can be assigned.",
      });
    }

    const templateMetaStatus = normalizeMetaStatus(template.meta_status || template.status);
    if (templateMetaStatus !== "APPROVED" && String(template.status || "").toLowerCase() !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only Meta-approved templates can be assigned to use-cases.",
      });
    }

    const useCaseConfig = getWhatsappUseCaseConfig(useCase);
    const bodyText = String(template.body_text || "");
    const variableNumbers = Array.isArray(template.variable_numbers)
      ? template.variable_numbers
      : extractVariableNumbers(bodyText);

    let variableMapping = parseMaybeJson(req.body?.variableMapping, {}) || {};
    if (variableNumbers.length > 0 && Object.keys(variableMapping).length === 0) {
      variableMapping = buildDefaultVariableMapping(useCaseConfig, variableNumbers);
    }

    if (variableNumbers.length > 0) {
      const validationError = validateVariableMapping({
        mapping: variableMapping,
        variableNumbers,
        useCaseConfig,
      });

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }
    } else {
      variableMapping = {};
    }

    await upsertWhatsappUseCaseMapping({
      useCase,
      templateId,
      variableMapping,
      updatedBy: req.user?.id || null,
    });

    const updated = await getWhatsappUseCaseMappingByUseCase(useCase);
    return res.json({
      success: true,
      message: "Use-case template mapping updated.",
      data: updated,
    });
  } catch (error) {
    console.error("WhatsApp template use-case save error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save use-case mapping",
    });
  }
};





export const getContacts = async (req, res) => {
  try {
    const contacts = await import("../models/whatsapp.model.js").then(m => m.getWhatsappContacts());
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching whatsapp contacts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { phone } = req.params;
    const history = await import("../models/whatsapp.model.js").then(m => m.getWhatsappMessageHistory(phone));
    res.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWhatsappStats = async (req, res) => {
  try {
    const stats = await import("../models/whatsapp.model.js").then(m => m.getWhatsappDashboardStats());
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching whatsapp stats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const isServiceWindowActive = (lastInboundAt) => {
  if (!lastInboundAt) return false;
  const lastAt = new Date(lastInboundAt);
  const now = new Date();
  const diffHours = (now - lastAt) / (1000 * 60 * 60);
  return diffHours <= 24;
};

export const sendServiceMessage = async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ success: false, message: "Phone and message are required." });
    }

    const contact = await getWhatsappContactByPhone(phone);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found." });
    }

    if (!isServiceWindowActive(contact.last_inbound_at)) {
      return res.status(403).json({ 
        success: false, 
        message: "Service window is closed. You can only send messages if the user contacted you in the last 24 hours. Use a template instead." 
      });
    }

    const result = await sendTextMessage({ to: phone, text: message });

    await saveOutboundWhatsappMessage({
      wamid: result.wamid,
      phone,
      messageType: "text",
      content: message,
      status: "sent",
    });

    // Notify via Socket.io if available
    const io = req.app.get("socketio");
    if (io) {
      io.emit("whatsapp_status_update", {
        wamid: result.wamid,
        phone,
        status: "sent",
      });
    }

    res.json({ success: true, wamid: result.wamid });
  } catch (error) {
    console.error("Error sending service message:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


