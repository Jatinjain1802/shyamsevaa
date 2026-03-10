import express from "express";
import multer from "multer";
import * as CampaignController from "../controllers/whatsappCampaign.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// protect all campaign routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/create", upload.single("campaignMedia"), CampaignController.createCampaign);
router.post("/:campaignId/add-recipients", CampaignController.addRecipients);
router.post("/:campaignId/start", CampaignController.startCampaign);
router.get("/:campaignId/status", CampaignController.getCampaignStatus);
router.get("/:campaignId/logs", CampaignController.getCampaignLogs);
router.get("/list", CampaignController.listCampaigns);
router.delete("/:campaignId", CampaignController.deleteCampaign);

export default router;
