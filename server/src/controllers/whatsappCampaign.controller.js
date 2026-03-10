import * as CampaignModel from "../models/whatsappCampaign.model.js";
import { startWhatsappWorker, launchCampaign } from "../utils/whatsappQueue.js";
import { getMessageTemplateByName, normalizePhone } from "../utils/whatsapp.service.js";
import { findWhatsappTemplateByNameLanguage } from "../models/whatsappTemplate.model.js";
import db from "../config/db.js";
import fs from "fs";
import path from "path";

const sanitizeFileName = (fileName) =>
  String(fileName || "media")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_");

const saveCampaignMedia = async (file) => {
  const dir = path.join(process.cwd(), "uploads", "campaigns");
  await fs.promises.mkdir(dir, { recursive: true });

  const safeName = sanitizeFileName(file?.originalname);
  const uniqueName = `${Date.now()}-${safeName}`;
  const targetPath = path.join(dir, uniqueName);

  await fs.promises.writeFile(targetPath, file.buffer);
  return `/uploads/campaigns/${uniqueName}`;
};

export const createCampaign = async (req, res) => {
  try {
    const { name, templateName, variableMapping, scheduledAt, customMediaUrl } = req.body;
    const userId = req.user?.id || null;

    // 1. Verify template exists on Meta
    const metaTemplate = await getMessageTemplateByName(templateName);
    if (!metaTemplate) {
      return res.status(404).json({ success: false, message: "Template not found on Meta" });
    }

    // 2. Resolve local internal ID (if synced)
    // We assume en_US as default, but in pro apps you'd handle multiple locales
    const localTemplate = await findWhatsappTemplateByNameLanguage(templateName, "en_US");
    const internalId = localTemplate ? localTemplate.id : null;

    let finalMediaUrl = customMediaUrl || null;
    
    // Handle File Upload
    if (req.file) {
      try {
        finalMediaUrl = await saveCampaignMedia(req.file);
      } catch (err) {
        console.error("Failed to save campaign media:", err);
      }
    }

    const campaignId = await CampaignModel.createCampaign({
      name,
      template_id: internalId,
      template_meta_id: metaTemplate.id, // Store the large Meta ID separately
      template_name: templateName,
      variable_mapping: parseMaybeJson(variableMapping, {}),
      custom_media_url: finalMediaUrl,
      scheduled_at: scheduledAt || null,
      created_by: userId
    });

    res.json({ success: true, message: "Campaign created successfully", campaignId });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addRecipients = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { recipients } = req.body; // Array of { phone, context }

    if (!Array.isArray(recipients)) {
      return res.status(400).json({ success: false, message: "Recipients must be an array" });
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const recipient of recipients) {
      const normalized = normalizePhone(recipient.phone, "91");
      if (!normalized) {
        skippedCount++;
        continue;
      }

      await CampaignModel.addCampaignRecipient(campaignId, { 
        ...recipient, 
        phone: normalized 
      });
      addedCount++;
    }

    // Update total recipients count
    await CampaignModel.updateCampaignStats(campaignId);

    res.json({ 
      success: true, 
      message: `Successfully processed ${recipients.length} recipients.`,
      added: addedCount,
      skipped: skippedCount
    });
  } catch (error) {
    console.error("Error adding recipients:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const io = req.app.get("io");
    
    await launchCampaign(campaignId, io);

    res.json({ success: true, message: "Campaign launch sequence initialized." });
  } catch (error) {
    console.error("Error starting campaign:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignStatus = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await CampaignModel.getCampaignById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // Refresh stats from logs
    await CampaignModel.updateCampaignStats(campaignId);
    const updatedCampaign = await CampaignModel.getCampaignById(campaignId);

    res.json({ success: true, data: updatedCampaign });
  } catch (error) {
    console.error("Error fetching campaign status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignModel.listCampaigns();
    res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Error listing campaigns:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    await CampaignModel.deleteCampaign(campaignId);
    res.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignLogs = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const logs = await CampaignModel.getCampaignLogs(campaignId);
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error fetching campaign logs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const parseMaybeJson = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};
