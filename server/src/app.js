import express from "express";
import cors from "cors";

// routes
import authRoutes from "./routes/auth.routes.js";
import templeRoutes from "./routes/temples.routes.js"
import poojaRoutes from "./routes/poojas.routes.js";
import poojaVariantsRoutes from "./routes/poojaVariants.routes.js";
import poojaAddonsRoutes from "./routes/poojaAddons.routes.js";
import poojaTemplesRoutes from "./routes/poojaTemples.routes.js";
import chadawaRoutes from "./routes/chadawas.routes.js";
import cartRoutes from "./routes/cart.routes.js";



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/poojas", poojaRoutes);
app.use("/api", poojaTemplesRoutes);
app.use("/api", poojaAddonsRoutes);
app.use("/api/admin", poojaVariantsRoutes);

// ADMIN
app.use("/api", chadawaRoutes);
app.use("/api", cartRoutes);
// Base route

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
