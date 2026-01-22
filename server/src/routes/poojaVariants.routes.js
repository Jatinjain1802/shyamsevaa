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
// ===== POOJA VARIANTS (ADMIN) =====

// add variant to pooja
router.post(
  "/admin/poojas/:poojaId/variants",
  authMiddleware,
  adminMiddleware,
  addPoojaVariant
);

// update variant
router.put(
  "/admin/poojas/variants/:variantId",
  authMiddleware,
  adminMiddleware,
  updatePoojaVariant
);

// delete variant
router.delete(
  "/admin/poojas/variants/:variantId",
  authMiddleware,
  adminMiddleware,
  deletePoojaVariant
);

// get all variants of a pooja (admin)
router.get(
  "/admin/poojas/:poojaId/variants",
  authMiddleware,
  adminMiddleware,
  getPoojaVariants
);
export default router;
