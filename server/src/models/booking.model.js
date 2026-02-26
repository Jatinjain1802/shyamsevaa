import db from "../config/db.js";

export const createBookingsFromOrder = async (d) => {
  const [items] = await db.query(
    `SELECT id FROM order_items
     WHERE order_id=? AND product_type='pooja_variant'`,
    [d.order_id]
  );

  for (const item of items) {
    if (d.sankalp && Array.isArray(d.sankalp)) {
      for (const person of d.sankalp) {
        await db.query(
          `INSERT INTO bookings
           (order_item_id, pooja_date, devotee_name, gotra, mobile)
           VALUES (?, ?, ?, ?, ?)`,
          [
            item.id,
            d.pooja_date,
            person.name,
            person.gotra,
            d.mobile || null,
          ]
        );
      }
    } else {
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
  }
};

export const getBookingsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT 
        b.*, 
        o.order_number,
        pv.persons as variant_persons,
        p.title as pooja_title,
        p.image as pooja_image,
        t.title as temple_title,
        oi.price as base_price
     FROM bookings b
     JOIN order_items oi ON oi.id = b.order_item_id
     JOIN orders o ON o.id = oi.order_id
     JOIN pooja_variants pv ON pv.id = oi.pooja_variant_id
     JOIN poojas p ON p.id = pv.pooja_id
     JOIN temples t ON t.id = oi.temple_id
     WHERE o.user_id = ?
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows;
};

export const getAllBookings = async () => {
  const [rows] = await db.query(
    `SELECT 
        b.*, 
        o.order_number,
        u.name as user_name,
        u.email as user_email,
        p.title as pooja_title,
        t.title as temple_title
     FROM bookings b
     JOIN order_items oi ON oi.id = b.order_item_id
     JOIN orders o ON o.id = oi.order_id
     JOIN users u ON u.id = o.user_id
     JOIN pooja_variants pv ON pv.id = oi.pooja_variant_id
     JOIN poojas p ON p.id = pv.pooja_id
     JOIN temples t ON t.id = oi.temple_id
     ORDER BY b.created_at DESC`
  );
  return rows;
};

export const updateBookingStatus = async (id, status) => {
  await db.query(
    `UPDATE bookings SET status=? WHERE id=?`,
    [status, id]
  );
};
