import express from "express";
import { search } from "../controllers/search.controller.js";

const router = express.Router();

// GET /api/search?q=...
router.get("/", search);

export default router;
