const express = require("express");
const router = express.Router();
const Payout = require("../models/Payout");
const Distributor = require("../models/Distributor");
const requireAuth = require("../middleware/requireAuth");

// GET payouts for current partner
// GET payouts for current partner
router.get("/", requireAuth(), async (req, res) => {
  try {
    const user = req.user;

    const payouts = await Payout.find({ partnerId: user.userId })
      .populate({
        path: "referredCustomerId",
        select: "name email", // 👈 Show customer name/email who purchased
      })
      .sort({ createdAt: -1 });

    res.json(payouts);
  } catch (err) {
    console.error("Error fetching payouts:", err);
    res.status(500).json({ message: err.message });
  }
});



// GET /api/payouts/admin
router.get("/admin", requireAuth({ permission: "Manage Pricing" }), async (req, res) => {
  try {
  const payouts = await Payout.find()
  .populate([
    {
      path: "partnerId",
      select: "name email", // populate partner details
    },
    {
      path: "orderId",
      select: "_id", // 👈 ensure _id is included (default) or select more if needed
    },
  ])
  .sort({ createdAt: -1 });

   

    // 🔗 Join with Distributor to get phone number
    const enrichedPayouts = await Promise.all(
      payouts.map(async (p) => {
        const distributor = await Distributor.findOne({ email: p.partnerId?.email });
        return {
          ...p.toObject(),
          partnerPhone: distributor?.phone || null,
        };
      })
    );

    res.json(enrichedPayouts);
  } catch (err) {
    console.error("Admin payouts fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});


// PUT /api/payouts/:id/status
router.put("/:id/status", requireAuth({ permission: "Manage Pricing" }), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["paid", "unpaid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ message: "Payout not found" });

    payout.status = status;
    if (status === "paid") {
      payout.paidDate = new Date();
    }
    await payout.save();

    res.json({ message: "Payout status updated", payout });
  } catch (err) {
    console.error("Error updating payout status:", err);
    res.status(500).json({ message: err.message });
  }
});





module.exports = router;
