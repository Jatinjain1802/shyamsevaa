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
    `SELECT 
      o.*, 
      u.name AS user_name, 
      u.email 
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     WHERE o.id=? AND o.user_id=?`,
    [orderId, userId]
  );
  return row;
};

export const getOrderByAdmin = async (orderId) => {
  const [[row]] = await db.query(
    `SELECT 
      o.*, 
      u.name AS user_name, 
      u.email 
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     WHERE o.id=?`,
    [orderId]
  );
  return row;
};

export const getAllOrders = async () => {
  const [rows] = await db.query(
    `SELECT 
      o.*, 
      u.name AS user_name, 
      u.email 
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`
  );
  return rows;
};

export const getOrderItems = async (orderId) => {
  const [items] = await db.query(
    `SELECT 
        oi.*,
        p.title as pooja_title,
        pv.persons as pooja_persons,
        ci.title as chadawa_item_title,
        t.title as temple_title
     FROM order_items oi
     LEFT JOIN pooja_variants pv ON pv.id = oi.pooja_variant_id
     LEFT JOIN poojas p ON p.id = pv.pooja_id
     LEFT JOIN chadawa_items ci ON ci.id = oi.chadawa_item_id
     LEFT JOIN temples t ON t.id = oi.temple_id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  for (const item of items) {
    const [addons] = await db.query(
      `SELECT 
          oia.*,
          a.title as addon_title
       FROM order_item_addons oia
       JOIN addons a ON a.id = oia.addon_id
       WHERE oia.order_item_id = ?`,
      [item.id]
    );
    item.addons = addons;
  }

  return items;
};

export const getChadawaOrdersByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT 
        oi.*, 
        o.order_number, 
        o.payment_status,
        o.created_at as order_date,
        ci.title as chadawa_name,
        t.title as temple_name
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     JOIN chadawa_items ci ON ci.id = oi.chadawa_item_id
     JOIN temples t ON t.id = oi.temple_id
     WHERE o.user_id = ? AND oi.product_type = 'chadawa_item'
     ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
};
