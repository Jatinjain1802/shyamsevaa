import express from "express";
import { register, login, refresh, forgotPassword, verifyOtp, resetPassword, getProfile, updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register (admin/user)
router.post("/register", register);

// Login (admin/user)
router.post("/login", login);
router.post("/refresh", refresh);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// Profile
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;