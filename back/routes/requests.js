const express = require("express");
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
    res.status(201).json({ message: "Service request submitted", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

module.exports = router;
