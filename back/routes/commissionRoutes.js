const express = require("express");
const router = express.Router();
const CommissionConfig = require("../models/CommissionConfig");


// GET: Fetch commission config
router.get("/",async (req, res) => {
  try {
    let config = await CommissionConfig.findOne();
    if (!config) {
      config = await CommissionConfig.create({
        slabs: [
          { from: 0, to: 1999, percent: 3 },
          { from: 2000, to: 4999, percent: 4 },
          { from: 5000, to: 9999, percent: 5 },
          { from: 10000, to: 19999, percent: 6 },
          { from: 20000, to: 49999, percent: 7 },
          { from: 50000, to: 99999, percent: 8 },
          { from: 100000, to: 199999, percent: 9 },
          { from: 200000, to: 299999, percent: 10 },
        ],
        fixedPTRRate: 10,
        fixedPTSRate: 9,
      });
    }
    res.json(config);
  } catch (err) {
    console.error("GET /api/commission failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Update config (Admin only)
router.put("/",async (req, res) => {
  try {
    const { slabs, fixedPTRRate, fixedPTSRate } = req.body;

    let config = await CommissionConfig.findOne();
    if (!config) {
      config = new CommissionConfig();
    }

    if (Array.isArray(slabs)) config.slabs = slabs;
    if (typeof fixedPTRRate === "number") config.fixedPTRRate = fixedPTRRate;
    if (typeof fixedPTSRate === "number") config.fixedPTSRate = fixedPTSRate;

    await config.save();
    res.json({ message: "Commission config updated", config });
  } catch (err) {
    console.error("PUT /api/commission failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
