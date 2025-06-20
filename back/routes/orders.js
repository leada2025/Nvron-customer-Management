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
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
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
        select: "name email assignedTo assignedBy",
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
