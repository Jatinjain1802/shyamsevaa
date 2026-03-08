import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AuthModel from "../models/auth.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
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

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
    });

    // Store refresh token in DB
    await AuthModel.saveRefreshToken(user.id, refreshToken);

    return res.json({
      success: true,
      message: "Login successful",
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
        city: user.city,
        state: user.state,
        created_at: user.created_at,
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

// REFRESH TOKEN
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token is required",
      });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid Refresh Token",
      });
    }

    // Check if user exists and token matches
    const user = await AuthModel.findById(decoded.id);
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    return res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
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
  const rowsUpdated = await AuthModel.saveOtp(email, otp, expiresAt);
  console.log("OTP rows updated:", rowsUpdated);

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

  console.log("------ OTP DEBUG ------");
  console.log("REQ EMAIL:", email);
  console.log("REQ OTP:", otp, typeof otp);
  console.log("DB OTP:", user?.otp, typeof user?.otp);
  console.log("DB EXPIRY:", user?.otp_expires_at);
  console.log("NOW:", new Date());
  console.log("-----------------------");

  if (!user || !user.otp || !user.otp_expires_at) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  const isOtpMatch = String(user.otp).trim() === String(otp).trim();
  const isExpired =
    Date.now() > new Date(user.otp_expires_at).getTime();

  console.log("OTP MATCH:", isOtpMatch);
  console.log("IS EXPIRED:", isExpired);

  if (!isOtpMatch || isExpired) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  return res.json({
    success: true,
    message: "OTP verified successfully",
  });
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    const user = await AuthModel.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // OPTIONAL SAFETY: ensure OTP was verified earlier
    if (!user.otp || !user.otp_expires_at) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password + clear OTP
    await AuthModel.updatePasswordAndClearOtp(email, hashedPassword);

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await AuthModel.getProfile(req.user.id);
    res.json({ success: true, user: profile });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to get profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { address, city, state, name, mobile } = req.body;
    await AuthModel.updateProfile(req.user.id, { address, city, state, name, mobile });
    
    // Get updated profile to return
    const updatedUser = await AuthModel.getProfile(req.user.id);

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};
