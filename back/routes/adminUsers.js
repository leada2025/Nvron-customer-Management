const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Pricing = require("../models/Pricing");
const Role = require("../models/Role");
const adminAuth = require("../middleware/adminAuth"); // Middleware to verify admin
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();


// Get all users (admin only)
router.get("/", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const users = await User.find()
      .populate("role", "name permissions") // Only fetch name and permissions
      .select("-passwordHash"); // Exclude the hashed password from the response

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/dashboard-stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
  // Count how many distinct products have approved pricing
const approvedPricing = await Pricing.distinct("productId", { status: "approved" });


    res.json({ users, products, pendingOrders, approvedPricing: approvedPricing.length, });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});


router.post("/",  requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;
    if (!password) return res.status(400).json({ message: "Password required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    let roleId = role;

if (typeof role === "string" && !mongoose.Types.ObjectId.isValid(role)) {
  let roleDoc = await Role.findOne({ name: role });
  if (!roleDoc) {
    roleDoc = await Role.create({ name: role, permissions: [] });
  }
  roleId = roleDoc._id;
}


    const user = new User({
      name,
      email,
      passwordHash,
      role: roleId,
      permissions,
    });

    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user (admin only)
router.put("/:id", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    if (role) {
      let roleId = role;

      if (typeof role === "string") {
        if (mongoose.Types.ObjectId.isValid(role)) {
          // role is a valid ID string, use directly
          roleId = role;
        } else {
          // role is a name string, find or create
          let roleDoc = await Role.findOne({ name: role });
          if (!roleDoc) {
            roleDoc = await Role.create({ name: role, permissions: [] });
          }
          roleId = roleDoc._id;
        }
      }

      user.role = roleId;
    }

    if (permissions) {
      user.permissions = permissions;
    }

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Delete user (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
