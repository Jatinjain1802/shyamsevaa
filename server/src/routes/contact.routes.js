import express from "express";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

// POST /api/contact
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 1. Send email to admin (info@shyampuja.com)
    await sendEmail({
      to: process.env.EMAIL_USER || "info@shyampuja.com",
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #800000;">New Inquiry from Shyampuja Website</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Subject:</b> ${subject}</p>
          <p><b>Message:</b></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #800000;">${message}</p>
        </div>
      `,
    });

    // 2. Send confirmation email to user
    await sendEmail({
      to: email,
      subject: "We've received your inquiry - Shyampuja",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <img src="https://shyampuja.com/logo.png" alt="Shyampuja" style="width: 80px; margin-bottom: 20px;">
          <h2 style="color: #800000;">Namaste ${name},</h2>
          <p>Thank you for reaching out to Shyampuja.</p>
          <p>We have received your query regarding: <b>"${subject}"</b>.</p>
          <p>Our team will review your message and get back to you within 24-48 hours during our helpline hours (9 AM - 9 PM).</p>
          <br>
          <p style="color: #888; font-size: 12px;">May the divine blessings be with you always.</p>
          <p style="color: #888; font-size: 12px;">Team Shyampuja</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});

export default router;
