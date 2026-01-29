import db from "../config/db.js";

/* ===== DASHBOARD ===== */
export const getStats = async () => {
  const [[orders]] = await db.query(
    `SELECT COUNT(*) AS totalOrders FROM orders`
  );

  const [[revenue]] = await db.query(
    `SELECT SUM(total_amount) AS totalRevenue
     FROM orders WHERE payment_status='paid'`
  );

  const [[pendingBookings]] = await db.query(
    `SELECT COUNT(*) AS pendingBookings
     FROM bookings WHERE status='pending'`
  );

  const [[temples]] = await db.query(
    `SELECT COUNT(*) AS totalTemples FROM temples`
  );

  const [[poojas]] = await db.query(
    `SELECT COUNT(*) AS totalPoojas FROM poojas`
  );

  const [[chadawas]] = await db.query(
    `SELECT COUNT(*) AS totalChadawas FROM chadawas`
  );

  return {
    total_orders: orders.totalOrders,
    total_revenue: revenue.totalRevenue || 0,
    pending_bookings: pendingBookings.pendingBookings,
    total_temples: temples.totalTemples,
    total_poojas: poojas.totalPoojas,
    total_chadawas: chadawas.totalChadawas,
  };
};

/* ===== ORDERS ===== */
export const getAllOrders = async () => {
  const [rows] = await db.query(
    `
    SELECT
      o.id,
      o.order_number,
      o.total_amount,
      o.payment_status,
      o.payment_id,
      o.created_at,
      u.name AS user_name,
      u.email
    FROM orders o
    LEFT JOIN users u ON u.id=o.user_id
    ORDER BY o.created_at DESC
    `
  );
  return rows;
};

export const getOrderById = async (orderId) => {
  const [[row]] = await db.query(
    `SELECT * FROM orders WHERE id=?`,
    [orderId]
  );
  return row;
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

export const updatePaymentStatus = async (orderId, status, paymentId) => {
  await db.query(
    `UPDATE orders
     SET payment_status=?, payment_id=?
     WHERE id=?`,
    [status, paymentId || null, orderId]
  );
};

/* ===== BOOKINGS ===== */
export const getAllBookings = async () => {
  const [rows] = await db.query(
    `
    SELECT
      b.id,
      b.pooja_date,
      b.devotee_name,
      b.mobile,
      b.status,
      b.created_at,
      o.order_number
    FROM bookings b
    JOIN order_items oi ON oi.id=b.order_item_id
    JOIN orders o ON o.id=oi.order_id
    ORDER BY b.created_at DESC
    `
  );
  return rows;
};

export const updateBookingStatus = async (bookingId, status) => {
  await db.query(
    `UPDATE bookings SET status=? WHERE id=?`,
    [status, bookingId]
  );
};
