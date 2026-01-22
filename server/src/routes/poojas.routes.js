import express from "express";
import {
  createPooja,
  getPoojasByTemple,
  getPoojaDetail,
  updatePooja,
  deletePooja,
  getAllPoojas,
} from "../controllers/poojas.contoller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();
/* ================= ADMIN ================= */

// CREATE
router.post("/", authMiddleware, adminMiddleware, createPooja);

// UPDATE
router.put("/:poojaId", authMiddleware, adminMiddleware, updatePooja);

// DELETE
router.delete("/:poojaId", authMiddleware, adminMiddleware, deletePooja);

/* ================= USER ================= */

// GET ALL
router.get("/", getAllPoojas);

// BY TEMPLE
router.get("/temple/:templeId", getPoojasByTemple);

// DETAIL
router.get("/:poojaId", getPoojaDetail);

export default router;
