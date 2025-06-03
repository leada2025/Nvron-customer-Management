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

// Update status of a service request
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
