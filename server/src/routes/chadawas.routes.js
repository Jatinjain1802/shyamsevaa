import express from "express";
import {
    createChadawa,
    updateChadawa,
    deleteChadawa,
    getChadawaDetail,
    getChadawasByTemple,

    addChadawaItem,
    updateChadawaItem,
    deleteChadawaItem,

    addChadawaBenefit,
    deleteChadawaBenefit,
    getAllChadawas,
    mapChadawaTemple,
    removeChadawaTemple,
    getLinkedTemples,
    deleteChadawaGalleryImage,
} from "../controllers/chadawas.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

/* ========== ADMIN APIs ========== */

// chadawa CRUD
// chadawa CRUD
router.post("/admin/chadawas", authMiddleware, adminMiddleware, upload.fields([{ name: 'chadawa_image', maxCount: 1 }, { name: 'chadawa_gallery', maxCount: 10 }]), createChadawa);
router.put("/admin/chadawas/:chadawaId", authMiddleware, adminMiddleware, upload.fields([{ name: 'chadawa_image', maxCount: 1 }, { name: 'chadawa_gallery', maxCount: 10 }]), updateChadawa);
router.delete("/admin/chadawas/:chadawaId", authMiddleware, adminMiddleware, deleteChadawa);
router.delete("/admin/chadawas/gallery/:imageId", authMiddleware, adminMiddleware, deleteChadawaGalleryImage);

// chadawa items
router.post("/admin/chadawas/:chadawaId/items", authMiddleware, adminMiddleware, addChadawaItem);
router.put("/admin/chadawas/items/:itemId", authMiddleware, adminMiddleware, updateChadawaItem);
router.delete("/admin/chadawas/items/:itemId", authMiddleware, adminMiddleware, deleteChadawaItem);

// chadawa benefits
router.post("/admin/chadawas/:chadawaId/benefits", authMiddleware, adminMiddleware, addChadawaBenefit);
router.delete("/admin/chadawas/benefits/:benefitId", authMiddleware, adminMiddleware, deleteChadawaBenefit);

// chadawa ↔ temple mapping
router.post("/admin/chadawas/:chadawaId/temples", authMiddleware, adminMiddleware, mapChadawaTemple);
router.delete("/admin/chadawas/:chadawaId/temples/:templeId", authMiddleware, adminMiddleware, removeChadawaTemple);
router.get("/admin/chadawas/:chadawaId/temples", authMiddleware, adminMiddleware, getLinkedTemples);

/* ========== USER APIs ========== */

// full chadawa detail page
router.get("/chadawas/:chadawaId", getChadawaDetail);

// get all chadawas (public)
router.get("/chadawas", getAllChadawas);

// chadawas by temple
router.get("/chadawas/temple/:templeId", getChadawasByTemple);
router.get(
    "/admin/chadawas",
    authMiddleware,
    adminMiddleware,
    getAllChadawas
);


export default router;
