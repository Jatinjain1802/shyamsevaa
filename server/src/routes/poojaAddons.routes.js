import express from "express";
import {
    createAddon,
    updateAddon,
    deleteAddon,
    mapAddonToPooja,
    removeAddonFromPooja,
    getAllAddons,
    getPoojaAddons,
} from "../controllers/poojaAddons.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

// ===== ADDONS MASTER (ADMIN) =====

// create addon
router.post(
    "/admin/addons",
    authMiddleware,
    adminMiddleware,
    createAddon
);

// update addon
router.put(
    "/admin/addons/:addonId",
    authMiddleware,
    adminMiddleware,
    updateAddon
);

// delete addon
router.delete(
    "/admin/addons/:addonId",
    authMiddleware,
    adminMiddleware,
    deleteAddon
);

// ===== POOJA ↔ ADDON MAPPING =====

// map addon to pooja
router.post(
    "/admin/poojas/:poojaId/addons",
    authMiddleware,
    adminMiddleware,
    mapAddonToPooja
);

// remove addon from pooja
router.delete(
    "/admin/poojas/addons/:mapId",
    authMiddleware,
    adminMiddleware,
    removeAddonFromPooja
);
// get all addons (admin)
router.get(
    "/admin/addons",
    authMiddleware,
    adminMiddleware,
    getAllAddons
);

// get addons of a pooja
router.get(
    "/admin/poojas/:poojaId/addons",
    authMiddleware,
    adminMiddleware,
    getPoojaAddons
);

export default router;
