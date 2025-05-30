const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");
require("dotenv").config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find or create the admin role
    let adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      adminRole = await new Role({
        name: "admin",
        permissions: ["Manage Users", "View Orders", "Manage Pricing"], // example permissions
      }).save();
      console.log("Created admin role");
    } else {
      console.log("Admin role already exists");
    }

    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password and create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      role: adminRole._id,
      permissions: adminRole.permissions, // or set custom if you want
    });

    await adminUser.save();
    console.log("✅ Admin user created");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
