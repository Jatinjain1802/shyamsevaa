import express from "express";
import {
  handleWhatsappWebhook,
  verifyWhatsappWebhook,
} from "../controllers/whatsapp.controller.js";

const router = express.Router();

router.get("/webhook", verifyWhatsappWebhook);
router.post("/webhook", handleWhatsappWebhook);

export default router;
