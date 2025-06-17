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
const enrichUserRole = require("../middleware/enrichUserRole");

const router = express.Router();


// Update this route
router.get("/", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const { excludeRole, onlyRole } = req.query;

    const isAdmin = req.user.role?.toLowerCase() === "admin";
    const hasViewAllAccess = req.user.permissions?.includes("View All Users");

    let filter = {};

    if (!isAdmin && !hasViewAllAccess) {
      filter = {
        $or: [
          { assignedBy: req.user.userId },
          { assignedTo: req.user.userId },
        ],
      };
    }

    const users = await User.find(filter)
      .populate("role", "name permissions")
      .select("-passwordHash");

    let filteredUsers = users;

    if (excludeRole) {
      filteredUsers = filteredUsers.filter(
        (u) =>
          (typeof u.role === "string" && u.role.toLowerCase() !== excludeRole.toLowerCase()) ||
          (typeof u.role === "object" && u.role?.name?.toLowerCase() !== excludeRole.toLowerCase())
      );
    }

    if (onlyRole) {
      filteredUsers = filteredUsers.filter(
        (u) =>
          (typeof u.role === "string" && u.role.toLowerCase() === onlyRole.toLowerCase()) ||
          (typeof u.role === "object" && u.role?.name?.toLowerCase() === onlyRole.toLowerCase())
      );
    }

    res.json(filteredUsers);
  } catch (err) {
    console.error("GET /admin/users error:", err);
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

router.get("/sales-dashboard-stats", requireAuth({ role: ["sales", "sale", "sales executive"] }), async (req, res) => {
  try {
    const customerRoleId = "6836fade2aa75e74345b8f1f"; // replace with actual role ObjectId

    // Find customers assignedBy or assignedTo this sales user
    const assignedCustomers = await User.find(
      {
        role: customerRoleId,
        $or: [
          { assignedBy: req.user.userId },
          { assignedTo: req.user.userId },
        ],
      },
      "_id"
    );

    const customerIds = assignedCustomers.map(c => c._id);

    // Count orders placed by these customers
    const ordersCount = await Order.countDocuments({ customerId: { $in: customerIds } });

    // Calculate total sales value for these orders
    const totalSalesValue = await Order.aggregate([
      { $match: { customerId: { $in: customerIds } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $add: [
                { $multiply: ["$items.quantity", "$items.netRate"] },
                {
                  $multiply: [
                    "$items.quantity",
                    "$items.netRate",
                    { $divide: ["$items.tax", 100] }
                  ]
                }
              ]
            }
          }
        }
      }
    ]);

    res.json({
      assignedCustomers: customerIds.length,
      orders: ordersCount,
      totalSales: totalSalesValue[0]?.total || 0,
    });

  } catch (err) {
    console.error("Sales Dashboard Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/assignable", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    // Filter users with sales-related roles or permissions
    const assignableUsers = await User.find({
      $or: [
        { "role": { $exists: true } },
        { permissions: { $in: ["Manage Orders", "Assign Clients"] } }
      ]
    })
    .populate("role", "name")
    .select("name email role");

    res.json(assignableUsers);
  } catch (err) {
    console.error("Error fetching assignable users:", err);
    res.status(500).json({ message: "Failed to fetch assignable users" });
  }
});



router.post(
  "/",
  requireAuth({ permission: "Manage Users" }),
  async (req, res) => {
    try {
      console.log("Authenticated user info:", req.user);

      const {
        name,
        email,
        password,
        role,
        permissions,
        assignedTo,
        position, // 👈 updated from tags
      } = req.body;

      if (!password)
        return res.status(400).json({ message: "Password required" });

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

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
        assignedBy: req.user?.userId || null,
        assignedTo: assignedTo || null,
        position: position || null, // 👈 store position if provided
      });

      await user.save();
      res.status(201).json({ message: "User created" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


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

    if (req.body.assignedTo !== undefined) {
  user.assignedTo = req.body.assignedTo;
}


    await user.save();
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// PATCH /admin/users/toggle-status/:id
router.patch("/toggle-status/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "enabled" : "disabled"} successfully.`,
      isActive: user.isActive,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error toggling status" });
  }
});

// PATCH /admin/users/reset-password/:id
router.patch("/reset-password/:id", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
