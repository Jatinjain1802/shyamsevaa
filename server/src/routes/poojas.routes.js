import express from "express";
import {
  createPooja,
  getPoojasByTemple,
  getPoojaDetail,
  deletePooja,
} from "../controllers/poojas.contoller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createPooja);
router.get("/temple/:templeId", authMiddleware, adminMiddleware, getPoojasByTemple);
router.get("/:id", authMiddleware, adminMiddleware, getPoojaDetail);
router.delete("/:id", authMiddleware, adminMiddleware, deletePooja);

export default router;
