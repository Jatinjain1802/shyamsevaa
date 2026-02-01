import express from "express";
import {
  createTemple,
  getAllTemples,
  getTempleById,
  updateTemple,
  deleteTemple,
} from "../controllers/temples.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */

// PUBLIC TEMPLE LIST
router.get("/public", getAllTemples);

// PUBLIC SINGLE TEMPLE (optional, future use)
router.get("/public/:id", getTempleById);

// Admin-only CRUD
router.post("/", authMiddleware, adminMiddleware, upload.single("temple_image"), createTemple);
router.get("/", authMiddleware, adminMiddleware, getAllTemples);
router.get("/:id", authMiddleware, adminMiddleware, getTempleById);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("temple_image"), updateTemple);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTemple);

export default router;
