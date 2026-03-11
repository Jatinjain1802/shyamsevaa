import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetail,
} from "../controllers/products.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import compressImage from "../middlewares/compressImage.middleware.js";

const router = express.Router();

/* ================= ADMIN ================= */

// CREATE
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("product_image"),
  compressImage,
  createProduct
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("product_image"),
  compressImage,
  updateProduct
);

// DELETE
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

/* ================= USER ================= */

// GET ALL
router.get("/", getAllProducts);

// DETAIL
router.get("/:id", getProductDetail);

export default router;
