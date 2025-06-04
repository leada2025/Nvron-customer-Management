const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    // Find or create the "Customer" role
    let customerRole = await Role.findOne({ name: "Customer" });
    if (!customerRole) {
      customerRole = await Role.create({ name: "Customer", permissions: [] });
    }

    const user = new User({
      name,
      email,
      passwordHash,
      role: customerRole._id,
      permissions: [], // Optionally set default customer permissions
    });

    await user.save();

    res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Populate the role field to get the name
    const user = await User.findOne({ email }).populate("role");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role.name.toLowerCase(), // use role name
        permissions: user.permissions || [], // optional: pass permissions for admin
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role.name.toLowerCase(),
      name: user.name,
      permissions: user.permissions || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and populate role with permissions
    const user = await User.findOne({ email }).populate("role");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.role || user.role.name === "Customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Combine role permissions and custom user permissions
    const rolePermissions = user.role?.permissions || [];
    const userPermissions = user.permissions || [];
    const combinedPermissions = [...new Set([...rolePermissions, ...userPermissions])];

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role.name,
        permissions: combinedPermissions,
      },
      process.env.JWT_SECRET,
     { expiresIn: "5h" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        permissions: combinedPermissions,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;
