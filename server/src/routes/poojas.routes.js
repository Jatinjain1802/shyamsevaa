import express from "express";
import {
  createPooja,
  getPoojasByTemple,
  getPoojaDetail,
  updatePooja,
  deletePooja,
  deletePoojaGalleryImage,
  getAllPoojas,
} from "../controllers/poojas.contoller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();
/* ================= ADMIN ================= */

// CREATE
router.post("/", authMiddleware, adminMiddleware, upload.fields([{ name: 'pooja_image', maxCount: 1 }, { name: 'pooja_gallery', maxCount: 10 }]), createPooja);

// UPDATE
router.put("/:poojaId", authMiddleware, adminMiddleware, upload.fields([{ name: 'pooja_image', maxCount: 1 }, { name: 'pooja_gallery', maxCount: 10 }]), updatePooja);

// DELETE
router.delete("/:poojaId", authMiddleware, adminMiddleware, deletePooja);

// DELETE GALLERY IMAGE
router.delete("/gallery/:imageId", authMiddleware, adminMiddleware, deletePoojaGalleryImage);

/* ================= USER ================= */

// GET ALL
router.get("/", getAllPoojas);

// BY TEMPLE
router.get("/temple/:templeId", getPoojasByTemple);

// DETAIL
router.get("/:poojaId", getPoojaDetail);

export default router;
