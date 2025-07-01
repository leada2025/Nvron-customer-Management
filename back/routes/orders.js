const express = require("express");
const Order = require("../models/Order");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const requireAuth = require("../middleware/requireAuth");
const User = require("../models/User");

const router = express.Router();

// Place order
router.post("/", authenticate, authorizeRoles("Customer"), async (req, res) => {
  try {
    const { items, note, shippingCharge, subtotal, taxAmount, totalAmount } = req.body;

    const order = new Order({
      customerId: req.user.userId,
      items,
      note,
      shippingCharge,
      subtotal,
      taxAmount,
      totalAmount,
    });
    await order.save();

    const customer = await User.findById(req.user.userId);

    // Check if the customer is a Partner (self-purchase)
    const isSelfPartner = customer?.position?.toLowerCase() === "partners";

    // Check if this customer was referred by a Partner
    const referredPartner = customer?.partnerRef
      ? await User.findById(customer.partnerRef)
      : null;

    const validRefPartner = referredPartner && referredPartner.position === "Partners";

    // ✅ Determine who to pay (either self or referred partner)
    const payoutPartner = isSelfPartner
      ? customer
      : validRefPartner
      ? referredPartner
      : null;

    if (payoutPartner) {
      const getCommissionPercent = (total) => {
        if (total < 2000) return 0;
        if (total < 5000) return 3;
        if (total < 10000) return 4;
        if (total < 20000) return 6;
        if (total < 50000) return 7;
        if (total < 100000) return 8;
        if (total < 200000) return 9;
        return 10;
      };

      const commissionPercent = getCommissionPercent(subtotal);
      const commissionAmount = (subtotal * commissionPercent) / 100;

      const productBreakdown = items.map((item) => {
        const qty = Number(item.quantity) || 1;
        const unitPrice = Number(item.netRate) || 0;
        const productCommission = ((qty * unitPrice * commissionPercent) / 100);
        return {
          productName: item.productName || item.name,
          quantity: qty,
          unitPrice: unitPrice,
          productCommission: Math.ceil(productCommission * 100) / 100,
        };
      });

      const Payout = require("../models/Payout");
      await Payout.create({
        partnerId: payoutPartner._id,
        referredCustomerId: isSelfPartner ? null : customer._id, // always record who made the purchase
        orderId: order._id,
        commissionAmount: Math.ceil(commissionAmount * 100) / 100,
        commissionPercent,
        products: productBreakdown,
      });
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: err.message });
  }
});



// Get customer orders
router.get("/customer", authenticate, authorizeRoles("Customer"), async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find order by ID
    const order = await Order.findById(orderId).populate("customerId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optionally: check user is owner or has role (billing/sales) to view order
    if (
      req.user.role === "customer" &&
      order.customerId._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ✅ Get orders of a specific customer (for admin/sales)
router.get("/", requireAuth({ permission: "Manage Orders" }), async (req, res) => {
  try {
    const { customerId } = req.query;
    const user = req.user; // from auth middleware

    let filter = {};
    if (customerId) {
      filter.customerId = customerId;
    }

    // 🌟 Special filter for sales role
    if (user.role === "sales") {
      // Fetch only customers assigned to this sales person
      const userId = user.userId;

      // Instead of filtering in Mongo, fetch all then filter in JS
      const allOrders = await Order.find(filter)
        .populate({
          path: "customerId",
          select: "name email assignedTo assignedBy",
          populate: [
            { path: "assignedTo", select: "name" },
            { path: "assignedBy", select: "name" },
          ],
        })
        .sort({ createdAt: -1 });

      const filtered = allOrders.filter((order) => {
        const assignedTo = order.customerId?.assignedTo?._id?.toString();
        const assignedBy = order.customerId?.assignedBy?._id?.toString();
        return assignedTo === userId || (!assignedTo && assignedBy === userId);
      });

      return res.json(filtered);
    }

    // ✅ Admin/Billing — get all
    const orders = await Order.find(filter)
      .populate({
        path: "customerId",
        select: "name email assignedTo assignedBy placeOfSupply position",
        populate: [
          { path: "assignedTo", select: "name" },
          { path: "assignedBy", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: err.message });
  }
});


// Update order status
router.patch("/:id/status", requireAuth({ permissions: "Manage Orders" }),  async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json({ message: `Order marked as ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel with feedback
router.patch("/:id/cancel", authenticate, authorizeRoles("Customer"), async (req, res) => {
  try {
    const { feedback } = req.body;
    const order = await Order.findOne({ _id: req.params.id, customerId: req.user.userId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") return res.status(400).json({ message: "Cannot cancel order" });

    order.status = "cancelled";
    order.feedback = feedback;
    await order.save();
    res.json({ message: "Order cancelled with feedback" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
