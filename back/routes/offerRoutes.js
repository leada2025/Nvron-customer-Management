const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const mongoose = require("mongoose");

// Create Offer
router.post("/", async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Valid userId required" });
    }

    let offers;
    if (userId) {
      offers = await Offer.find({
        $or: [
          { eligibleFor: "All" },
          { eligibleUsers: userId },
        ],
      }).sort({ createdAt: -1 });
    } else {
      offers = await Offer.find().sort({ createdAt: -1 });
    }

    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Update Offer
router.put("/:id", async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Offer (Expire)
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer expired" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
