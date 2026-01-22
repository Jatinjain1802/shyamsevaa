import express from "express";
import {
  addPoojaVariant,
  updatePoojaVariant,
  deletePoojaVariant,
  getPoojaVariants,
} from "../controllers/poojaVariants.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

/* ===== ADMIN POOJA VARIANTS ===== */

// add variant
router.post(
  "/poojas/:poojaId/variants",
  authMiddleware,
  adminMiddleware,
  addPoojaVariant
);

// get variants of pooja
router.get(
  "/poojas/:poojaId/variants",
  authMiddleware,
  adminMiddleware,
  getPoojaVariants
);

// update variant
router.put(
  "/variants/:variantId",
  authMiddleware,
  adminMiddleware,
  updatePoojaVariant
);

// delete variant
router.delete(
  "/variants/:variantId",
  authMiddleware,
  adminMiddleware,
  deletePoojaVariant
);

export default router;
