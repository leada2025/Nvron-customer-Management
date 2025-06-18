const express = require("express");
const ServiceRequest = require("../models/ServiceRequest");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", authenticate, authorizeRoles("customer"), async (req, res) => {
  try {
    const { title, description } = req.body;

    // Save the service request
    const request = new ServiceRequest({
      customerId: req.user.userId,
      title,
      description
    });

    await request.save();

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "softdevldd@gmail.com",
      subject: `New Service Request from ${req.user.name || "Customer"}`,
      text: `
New service request has been submitted.

Title: ${title}
Description: ${description}

Submitted by:
Name: ${req.user.name || "N/A"}
Email: ${req.user.email || "N/A"}
UserID: ${req.user.userId}
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Service request submitted and email sent", request });

  } catch (err) {
    console.error("Error in request submission or mail:", err.message);
    res.status(500).json({ message: "Failed to submit request or send email." });
  }
});

router.get("/", authenticate, authorizeRoles("sales"), async (req, res) => {
  try {
    const requests = await ServiceRequest.find().populate("customerId", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", authenticate, authorizeRoles("sales"), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Service request not found" });
    }

    res.json({ message: "Status updated", updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
