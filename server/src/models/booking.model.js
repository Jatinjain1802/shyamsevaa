import db from "../config/db.js";

export const createBookingsFromOrder = async (d) => {
  const [items] = await db.query(
    `SELECT id, product_type FROM order_items
     WHERE order_id=? AND product_type IN ('pooja_variant', 'chadawa_item')`,
    [d.order_id]
  );

  for (const item of items) {
    if (d.sankalp && Array.isArray(d.sankalp)) {
      for (const person of d.sankalp) {
        await db.query(
          `INSERT INTO bookings
           (order_item_id, pooja_date, devotee_name, gotra, mobile, status)
           VALUES (?, ?, ?, ?, ?, 'confirmed')`,
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
         (order_item_id, pooja_date, devotee_name, gotra, mobile, status)
         VALUES (?, ?, ?, ?, ?, 'confirmed')`,
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
        COALESCE(p.title, ci.title) as pooja_title,
        p.image as pooja_image,
        t.title as temple_title,
        oi.price as base_price,
        oi.product_type
     FROM bookings b
     JOIN order_items oi ON oi.id = b.order_item_id
     JOIN orders o ON o.id = oi.order_id
     LEFT JOIN pooja_variants pv ON pv.id = oi.pooja_variant_id
     LEFT JOIN poojas p ON p.id = pv.pooja_id
     LEFT JOIN chadawa_items ci ON ci.id = oi.chadawa_item_id
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
        COALESCE(p.title, ci.title) as pooja_title,
        COALESCE(pv.description, (CASE WHEN pv.persons IS NOT NULL THEN CONCAT(pv.persons, ' Person(s)') ELSE NULL END)) as variant_title,
        t.title as temple_title,
        oi.product_type,
        (SELECT COUNT(*) FROM order_item_addons oia WHERE oia.order_item_id = oi.id) as addon_count,
        (SELECT GROUP_CONCAT(a.title SEPARATOR ', ') FROM order_item_addons oia JOIN addons a ON a.id = oia.addon_id WHERE oia.order_item_id = oi.id) as addon_details
     FROM bookings b
     JOIN order_items oi ON oi.id = b.order_item_id
     JOIN orders o ON o.id = oi.order_id
     LEFT JOIN users u ON u.id = o.user_id
     LEFT JOIN pooja_variants pv ON pv.id = oi.pooja_variant_id
     LEFT JOIN poojas p ON p.id = pv.pooja_id
     LEFT JOIN chadawa_items ci ON ci.id = oi.chadawa_item_id
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
