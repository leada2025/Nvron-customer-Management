const User = require("../models/User");

async function enrichUserRole(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User info missing" });
    }

    const user = await User.findById(req.user.id).populate("role", "name permissions");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Add roleName and permissions to req.user for downstream use
    req.user.roleName = user.role ? user.role.name : null;
    req.user.permissions = user.permissions.length ? user.permissions : (user.role ? user.role.permissions : []);

    next();
  } catch (err) {
    console.error("enrichUserRole error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = enrichUserRole;
