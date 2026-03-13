import * as PaymentModel from "../models/payment.model.js";
import * as BookingModel from "../models/booking.model.js";
import * as CartModel from "../models/cart.model.js";
import * as OrderModel from "../models/order.model.js";
import * as ProductModel from "../models/products.model.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { generateInvoicePDF } from "../utils/invoice.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    const options = {
      amount: Math.round(order.total_amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${order_id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("CREATE RAZORPAY ORDER ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { 
      order_id, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      pooja_date, 
      devotee_name, 
      gotra, 
      mobile,
      sankalp // Assuming sankalp might be passed as an array
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const order = await PaymentModel.getOrder(order_id, req.user.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 1️⃣ mark order as paid
    await PaymentModel.markOrderPaid(order_id, razorpay_payment_id);

    // 2️⃣ create bookings
    // Note: BookingModel.createBookingsFromOrder should be updated to handle multiple devotees if needed
    await BookingModel.createBookingsFromOrder({
      order_id,
      pooja_date,
      devotee_name,
      gotra,
      mobile,
      sankalp
    });

    // 3️⃣ clear cart
    const cart = await CartModel.getOrCreateCart(req);
    await CartModel.clearCart(cart.id);

    // 4️⃣ Reduce product stock
    const orderItems = await OrderModel.getOrderItems(order_id);
    for (const item of orderItems) {
      if (item.product_type === "product" && item.product_id) {
        await ProductModel.reduceStock(item.product_id, item.quantity);
      }
    }

    // 5️⃣ generate invoice
    const invoice_path = await generateInvoicePDF(order_id, req.user.id);

    res.json({
      success: true,
      message: "Payment verified & booking created",
      invoice_path
    });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
