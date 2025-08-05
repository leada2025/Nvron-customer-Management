const express = require("express");
const Order = require("../models/Order");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const requireAuth = require("../middleware/requireAuth");
const User = require("../models/User");
const Commission = require("../models/CommissionConfig");
const Payout = require("../models/Payout");
const PartnerCommission = require("../models/PartnerCommission");
const NegotiationRequest = require("../models/NegotiationRequest");
const nodemailer = require("nodemailer");





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

    const isSelfPartner = customer?.position?.toLowerCase() === "partners";
    const referredPartner = customer?.partnerRef
      ? await User.findById(customer.partnerRef)
      : null;
    const validRefPartner = referredPartner && referredPartner.position === "Partners";

    const payoutPartner = isSelfPartner
      ? customer
      : validRefPartner
      ? referredPartner
      : null;

    if (payoutPartner) {
      // ✅ Fetch commission config from DB
     // Try to fetch partner-specific commission config
let slabs = [];
let fixedRate = 9;

const partnerCommission = await PartnerCommission.findOne({ partnerId: payoutPartner._id });

if (partnerCommission) {
  slabs = partnerCommission.slabs || [];
  fixedRate = partnerCommission.fixedPTSRate || 9;
} else {
  const globalConfig = await Commission.findOne();
  slabs = globalConfig?.slabs || [];
  fixedRate = globalConfig?.fixedPTSRate || 9;
}


      // ✅ Check if any product has special pricing applied
      const hasApprovedSpecialRate = await NegotiationRequest.exists({
  customerId: req.user.userId,
  status: "approved",
});

      // ✅ Dynamic commission logic
      const getCommissionPercent = (total, hasSpecialRate, slabs = [], fixedRate = 9) => {
        if (!hasSpecialRate) return fixedRate;
        for (const slab of slabs) {
          if (total >= slab.from && total <= slab.to) {
            return slab.percent;
          }
        }
        return 0;
      };

      const commissionPercent = getCommissionPercent(subtotal, hasApprovedSpecialRate, slabs, fixedRate);
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

      await Payout.create({
        partnerId: payoutPartner._id,
        referredCustomerId: isSelfPartner ? null : customer._id,
        orderId: order._id,
        commissionAmount: Math.ceil(commissionAmount * 100) / 100,
        commissionPercent,
        commissionSource:  hasApprovedSpecialRate ? "Slab" : "Fixed",
        products: productBreakdown,
      });
// Send Email to Admin after order placement
try {
 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
});


  // 🧾 Generate item breakdown
  const itemListHtml = order.items.map(item => `
    <tr>
      <td style="border:1px solid #ccc;padding:8px;">${item.productName}</td>
      <td style="border:1px solid #ccc;padding:8px;">${item.quantity}</td>
      <td style="border:1px solid #ccc;padding:8px;">₹${item.netRate.toFixed(2)}</td>
      <td style="border:1px solid #ccc;padding:8px;">${item.tax}%</td>
      <td style="border:1px solid #ccc;padding:8px;">₹${(item.netRate * item.quantity).toFixed(2)}</td>
    </tr>
  `).join("");

  const emailBody = `
    <h2>🛒 New Order Placed</h2>
    <p><strong>Name:</strong> ${customer.name}</p>
    <p><strong>Email:</strong> ${customer.email}</p>
    <p><strong>Position:</strong> ${customer.position || "N/A"}</p>
    <p><strong>Place of Supply:</strong> ${customer.placeOfSupply || "N/A"}</p>
    <p><strong>Note:</strong> ${order.note || "None"}</p>
    <hr />
    <h3>🧾 Order Details</h3>
    <table style="border-collapse:collapse;width:100%;margin-top:10px;">
      <thead>
        <tr>
          <th style="border:1px solid #ccc;padding:8px;">Product</th>
          <th style="border:1px solid #ccc;padding:8px;">Qty</th>
          <th style="border:1px solid #ccc;padding:8px;">Rate</th>
          <th style="border:1px solid #ccc;padding:8px;">Tax</th>
          <th style="border:1px solid #ccc;padding:8px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemListHtml}
      </tbody>
    </table>

    <p><strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}</p>
    <p><strong>Tax:</strong> ₹${order.taxAmount.toFixed(2)}</p>
    <p><strong>Shipping:</strong> ₹${order.shippingCharge.toFixed(2)}</p>
    <p><strong><u>Total Amount:</u></strong> ₹${order.totalAmount.toFixed(2)}</p>
    <hr />
    <p style="color:gray;font-size:12px;">Order ID: ${order._id}</p>
    <p style="color:gray;font-size:12px;">Placed on: ${new Date(order.createdAt).toLocaleString()}</p>
  `;

await transporter.sendMail({
  from: `"Order System" <${process.env.ADMIN_EMAIL}>`,
  to: [process.env.ADMIN_RECEIVER_EMAIL, process.env.SECONDARY_RECEIVER_EMAIL],
  subject: `🆕 New Order from ${customer.name}`,
  html: emailBody,
}, (err, info) => {
  if (err) {
    console.error("❌ Email send failed:", err);
  } else {
    console.log("✅ Email sent:", info.response);
  }
});

} catch (emailErr) {
  console.error("❌ Failed to send order email:", emailErr.message);
}



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

// ✅ Update shippingCharge & totalAmount
router.put("/:id/shipping", requireAuth({ permission: "Manage Orders" }), async (req, res) => {
  try {
    const orderId = req.params.id;
    const { shippingCharge } = req.body;

    if (isNaN(shippingCharge)) {
      return res.status(400).json({ message: "Invalid shipping charge" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.shippingCharge = parseFloat(shippingCharge);
    order.totalAmount = parseFloat(
      (order.subtotal || 0) + (order.taxAmount || 0) + order.shippingCharge
    ).toFixed(2);

    await order.save();

    res.json({
      message: "Shipping charge updated",
      order,
    });
  } catch (err) {
    console.error("Error updating shipping charge:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
