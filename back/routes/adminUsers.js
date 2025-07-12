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
const SalesTarget = require("../models/SalesTarget");
const moment = require("moment");
const NegotiationRequest = require("../models/NegotiationRequest")
const Distributor = require("../models/Distributor");


const router = express.Router();


// Update this route
router.get("/", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const { excludeRole, onlyRole,onlyPosition } = req.query;

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

      if (onlyPosition) {
      filter.position = new RegExp(`^${onlyPosition}$`, "i");
    }

    const users = await User.find(filter)
      .populate("role", "name permissions")
       .populate("assignedBy", "name email")   
  .populate("assignedTo", "name email")
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

// ✅ This route allows Partners to fetch only their referred customers
router.get("/referred-customers", requireAuth(), async (req, res) => {
  try {
    const partnerId = req.user.userId;

    // Find customers where partnerRef matches logged-in user
    const referredCustomers = await User.find({
      role: { $ne: null },
      partnerRef: partnerId,
    })
      .populate("role", "name permissions")
      .select("-passwordHash");

    res.json(referredCustomers);
  } catch (err) {
    console.error("GET /admin/users/referred-customers error:", err);
    res.status(500).json({ message: err.message });
  }
});




router.get("/dashboard-stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    // Find pricing requests where status is pending
    const pendingApprovedPricing = await NegotiationRequest.countDocuments({
      status: "pending"
    });

    res.json({
      users,
      products,
      pendingOrders,
      pendingApprovedPricing
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});



router.get(
  "/sales-dashboard-stats",
  requireAuth({ role: ["sales", "sale", "sales executive"] }),
  async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.userId);

      // 🔍 Fetch the "customer" role dynamically
      const customerRole = await Role.findOne({
  name: { $regex: new RegExp("^customer$", "i") } // case-insensitive match
});

      if (!customerRole) {
        return res.status(400).json({ message: "Customer role not found" });
      }
      const customerRoleId = customerRole._id;

      // 🔍 Find customers assigned to this sales executive
      const assignedCustomers = await User.find(
        {
          role: customerRoleId,
          $or: [{ assignedBy: userId }, { assignedTo: userId }],
        },
        "_id"
      );

      const customerIds = assignedCustomers.map((c) => c._id);

      if (customerIds.length === 0) {
        return res.json({
          assignedCustomers: 0,
          orders: 0,
          totalSales: 0,
        });
      }

      // 📦 Count orders for those customers
      const ordersCount = await Order.countDocuments({
        customerId: { $in: customerIds },
      });

      // 💰 Calculate total sales value (incl. tax)
      const salesAgg = await Order.aggregate([
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
                      { $divide: ["$items.tax", 100] },
                    ],
                  },
                ],
              },
            },
          },
        },
      ]);

      

      const totalSales = salesAgg[0]?.total || 0;

      const currentMonth = moment().format("YYYY-MM");

const target = await SalesTarget.findOne({
  salesUserId: userId,
  month: currentMonth,
});

const assignedTarget = target?.targetAmount ?? null;
const remainingTarget = target ? Math.max(target.targetAmount - totalSales, 0) : null;

res.json({
  assignedCustomers: customerIds.length,
  orders: ordersCount,
  totalSales,
  assignedTarget,
  remainingTarget,
});


    } catch (err) {
      console.error("❌ Sales Dashboard Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

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
        placeOfSupply, 
         partnerRef ,
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
        placeOfSupply: placeOfSupply || null,
        partnerRef: partnerRef || null,

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
    const { name, email, password, role, permissions, position, placeOfSupply, assignedTo } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    // Handle role (ID or name string)
    if (role) {
      let roleId = role;

      if (typeof role === "string") {
        if (mongoose.Types.ObjectId.isValid(role)) {
          roleId = role;
        } else {
          let roleDoc = await Role.findOne({ name: role });
          if (!roleDoc) {
            roleDoc = await Role.create({ name: role, permissions: [] });
          }
          roleId = roleDoc._id;
        }
      }

      user.role = roleId;
    }

    // Update permissions
    if (permissions) {
      user.permissions = permissions;
    }

    // Hash password if provided
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    // AssignedTo
    if (assignedTo !== undefined) {
      user.assignedTo = assignedTo;
    }

    // Normalize and update position
    if (position) {
      const allowedPositions = ["Doctor", "Retailer", "Distributor", "Partners"];
      const matched = allowedPositions.find(
        (p) => p.toLowerCase() === position.toLowerCase()
      );
      user.position = matched || position;
    }

    // ✅ Update placeOfSupply
    if (placeOfSupply !== undefined) {
      user.placeOfSupply = placeOfSupply;
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

router.post("/sales-target", requireAuth({ role: "admin" }), async (req, res) => {
  try {
    const { salesUserId, targetAmount, month } = req.body; // 🔄 Changed

    if (!salesUserId || !targetAmount || !month) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const target = await SalesTarget.findOneAndUpdate(
      { salesUserId, month },
      { targetAmount }, // 🔄 Changed
      { new: true, upsert: true }
    );

    res.json({ message: "Target saved successfully", target });
  } catch (err) {
    console.error("Sales target error:", err);
    res.status(500).json({ message: "Failed to set sales target" });
  }
});


// GET all assigned targets (admin view)
router.get(
  "/sales-targets",
  requireAuth({ role: ["admin"] }),
  async (req, res) => {
    try {
      const targets = await SalesTarget.find({})
        .sort({ createdAt: -1 })
        .populate("salesUserId", "name email");

      const result = await Promise.all(
        targets.map(async (target) => {
          const salesUserId = target.salesUserId?._id;
          if (!salesUserId) return null; // ⛔️ Skip deleted users

          const customerRole = await Role.findOne({ name: /customer/i });
          if (!customerRole) return null;

          const customerIds = await User.find({
            role: customerRole._id,
            $or: [{ assignedBy: salesUserId }, { assignedTo: salesUserId }],
          }).distinct("_id");

          if (!customerIds.length) {
            return {
              ...target.toObject(),
              totalSales: 0,
              remainingAmount: target.targetAmount,
            };
          }

          const salesAgg = await Order.aggregate([
            {
              $match: {
                customerId: { $in: customerIds.map(id => new mongoose.Types.ObjectId(id)) },
                createdAt: {
                  $gte: new Date(`${target.month}-01`),
                  $lte: new Date(`${target.month}-31`),
                },
              },
            },
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
                          { $divide: ["$items.tax", 100] },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          ]);

          const totalSales = salesAgg[0]?.total || 0;
          const remainingAmount = target.targetAmount - totalSales;

          return {
            ...target.toObject(),
            totalSales,
            remainingAmount,
          };
        })
      );

      // Filter out nulls (e.g. deleted users or invalid roles)
      res.json(result.filter(Boolean));
    } catch (err) {
      console.error("❌ Error fetching sales target history:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);





router.delete("/:id", adminAuth, async (req, res) => {
  try {
    // Find user first
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    // Also delete matching distributor(s)
    await Distributor.deleteMany({
      $or: [
        { userId: user._id },        // Primary match
        { email: user.email }        // Fallback if userId wasn't set
      ]
    });

    res.json({ message: "User and associated distributor deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting user/distributor:", err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash); // ✅ FIXED

    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword; // ✅ FIXED
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// PATCH /admin/users/assign-partner
router.patch("/assign-partner", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const { customerIds, partnerUserId } = req.body;

    if (!Array.isArray(customerIds) || !partnerUserId) {
      return res.status(400).json({ message: "customerIds and partnerUserId required" });
    }

    const updated = await User.updateMany(
      { _id: { $in: customerIds } },
      { $set: { partnerRef: partnerUserId } }
    );

    res.json({ message: "Customers assigned", modified: updated.modifiedCount });
  } catch (err) {
    console.error("Assign Partner Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
