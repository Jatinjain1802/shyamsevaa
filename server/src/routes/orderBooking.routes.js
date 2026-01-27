import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

import { checkout } from "../controllers/checkout.controller.js";

import {
  getUserOrders,
  getUserOrderDetail,
  getAllOrders,
  getAdminOrderDetail,
} from "../controllers/order.controller.js";

import {
  createBookings,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

const router = express.Router();

/* ================= USER ================= */

// checkout
router.post("/checkout", authMiddleware, checkout);

// user orders
router.get("/orders", authMiddleware, getUserOrders);
router.get("/orders/:orderId", authMiddleware, getUserOrderDetail);

// user bookings
router.get("/bookings", authMiddleware, getUserBookings);

/* ================= ADMIN ================= */

// admin orders
router.get("/admin/orders", authMiddleware, adminMiddleware, getAllOrders);
router.get("/admin/orders/:orderId", authMiddleware, adminMiddleware, getAdminOrderDetail);

// admin bookings
router.get("/admin/bookings", authMiddleware, adminMiddleware, getAllBookings);
router.put(
  "/admin/bookings/:bookingId/status",
  authMiddleware,
  adminMiddleware,
  updateBookingStatus
);

// booking creation (after payment success)
router.post("/bookings/create", authMiddleware, createBookings);

export default router;
