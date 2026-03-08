import db from "../config/db.js";

export const getOrder = async (orderId, userId) => {
  const [[row]] = await db.query(
    `
    SELECT id, order_number, customer_name, communication_mobile, total_amount, payment_status
    FROM orders
    WHERE id=? AND user_id=?
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

