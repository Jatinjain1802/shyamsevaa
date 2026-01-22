import express from "express";
import {
  createPooja,
  getPoojasByTemple,
  getPoojaDetail,
  updatePooja,
  deletePooja,
} from "../controllers/poojas.contoller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

/* ================= ADMIN APIs ================= */

// create pooja
router.post(
  "/admin/poojas",
  authMiddleware,
  adminMiddleware,
  createPooja
);

// update pooja
router.put(
  "/admin/poojas/:poojaId",
  authMiddleware,
  adminMiddleware,
  updatePooja
);

// delete pooja
router.delete(
  "/admin/poojas/:poojaId",
  authMiddleware,
  adminMiddleware,
  deletePooja
);

/* ================= USER APIs ================= */

// poojas by temple
router.get(
  "/poojas/temple/:templeId",
  getPoojasByTemple
);

// full pooja detail page
router.get(
  "/poojas/:poojaId",
  getPoojaDetail
);

export default router;
