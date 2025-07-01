const express = require("express");
const router = express.Router();
const BankDetails = require("../models/BankDetails");
const mongoose = require("mongoose");

// @route POST /api/bank-details/:userId
// @desc Create or update (upsert) bank details
router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { accountHolder, accountNumber, ifsc, bankName, branch } = req.body;

  try {
    const updatedDetails = await BankDetails.findOneAndUpdate(
      { userId },
      {
        $set: {
          accountHolder,
          accountNumber,
          ifsc,
          bankName,
          branch,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Bank details saved", data: updatedDetails });
  } catch (err) {
    res.status(500).json({ message: "Failed to save bank details", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const allDetails = await BankDetails.find().populate("userId", "name email");
    res.status(200).json(allDetails);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bank details", error: err.message });
  }
});


router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const details = await BankDetails.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!details) {
      return res.status(404).json({ message: "No bank details found" });
    }

    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving bank details", error: err.message });
  }
});

// @route PATCH /api/bank-details/:userId
// @desc Update existing bank details
router.patch("/:userId", async (req, res) => {
  const { userId } = req.params;
  const updateFields = req.body;

  try {
    const updated = await BankDetails.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Bank details not found to update" });
    }

    res.status(200).json({ message: "Bank details updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update bank details", error: err.message });
  }
});

module.exports = router;
