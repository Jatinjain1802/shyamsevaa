import express from "express";
import {
  getAllLinks,
  getActiveLinks,
  createLink,
  updateLink,
  deleteLink,
  fetchVideoMetadata,
} from "../controllers/youtubeLinks.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

// User routes
router.get("/active", getActiveLinks);

// Admin routes
router.get("/fetch-metadata", authMiddleware, adminMiddleware, fetchVideoMetadata);
router.get("/", authMiddleware, adminMiddleware, getAllLinks);
router.post("/", authMiddleware, adminMiddleware, createLink);
router.put("/:id", authMiddleware, adminMiddleware, updateLink);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLink);

export default router;
