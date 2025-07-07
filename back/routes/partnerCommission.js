// routes/partnerCommission.js
const express = require("express");
const router = express.Router();
const PartnerCommission = require("../models/PartnerCommission");


// ✅ Get commission config for a specific partner
router.get("/:partnerId",  async (req, res) => {
  try {
    const { partnerId } = req.params;
    const config = await PartnerCommission.findOne({ partnerId });

    if (!config) {
      return res.status(404).json({ message: "No custom commission config found for this partner." });
    }

    res.json(config);
  } catch (err) {
    console.error("GET /api/partner-commission failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create or Update config
router.put("/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { slabs, fixedPTRRate, fixedPTSRate } = req.body;

    let config = await PartnerCommission.findOne({ partnerId });

    if (!config) {
      config = new PartnerCommission({ partnerId });
    }

    if (Array.isArray(slabs)) config.slabs = slabs;
    if (typeof fixedPTRRate === "number") config.fixedPTRRate = fixedPTRRate;
    if (typeof fixedPTSRate === "number") config.fixedPTSRate = fixedPTSRate;

    await config.save();
    res.json({ message: "Partner commission config saved", config });
  } catch (err) {
    console.error("PUT /api/partner-commission failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
