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

import * as poojaFaqs from "../controllers/poojaFaq.controller.js";


import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import compressImage from "../middlewares/compressImage.middleware.js";

const router = express.Router();
/* ================= ADMIN ================= */

// CREATE
router.post("/", authMiddleware, adminMiddleware, upload.fields([{ name: 'pooja_image', maxCount: 1 }, { name: 'pooja_gallery', maxCount: 10 }]), compressImage, createPooja);

// UPDATE
router.put("/:poojaId", authMiddleware, adminMiddleware, upload.fields([{ name: 'pooja_image', maxCount: 1 }, { name: 'pooja_gallery', maxCount: 10 }]), compressImage, updatePooja);

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

router.get("/:poojaId/faqs", poojaFaqs.getPoojaFaqs);

router.post(
  "/faq",
  authMiddleware,
  adminMiddleware,
  poojaFaqs.createPoojaFaq
);

router.delete(
  "/faq/:faqId",
  authMiddleware,
  adminMiddleware,
  poojaFaqs.deletePoojaFaq
);


export default router; 
