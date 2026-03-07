import express from "express";
import { register, login, refresh, forgotPassword, verifyOtp, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

// Register (admin/user)
router.post("/register", register);

// Login (admin/user)
router.post("/login", login);
router.post("/refresh", refresh);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;