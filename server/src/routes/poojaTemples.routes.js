import express from "express";
import {
    getPoojaTemples,
    addTempleToPooja,
    removeTempleFromPooja,
} from "../controllers/poojaTemples.controller.js";

import auth from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get(
    "/admin/poojas/:poojaId/temples",
    auth,
    admin,
    getPoojaTemples
);

router.post(
    "/admin/poojas/:poojaId/temples",
    auth,
    admin,
    addTempleToPooja
);

router.delete(
    "/admin/poojas/temples/:mapId",
    auth,
    admin,
    removeTempleFromPooja
);

export default router;
