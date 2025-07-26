const express = require("express");
const router = express.Router();
const Distributor = require("../models/Distributor");
const User = require("../models/User");
const nodemailer = require("nodemailer");
require("dotenv").config();

const logoURL = "https://orders.fishmanb2b.in/fishman3.png"
// Setup email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,           // sender address
    pass: process.env.ADMIN_EMAIL_PASS       // app password
  },
});

// POST /api/distributors/signup
router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existing = await Distributor.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already exists." });
  }

  try {
    const newDistributor = new Distributor({ name, email, phone, password });
    await newDistributor.save();

     const emailBody = `
      <h2>🆕 New Distributor Partner Signup Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p>Status: <b>Pending</b></p>
    `;

    // ✉️ Send email to admin and secondary email
     await transporter.sendMail({
      from: `"Distributor System" <${process.env.ADMIN_EMAIL}>`,
      to: [process.env.ADMIN_RECEIVER_EMAIL, process.env.SECONDARY_RECEIVER_EMAIL],
      subject: "New Distributor Signup Request",
      html: emailBody,
    });
    res.status(201).json({ message: "Distributor registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/:userId/customers", async (req, res) => {
  try {
    const customers = await User.find({ partnerRef: req.params.userId })
      .select("name email phone createdAt");
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/distributors/pending
// GET /api/distributors/pending
router.get("/pending", async (req, res) => {
  try {
    const pendingDistributors = await Distributor.find({ status: "pending" }).select("name email phone password");
    res.status(200).json(pendingDistributors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



router.get("/approved", async (req, res) => {
  try {
    const approvedDistributors = await Distributor.find({ status: "approved" }).select("name email phone password");

    const enriched = await Promise.all(
      approvedDistributors.map(async (dist) => {
        const user = await User.findOne({ email: dist.email }).select("_id");
        if (!user) return null; // ✅ Skip if user doesn't exist
        return {
          ...dist.toObject(),
          userId: user._id,
        };
      })
    );

    // Remove any null entries where user was not found
    const filtered = enriched.filter(d => d !== null);

    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// PATCH /api/distributors/approve/:id
router.patch("/approve/:id", async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!distributor) {
      return res.status(404).json({ message: "Distributor not found" });
    }

    await transporter.sendMail({
      from: `"Distributor System" <${process.env.ADMIN_EMAIL}>`,
      to: distributor.email,
      subject: "🎉 Distributor Application Approved",
      html: `
        <div style="font-family: sans-serif;">
          <img src="${logoURL}" alt="Logo" style="max-width: 180px; margin-bottom: 20px;" />
          <h2 style="color: green;">✅ Your Distributor Application Has Been Approved</h2>
          <p>Dear ${distributor.name},</p>
          <p>We’re happy to inform you that your application to become a Distributor Partner has been <strong>approved</strong>.</p>
          <p>You can now log in using your registered credentials.</p>
          <br/>
          <p>Welcome aboard! 🚀</p>
          <br/>
          <p>Best regards,<br/>The Team at Fishman</p>
          <p style="color: #555;">📞 Contact: +91 8072437202</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Distributor approved and email sent", distributor });
  } catch (err) {
    console.error("Approval failed:", err);
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
});


// REJECT ROUTE
router.patch("/reject/:id", async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!distributor) return res.status(404).json({ message: "Distributor not found" });

    await transporter.sendMail({
      from: `"Distributor System" <${process.env.ADMIN_EMAIL}>`,
      to: distributor.email,
      subject: "❌ Distributor Application Rejected",
      html: `
        <div style="font-family: sans-serif;">
          <img src="${logoURL}" alt="Logo" style="max-width: 180px; margin-bottom: 20px;" />
          <h2 style="color: red;">❌ Distributor Application Rejected</h2>
          <p>Dear ${distributor.name},</p>
          <p>Your application has been reviewed and <strong>rejected</strong>.</p>
          <p>Remarks: <em>We need more details to approve your application.</em></p>
          <p>Please contact our team for clarification.</p>
          <br/>
          <p>Regards,<br/>Fishman Team</p>
          <p style="color: #555;">📞 Contact: +91 8072437202</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Distributor rejected and notified." });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed", error: err.message });
  }
});


// HOLD ROUTE
router.patch("/hold/:id", async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndUpdate(
      req.params.id,
      { status: "hold" },
      { new: true }
    );
    if (!distributor) return res.status(404).json({ message: "Distributor not found" });

    await transporter.sendMail({
      from: `"Distributor System" <${process.env.ADMIN_EMAIL}>`,
      to: distributor.email,
      subject: "⏳ Distributor Application On Hold",
      html: `
        <div style="font-family: sans-serif;">
          <img src="${logoURL}" alt="Logo" style="max-width: 180px; margin-bottom: 20px;" />
          <h2 style="color: orange;">⏳ Distributor Application On Hold</h2>
          <p>Dear ${distributor.name},</p>
          <p>Your application is currently <strong>on hold</strong>.</p>
          <p>Remarks: <em>We need more details to approve your application.</em></p>
          <p>Please reach out to our team for clarification or to provide additional information.</p>
          <br/>
          <p>Regards,<br/>Fishman Team</p>
          <p style="color: #555;">📞 Contact: +91 8072437202</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Distributor put on hold and notified." });
  } catch (err) {
    res.status(500).json({ message: "Hold failed", error: err.message });
  }
});

module.exports = router;
