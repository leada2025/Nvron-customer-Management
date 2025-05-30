const jwt = require("jsonwebtoken");

function requireAuth({ permission } = {}) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userPermissions = decoded.permissions || [];

      console.log("Decoded Permissions:", userPermissions);
      console.log("Required Permission(s):", permission);

      // Handle single or multiple required permissions
      if (permission) {
        const requiredPermissions = Array.isArray(permission) ? permission : [permission];

        const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));
        if (!hasPermission) {
          return res.status(403).json({ message: "Permission denied" });
        }
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

module.exports = requireAuth;
