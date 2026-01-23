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

    mapChadawaTemple,
} from "../controllers/chadawas.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

/* ========== ADMIN APIs ========== */

// chadawa CRUD
router.post("/admin/chadawas", authMiddleware, adminMiddleware, createChadawa);
router.put("/admin/chadawas/:chadawaId", authMiddleware, adminMiddleware, updateChadawa);
router.delete("/admin/chadawas/:chadawaId", authMiddleware, adminMiddleware, deleteChadawa);

// chadawa items
router.post("/admin/chadawas/:chadawaId/items", authMiddleware, adminMiddleware, addChadawaItem);
router.put("/admin/chadawas/items/:itemId", authMiddleware, adminMiddleware, updateChadawaItem);
router.delete("/admin/chadawas/items/:itemId", authMiddleware, adminMiddleware, deleteChadawaItem);

// chadawa benefits
router.post("/admin/chadawas/:chadawaId/benefits", authMiddleware, adminMiddleware, addChadawaBenefit);
router.delete("/admin/chadawas/benefits/:benefitId", authMiddleware, adminMiddleware, deleteChadawaBenefit);

// chadawa ↔ temple mapping
router.post("/admin/chadawas/:chadawaId/temples", authMiddleware, adminMiddleware, mapChadawaTemple);

/* ========== USER APIs ========== */

// full chadawa detail page
router.get("/chadawas/:chadawaId", getChadawaDetail);

// chadawas by temple
router.get("/chadawas/temple/:templeId", getChadawasByTemple);

export default router;
