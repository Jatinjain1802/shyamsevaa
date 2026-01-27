import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

import {
  getDashboardStats,
  getAllOrders,
  getOrderDetail,
  updatePaymentStatus,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/adminDashboard.controller.js";

const router = express.Router();

/* ===== DASHBOARD ===== */
router.get(
  "/admin/dashboard/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

/* ===== ORDERS ===== */
router.get(
  "/admin/orders",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

router.get(
  "/admin/orders/:orderId",
  authMiddleware,
  adminMiddleware,
  getOrderDetail
);

router.put(
  "/admin/orders/:orderId/payment-status",
  authMiddleware,
  adminMiddleware,
  updatePaymentStatus
);

/* ===== BOOKINGS ===== */
router.get(
  "/admin/bookings",
  authMiddleware,
  adminMiddleware,
  getAllBookings
);

router.put(
  "/admin/bookings/:bookingId/status",
  authMiddleware,
  adminMiddleware,
  updateBookingStatus
);

export default router;
