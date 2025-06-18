const express = require("express");
const nodemailer = require("nodemailer"); // 🔹 Added
const ServiceRequest = require("../models/ServiceRequest");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticate, authorizeRoles("customer"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const request = new ServiceRequest({
      customerId: req.user.userId,
      title,
      description
    });
    await request.save();

    // 🔹 Email sending logic
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // e.g., yourcompany@gmail.com
        pass: process.env.EMAIL_PASS, // App password from Gmail
      },
    });

    const mailOptions = {
      from: `"Support Request" <${process.env.EMAIL_USER}>`,
      to: "selvasaravanarajj@gmail.com",
      subject: "New Support Request Submitted",
      html: `
        <h3>New Support Request</h3>
        <p><strong>Customer ID:</strong> ${req.user.userId}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Description:</strong><br>${description}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send failed:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({ message: "Service request submitted", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
