const express = require("express");
const Role = require("../models/Role");
const adminAuth = require("../middleware/adminAuth");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Get all roles
router.get("/", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a role
router.post("/", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const existing = await Role.findOne({ name });
    if (existing) return res.status(400).json({ message: "Role already exists" });

    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json({ message: "Role created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a role
router.put("/:id", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    role.name = name;
    role.permissions = permissions;
    await role.save();

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a role
router.delete("/:id", requireAuth({ permission: "Manage Users" }), async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
