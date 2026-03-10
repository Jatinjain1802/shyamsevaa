import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {
  createWhatsappTemplate,
  deleteWhatsappTemplate,
  getWhatsappTemplateUseCases,
  handleWhatsappWebhook,
  listWhatsappTemplates,
  saveWhatsappTemplateUseCase,
  syncWhatsappTemplates,
  toggleWhatsappTemplateStatus,
  verifyWhatsappWebhook,
  getContacts,
  getChatHistory,
  getWhatsappStats,
  sendServiceMessage,
} from "../controllers/whatsapp.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/webhook", verifyWhatsappWebhook);
router.post("/webhook", handleWhatsappWebhook);

router.get("/admin/templates", authMiddleware, adminMiddleware, listWhatsappTemplates);
router.post("/admin/templates", authMiddleware, adminMiddleware, upload.single("headerMedia"), createWhatsappTemplate);
router.post("/admin/templates/sync", authMiddleware, adminMiddleware, syncWhatsappTemplates);
router.patch("/admin/templates/:id/toggle-active", authMiddleware, adminMiddleware, toggleWhatsappTemplateStatus);
router.delete("/admin/templates/:id", authMiddleware, adminMiddleware, deleteWhatsappTemplate);

router.get("/admin/template-usecases", authMiddleware, adminMiddleware, getWhatsappTemplateUseCases);
router.put("/admin/template-usecases/:useCase", authMiddleware, adminMiddleware, saveWhatsappTemplateUseCase);

router.get("/admin/contacts", authMiddleware, adminMiddleware, getContacts);
router.get("/admin/chats/:phone", authMiddleware, adminMiddleware, getChatHistory);
router.get("/admin/stats", authMiddleware, adminMiddleware, getWhatsappStats);
router.post("/admin/send-message", authMiddleware, adminMiddleware, sendServiceMessage);



export default router;


