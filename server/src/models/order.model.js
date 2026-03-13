import db from "../config/db.js";
import crypto from "crypto";

export const createOrder = async ({ user_id, total_amount, customer_name, communication_mobile, shipping_address }) => {
  const orderNumber = "ORD-" + crypto.randomBytes(4).toString("hex");

  const [res] = await db.query(
    `INSERT INTO orders (user_id, order_number, total_amount, customer_name, communication_mobile, shipping_address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, orderNumber, total_amount, customer_name, communication_mobile, shipping_address]
  );

  return res.insertId;
};

export const createOrderItem = async (d) => {
  const [res] = await db.query(
    `INSERT INTO order_items
     (order_id, product_type, pooja_variant_id, chadawa_item_id, product_id, temple_id, quantity, price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      d.order_id,
      d.product_type,
      d.pooja_variant_id,
      d.chadawa_item_id,
      d.product_id,
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
    `SELECT 
      id, 
      order_number, 
      total_amount, 
      payment_status, 
      created_at, 
      invoice_path,
      (SELECT product_type FROM order_items WHERE order_id = orders.id LIMIT 1) as order_type
     FROM orders 
     WHERE user_id=? 
     ORDER BY created_at DESC`,
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

export const getAllOrders = async ({ search = "", type = "", status = "", page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  let params = [];
  let whereClauses = [];

  if (search) {
    whereClauses.push(`(o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    whereClauses.push(`o.payment_status = ?`);
    params.push(status);
  }

  // To filter by order_type (which is from order_items), 
  // we do a sub-select filter or join. Sub-select is easier for first item type.
  if (type) {
    whereClauses.push(`(SELECT product_type FROM order_items WHERE order_id = o.id LIMIT 1) = ?`);
    params.push(type);
  }

  const whereStr = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Get total count
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) as total FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ${whereStr}`,
    params
  );

  // Get records
  const [rows] = await db.query(
    `SELECT 
      o.*, 
      u.name AS user_name, 
      u.email,
      (SELECT product_type FROM order_items WHERE order_id = o.id LIMIT 1) as order_type
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ${whereStr}
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, parseInt(limit), parseInt(offset)]
  );

  return {
    data: rows,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit)
  };
};

export const getOrderItems = async (orderId) => {
  const [items] = await db.query(
    `SELECT 
        oi.*,
        p.title as pooja_title,
        pv.persons as pooja_persons,
        ci.title as chadawa_item_title,
        prod.name as product_name,
        t.title as temple_title
     FROM order_items oi
     LEFT JOIN pooja_variants pv ON pv.id = oi.pooja_variant_id
     LEFT JOIN poojas p ON p.id = pv.pooja_id
     LEFT JOIN chadawa_items ci ON ci.id = oi.chadawa_item_id
     LEFT JOIN products prod ON prod.id = oi.product_id
     LEFT JOIN temples t ON t.id = oi.temple_id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  for (const item of items) {
    // Fetch Addons
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

    // Fetch Bookings (Devotees)
    const [bookings] = await db.query(
      `SELECT devotee_name, gotra, mobile 
       FROM bookings 
       WHERE order_item_id = ?`,
      [item.id]
    );
    item.bookings = bookings;
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
        o.invoice_path,
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
