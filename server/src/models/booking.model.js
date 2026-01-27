import db from "../config/db.js";

export const createBookingsFromOrder = async (d) => {
  const [items] = await db.query(
    `SELECT id FROM order_items
     WHERE order_id=? AND product_type='pooja_variant'`,
    [d.order_id]
  );

  for (const item of items) {
    await db.query(
      `INSERT INTO bookings
       (order_item_id, pooja_date, devotee_name, gotra, mobile)
       VALUES (?, ?, ?, ?, ?)`,
      [
        item.id,
        d.pooja_date,
        d.devotee_name,
        d.gotra,
        d.mobile,
      ]
    );
  }
};

export const getBookingsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT b.*, o.order_number
     FROM bookings b
     JOIN order_items oi ON oi.id=b.order_item_id
     JOIN orders o ON o.id=oi.order_id
     WHERE o.user_id=?
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows;
};

export const getAllBookings = async () => {
  const [rows] = await db.query(
    `SELECT * FROM bookings ORDER BY created_at DESC`
  );
  return rows;
};

export const updateBookingStatus = async (id, status) => {
  await db.query(
    `UPDATE bookings SET status=? WHERE id=?`,
    [status, id]
  );
};
