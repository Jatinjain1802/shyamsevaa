import * as AdminModel from "../models/adminDashboard.model.js";

/* ===== DASHBOARD STATS ===== */
export const getDashboardStats = async (req, res) => {
  const stats = await AdminModel.getStats();
  res.json({ success: true, data: stats });
};

/* ===== ORDERS ===== */
export const getAllOrders = async (req, res) => {
  const orders = await AdminModel.getAllOrders();
  res.json({ success: true, data: orders });
};

export const getOrderDetail = async (req, res) => {
  const order = await AdminModel.getOrderById(req.params.orderId);
  if (!order) return res.status(404).json({ success: false });

  const items = await AdminModel.getOrderItems(req.params.orderId);
  res.json({ success: true, data: { order, items } });
};

export const updatePaymentStatus = async (req, res) => {
  const { status, payment_id } = req.body;

  await AdminModel.updatePaymentStatus(
    req.params.orderId,
    status,
    payment_id
  );

  res.json({ success: true, message: "Payment status updated" });
};

/* ===== BOOKINGS ===== */
export const getAllBookings = async (req, res) => {
  const bookings = await AdminModel.getAllBookings();
  res.json({ success: true, data: bookings });
};

export const updateBookingStatus = async (req, res) => {
  await AdminModel.updateBookingStatus(
    req.params.bookingId,
    req.body.status
  );

  res.json({ success: true, message: "Booking status updated" });
};
