const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded); 
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (req.user.role === "admin") {
    return next(); // Admin has access to all routes
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  }

  next();
};

const authorizePermissions = (...requiredPermissions) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Forbidden: No user found" });
  }

  // Allow admin users without checking permissions
  if (req.user.role === "admin") {
    return next();
  }

  if (!req.user.permissions || !Array.isArray(req.user.permissions)) {
    return res.status(403).json({ message: "Forbidden: No permissions found" });
  }

  // Check if user has any one of the required permissions
  const hasPermission = requiredPermissions.some(permission =>
    req.user.permissions.includes(permission)
  );

  if (!hasPermission) {
    return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  }

  next();
};


module.exports = {
  authenticate,
  authorizeRoles,
  authorizePermissions,
};
