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

const router = express.Router();

// Admin-only CRUD
router.post("/", authMiddleware, adminMiddleware, createTemple);
router.get("/", authMiddleware, adminMiddleware, getAllTemples);
router.get("/:id", authMiddleware, adminMiddleware, getTempleById);
router.put("/:id", authMiddleware, adminMiddleware, updateTemple);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTemple);

export default router;
