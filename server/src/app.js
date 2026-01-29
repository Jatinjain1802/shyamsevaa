import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// load env
dotenv.config();

// DB init
import "./config/db.js";

// ================= ROUTES =================

// Auth
import authRoutes from "./routes/auth.routes.js";

// Core Masters
import templeRoutes from "./routes/temples.routes.js";
import poojaRoutes from "./routes/poojas.routes.js";
import poojaVariantsRoutes from "./routes/poojaVariants.routes.js";
import poojaAddonsRoutes from "./routes/poojaAddons.routes.js";
import poojaTemplesRoutes from "./routes/poojaTemples.routes.js";

// Chadawa
import chadawaRoutes from "./routes/chadawas.routes.js";

// Panchang
import panchangRoutes from "./routes/panchang.routes.js";

// Cart
import cartRoutes from "./routes/cart.routes.js";

// Order + Booking (user + admin)
import orderBookingRoutes from "./routes/orderBooking.routes.js";

// Payments (dummy for now)
import paymentRoutes from "./routes/payment.routes.js";

// Admin Dashboard
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";

// Blogs (optional but DB me hai)
//import blogRoutes from "./routes/blog.routes.js";

// ================= APP INIT =================
const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "*", // later restrict
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 ShyamSevaa API is running",
  });
});

// ================= ROUTE REGISTRATION =================

// Auth
app.use("/api/auth", authRoutes);

// Temples
app.use("/api/temples", templeRoutes);

// Poojas (admin + user)
app.use("/api/poojas", poojaRoutes);

// Pooja relations
app.use("/api", poojaTemplesRoutes);   // /pooja-temples
app.use("/api", poojaAddonsRoutes);    // /pooja-addons
app.use("/api/admin", poojaVariantsRoutes); // /admin/pooja-variants

// Chadawa
app.use("/api", chadawaRoutes);

// Panchang
app.use("/api/panchang", panchangRoutes);

// Cart
app.use("/api", cartRoutes);

// Checkout + Orders + Bookings
app.use("/api", orderBookingRoutes);

// Payments
app.use("/api", paymentRoutes);

// Admin Dashboard (orders, bookings, stats)
app.use("/api", adminDashboardRoutes);

// Blogs
//app.use("/api/blogs", blogRoutes);

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
