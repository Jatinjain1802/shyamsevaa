import * as PaymentModel from "../models/payment.model.js";
import * as BookingModel from "../models/booking.model.js";
import crypto from "crypto";

export const createPayment = async (req, res) => {
  try {
    const { order_id } = req.body;

    const order = await PaymentModel.getOrder(order_id, req.user.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    }

    // dummy payment id
    const paymentId = "DUMMY_PAY_" + crypto.randomBytes(5).toString("hex");

    res.json({
      success: true,
      payment_id: paymentId,
      amount: order.total_amount,
      message: "Dummy payment created",
    });
  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ success: false });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, pooja_date, devotee_name, gotra, mobile } =
      req.body;

    const order = await PaymentModel.getOrder(order_id, req.user.id);
    if (!order) {
      return res.status(404).json({ success: false });
    }

    // 1️⃣ mark order as paid
    await PaymentModel.markOrderPaid(order_id, payment_id);

    // 2️⃣ create bookings (only pooja items)
    await BookingModel.createBookingsFromOrder({
      order_id,
      pooja_date,
      devotee_name,
      gotra,
      mobile,
    });

    res.json({
      success: true,
      message: "Payment verified (dummy) & booking created",
    });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ success: false });
  }
};
