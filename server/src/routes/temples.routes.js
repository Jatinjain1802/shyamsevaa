import express from "express";
import {
  createTemple,
  getAllTemples,
  getTempleById,
  // updateTemple,
  updateTemple,
  deleteTemple,
  deleteTempleGalleryImage,
} from "../controllers/temples.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import compressImage from "../middlewares/compressImage.middleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */

// PUBLIC TEMPLE LIST
router.get("/public", getAllTemples);

// PUBLIC SINGLE TEMPLE (optional, future use)
router.get("/public/:id", getTempleById);

// Admin-only CRUD
router.post("/", authMiddleware, adminMiddleware, upload.fields([{ name: 'temple_image', maxCount: 1 }, { name: 'temple_gallery', maxCount: 10 }]), compressImage, createTemple);
router.get("/", authMiddleware, adminMiddleware, getAllTemples);
router.get("/:id", authMiddleware, adminMiddleware, getTempleById);
router.put("/:id", authMiddleware, adminMiddleware, upload.fields([{ name: 'temple_image', maxCount: 1 }, { name: 'temple_gallery', maxCount: 10 }]), compressImage, updateTemple);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTemple);
router.delete("/gallery/:imageId", authMiddleware, adminMiddleware, deleteTempleGalleryImage);

export default router;
