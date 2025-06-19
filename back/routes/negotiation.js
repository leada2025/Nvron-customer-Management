const express = require("express");
const router = express.Router();
const NegotiationRequest = require("../models/NegotiationRequest");
const { authenticate } = require("../middleware/auth");
const requireAuth = require("../middleware/requireAuth");
const Product = require("../models/Product");
const User = require("../models/User"); // Adjust path if needed


router.post("/", authenticate, async (req, res) => {
  try {
    const { productId, proposedPrice, customerId: bodyCustomerId } = req.body;

    let customerId;

    if (req.user.role === "admin" || req.user.role === "sales") {
      if (!bodyCustomerId) {
        return res.status(400).json({ message: "Customer ID is required" });
      }
      customerId = bodyCustomerId;
    } else if (req.user.role === "customer") {
      customerId = req.user.userId;
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const negotiation = new NegotiationRequest({
      productId,
      customerId,
      proposedPrice,
    });

    await negotiation.save();
    res.status(201).json({ message: "Negotiation request submitted", negotiation });
  } catch (err) {
    console.error("Negotiation creation error:", err);
    res.status(500).json({ message: err.message });
  }
});



router.get("/", requireAuth({ permission: "Manage Pricing" }), async (req, res) => {
  try {
    const isAdmin = req.user.role?.toLowerCase() === "admin";
    const hasFullAccess = req.user.permissions?.includes("View Orders"); // Optional override permission

    let filter = {};

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
    const pending = await NegotiationRequest.find({
      status: { $in: ["pending", "proposed"] },
    })
      .populate("productId customerId");

    // Filter only valid ones, in case of bad data
    const filtered = pending.filter(n =>
      n.status === "pending" || n.status === "proposed"
    );

    res.json(filtered);
  } catch (err) {
    console.error("Failed to fetch pending negotiations:", err);
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

router.put("/:id", authenticate, async (req, res) => {
  try {
    const { productId, proposedPrice, customerId } = req.body;

    const negotiation = await NegotiationRequest.findById(req.params.id);
    if (!negotiation) {
      return res.status(404).json({ message: "Negotiation not found" });
    }

    // Optional: Role-based ownership check (if needed)
    if (
      req.user.role === "sales" &&
      negotiation.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Unauthorized to edit this request" });
    }

    negotiation.productId = productId;
    negotiation.proposedPrice = proposedPrice;
    negotiation.customerId = customerId;

    await negotiation.save();

    res.json({ message: "Negotiation request updated", negotiation });
  } catch (err) {
    console.error("Negotiation update error:", err);
    res.status(500).json({ message: "Failed to update negotiation" });
  }
});



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

      if (!negotiation.salesProposedRate) {
        return res.status(400).json({ message: "Sales proposed rate missing" });
      }

      negotiation.status = "approved";
      negotiation.approvedPrice = negotiation.salesProposedRate;
      negotiation.comment = req.body.comment || ""; // ✅ store approval comment
      await negotiation.save();

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


router.patch(
  "/reject/:id",
  requireAuth({ permission: "Approve Pricing" }),
  async (req, res) => {
    try {
      const negotiation = await NegotiationRequest.findById(req.params.id);
      if (!negotiation) {
        return res.status(404).json({ message: "Negotiation not found" });
      }

      negotiation.status = "rejected";
      negotiation.comment = req.body.comment || ""; // ✅ store rejection comment
      await negotiation.save();

      res.json({ message: "Negotiation rejected", negotiation });
    } catch (err) {
      console.error("Rejection error:", err);
      res.status(500).json({ message: "Failed to reject negotiation" });
    }
  }
);



module.exports = router;
