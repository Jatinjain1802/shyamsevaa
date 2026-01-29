import express from "express";
import { getPanchang } from "../controllers/panchang.controller.js";

const router = express.Router();

// Public route to get today's panchang
router.get("/", getPanchang);

export default router;
