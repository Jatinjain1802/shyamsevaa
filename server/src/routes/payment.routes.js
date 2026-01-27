import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createPayment,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * Dummy payment APIs
 */

// create payment intent
router.post(
  "/payments/create",
  authMiddleware,
  createPayment
);

// verify payment (always success)
router.post(
  "/payments/verify",
  authMiddleware,
  verifyPayment
);

export default router;
