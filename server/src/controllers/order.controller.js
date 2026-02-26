import * as OrderModel from "../models/order.model.js";

export const getUserOrders = async (req, res) => {
  const orders = await OrderModel.getOrdersByUser(req.user.id);
  res.json({ success: true, data: orders });
};

export const getUserChadawaOrders = async (req, res) => {
  const data = await OrderModel.getChadawaOrdersByUser(req.user.id);
  res.json({ success: true, data });
};

export const getUserOrderDetail = async (req, res) => {
  const order = await OrderModel.getOrderById(req.params.orderId, req.user.id);
  if (!order) return res.status(404).json({ success: false });

  const items = await OrderModel.getOrderItems(req.params.orderId);
  res.json({ success: true, data: { order, items } });
};

/* ADMIN */

export const getAllOrders = async (req, res) => {
  const orders = await OrderModel.getAllOrders();
  res.json({ success: true, data: orders });
};

export const getAdminOrderDetail = async (req, res) => {
  const order = await OrderModel.getOrderByAdmin(req.params.orderId);
  if (!order) return res.status(404).json({ success: false });

  const items = await OrderModel.getOrderItems(req.params.orderId);
  res.json({ success: true, data: { order, items } });
};
