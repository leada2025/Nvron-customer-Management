const express = require("express");
const router = express.Router();
const Distributor = require("../models/Distributor");
const User = require("../models/User");

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

    res.status(200).json({ message: "Distributor approved", distributor });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
});

module.exports = router;
