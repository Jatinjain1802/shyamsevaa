import db from "../config/db.js";

export const getOrder = async (orderId, userId) => {
  const [[row]] = await db.query(
    `
    SELECT
      o.id,
      o.order_number,
      o.customer_name,
      o.communication_mobile,
      o.total_amount,
      o.payment_status,
      oi.product_type AS primary_product_type,
      COALESCE(p.title, ci.title, prod.name, 'your selected item') AS primary_item_name
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN pooja_variants pv ON pv.id = oi.pooja_variant_id
    LEFT JOIN poojas p ON p.id = pv.pooja_id
    LEFT JOIN chadawa_items ci ON ci.id = oi.chadawa_item_id
    LEFT JOIN products prod ON prod.id = oi.product_id
    WHERE o.id = ? AND o.user_id = ?
    ORDER BY oi.id ASC
    LIMIT 1
    `,
    [orderId, userId]
  );
  return row;
};


export const markOrderPaid = async (orderId, paymentId) => {
  await db.query(
    `
    UPDATE orders
    SET payment_status='paid', payment_id=?
    WHERE id=?
    `,
    [paymentId, orderId]
  );
};

