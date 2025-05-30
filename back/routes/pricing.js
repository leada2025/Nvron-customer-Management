const express = require("express");
const Pricing = require("../models/Pricing");
const { authenticate, authorizePermissions } = require("../middleware/auth");

const router = express.Router();

// Create pricing (sales)
router.post(
  "/",
  authenticate,
  authorizePermissions("Manage Pricing"),
  async (req, res) => {
    try {
      const { customerId, productId, proposedRate, minRate } = req.body;
      const pricing = new Pricing({
        customerId,
        productId,
        proposedRate,
        minRate,
      });
      await pricing.save();
      res.status(201).json({ message: "Pricing proposal submitted", pricing });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Approve pricing (billing)
router.patch(
  "/:id/approve",
  authenticate,
  authorizePermissions("Approve Pricing"),
  async (req, res) => {
    try {
      const { approvedRate } = req.body;
      const pricing = await Pricing.findById(req.params.id);
      if (!pricing)
        return res.status(404).json({ message: "Pricing not found" });

      pricing.approvedRate = approvedRate;
      pricing.status = "approved";
      pricing.approvedAt = new Date(); 
      await pricing.save();

      const Product = require("../models/Product");
     await Product.findByIdAndUpdate(pricing.productId, {
  approved: true,
       // or you can set mrp and netRate differently as per logic
  netRate: approvedRate,
});

      res.json({
        message: "Pricing approved and product marked as approved",
        pricing,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Get all pricing
router.get(
  "/",
  authenticate,
  authorizePermissions("Approve Pricing"),
  async (req, res) => {
    try {
      const pricing = await Pricing.find()
        .populate("customerId")
        .populate("productId");
      res.json(pricing);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// Delete pricing entry
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("Manage Pricing", "Approve Pricing"),
  async (req, res) => {
    try {
      const pricing = await Pricing.findByIdAndDelete(req.params.id);
      if (!pricing) {
        return res.status(404).json({ message: "Pricing not found" });
      }
      res.json({ message: "Pricing deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


module.exports = router;
