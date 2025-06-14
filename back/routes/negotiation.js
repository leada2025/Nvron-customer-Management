const express = require("express");
const router = express.Router();
const NegotiationRequest = require("../models/NegotiationRequest");
const { authenticate } = require("../middleware/auth");
const requireAuth = require("../middleware/requireAuth");
const Product = require("../models/Product");
const User = require("../models/User"); // Adjust path if needed


router.post("/", authenticate, async (req, res) => {
  try {
    const { productId, proposedPrice } = req.body;

    const negotiation = new NegotiationRequest({
      productId,
      customerId: req.user.userId, 
      proposedPrice,
    });

    await negotiation.save();
    res.status(201).json({ message: "Negotiation request submitted", negotiation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/", requireAuth({ permission: "Manage Pricing" }), async (req, res) => {
  try {
    const isAdmin = req.user.role?.toLowerCase() === "admin";
    const hasFullAccess = req.user.permissions?.includes("View Orders"); // Optional override permission

    let filter = { status: "pending" };

    if (!isAdmin && !hasFullAccess) {
      const assignedCustomers = await User.find({
        $or: [
          { assignedBy: req.user.userId },
          { assignedTo: req.user.userId },
        ],
      }).select("_id");

      const customerIds = assignedCustomers.map((cust) => cust._id);
      filter.customerId = { $in: customerIds };
    }

    const requests = await NegotiationRequest.find(filter)
      .populate("productId", "name dosageForm packing description mrp")
      .populate("customerId", "name email");

    res.json(requests);
  } catch (err) {
    console.error("Failed to fetch negotiation requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

router.get("/pending", requireAuth({ permission: "Approve Pricing" }), async (req, res) => {
  try {
    const pending = await NegotiationRequest.find({ status: { $in: ["pending", "proposed"] } })
      .populate("productId customerId");

    console.log("Pending/proposed negotiation requests:", pending);
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending negotiations" });
  }
});


router.get("/special-prices", requireAuth(), async (req, res) => {
  try {
    const customerId = req.user.userId;

    const specialPrices = await NegotiationRequest.find({
      customerId,
      status: "approved",
    }).select("productId approvedPrice");

    res.json(specialPrices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch special prices" });
  }
});


// GET approved negotiations (for Sales team)
router.get("/approved", requireAuth({ permission: "Manage Pricing" }), async (req, res) => {
  try {
    const isAdmin = req.user.role?.toLowerCase() === "admin";
    const hasFullAccess = req.user.permissions?.includes("View Orders");

    let filter = { status: "approved" };

    if (!isAdmin && !hasFullAccess) {
      const assignedCustomers = await User.find({
        $or: [
          { assignedBy: req.user.userId },
          { assignedTo: req.user.userId },
        ],
      }).select("_id");

      const customerIds = assignedCustomers.map((cust) => cust._id);
      filter.customerId = { $in: customerIds };
    }

    const approved = await NegotiationRequest.find(filter)
      .populate("productId", "name mrp")
      .populate("customerId", "name email");

    res.json(approved);
  } catch (err) {
    console.error("Failed to fetch approved negotiations:", err);
    res.status(500).json({ error: "Failed to fetch approved requests" });
  }
});

router.get("/customer-history", authenticate, async (req, res) => {
  try {
    const customerId = req.user.userId;
    const history = await NegotiationRequest.find({ customerId })
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.error("Failed to fetch history:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});



router.patch(
  "/reopen/:id",
  requireAuth({ permission: "Manage Pricing" }),
  async (req, res) => {
    try {
      const negotiation = await NegotiationRequest.findById(req.params.id);

      if (!negotiation) {
        return res.status(404).json({ message: "Negotiation not found" });
      }

      // Reset status and pricing fields
      negotiation.status = "pending";
      negotiation.salesProposedRate = null;
negotiation.approvedPrice = null;

      negotiation.approvedRate = null;
      negotiation.approvedAt = null;

      await negotiation.save();

      res.json({ message: "Negotiation successfully reopened", negotiation });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to reopen negotiation" });
    }
  }
);



router.put("/:id/propose", requireAuth({ permission: "Manage Pricing" }), async (req, res) => {
  const { proposedRate } = req.body;

  try {
    const updated = await NegotiationRequest.findByIdAndUpdate(
      req.params.id,
      { salesProposedRate: proposedRate, status: "proposed" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Request not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit proposed rate" });
  }
});


// PATCH /api/negotiations/:id/approve
router.patch(
  "/approve/:id",
  requireAuth({ permission: "Approve Pricing" }),
  async (req, res) => {
    try {
      const negotiation = await NegotiationRequest.findById(req.params.id)
        .populate("productId customerId");

      if (!negotiation) {
        return res.status(404).json({ message: "Negotiation not found" });
      }

      // 🔒 Ensure salesProposedRate exists
      if (!negotiation.salesProposedRate) {
        return res.status(400).json({ message: "Sales proposed rate missing" });
      }

      negotiation.status = "approved";
      negotiation.approvedPrice = negotiation.salesProposedRate;

      await negotiation.save();

      // ✅ Save special price per customer
      const product = await Product.findById(negotiation.productId);
      if (!product.specialPricing) product.specialPricing = new Map();

      product.specialPricing.set(
        negotiation.customerId._id.toString(),
        negotiation.salesProposedRate
      );

      await product.save();

      res.json({ message: "Price approved successfully", negotiation });
    } catch (err) {
      console.error("Approval error:", err);
      res.status(500).json({ message: "Failed to approve negotiation" });
    }
  }
);




module.exports = router;
