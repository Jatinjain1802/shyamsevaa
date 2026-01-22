import express from "express";
import cors from "cors";

// routes
import authRoutes from "./routes/auth.routes.js";
import templeRoutes from "./routes/temples.routes.js"
import poojas from "./routes/poojas.routes.js";
import poojaVariants from "./routes/poojaVariants.routes.js";
import poojaAddons from "./routes/poojaAddons.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/temples", templeRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/poojas", poojas);

app.use("/api/pooja-variants", poojaVariants);
app.use("/api/pooja-addons", poojaAddons);
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
