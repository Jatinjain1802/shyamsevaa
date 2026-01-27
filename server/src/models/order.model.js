import db from "../config/db.js";
import crypto from "crypto";

export const createOrder = async ({ user_id, total_amount }) => {
  const orderNumber = "ORD-" + crypto.randomBytes(4).toString("hex");

  const [res] = await db.query(
    `INSERT INTO orders (user_id, order_number, total_amount)
     VALUES (?, ?, ?)`,
    [user_id, orderNumber, total_amount]
  );

  return res.insertId;
};

export const createOrderItem = async (d) => {
  const [res] = await db.query(
    `INSERT INTO order_items
     (order_id, product_type, pooja_variant_id, chadawa_item_id, temple_id, quantity, price)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      d.order_id,
      d.product_type,
      d.pooja_variant_id,
      d.chadawa_item_id,
      d.temple_id,
      d.quantity,
      d.price,
    ]
  );
  return res.insertId;
};

export const createOrderItemAddon = async (d) => {
  await db.query(
    `INSERT INTO order_item_addons (order_item_id, addon_id, price, quantity)
     VALUES (?, ?, ?, ?)`,
    [d.order_item_id, d.addon_id, d.price, d.quantity]
  );
};

/* FETCH */

export const getOrdersByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT id, order_number, total_amount, payment_status, created_at
     FROM orders WHERE user_id=? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

export const getOrderById = async (orderId, userId) => {
  const [[row]] = await db.query(
    `SELECT * FROM orders WHERE id=? AND user_id=?`,
    [orderId, userId]
  );
  return row;
};

export const getOrderByAdmin = async (orderId) => {
  const [[row]] = await db.query(
    `SELECT * FROM orders WHERE id=?`,
    [orderId]
  );
  return row;
};

export const getAllOrders = async () => {
  const [rows] = await db.query(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );
  return rows;
};

export const getOrderItems = async (orderId) => {
  const [items] = await db.query(
    `SELECT * FROM order_items WHERE order_id=?`,
    [orderId]
  );

  for (const item of items) {
    const [addons] = await db.query(
      `SELECT * FROM order_item_addons WHERE order_item_id=?`,
      [item.id]
    );
    item.addons = addons;
  }

  return items;
};
