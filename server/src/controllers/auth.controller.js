import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AuthModel from "../models/auth.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await AuthModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await AuthModel.createUser({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: role || "user", // default user
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }

  const user = await AuthModel.findByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await AuthModel.saveOtp(email, otp, expiresAt);

  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP is <b>${otp}</b></p>
      <p>Valid for 10 minutes</p>
    `,
  });

  res.json({ success: true, message: "OTP sent to email" });
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await AuthModel.findByEmail(email);

  if (!user || !user.otp || !user.otp_expires_at) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  const isOtpMatch = String(user.otp) === String(otp);
  const isExpired =
    Date.now() > new Date(user.otp_expires_at).getTime();

  if (!isOtpMatch || isExpired) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }
 console.log("DB OTP:", user.otp);
console.log("REQ OTP:", otp);
console.log("DB Expiry:", user.otp_expires_at);
console.log("Now:", new Date());

  return res.json({
    success: true,
    message: "OTP verified successfully",
  });
};






export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const hashed = await bcrypt.hash(newPassword, 10);

  await AuthModel.updatePassword(email, hashed);

  res.json({ success: true, message: "Password updated successfully" });
};
