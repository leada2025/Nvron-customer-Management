import React from "react";
import {jwtDecode} from "jwt-decode";

const RequirePermission = ({ children, permission }) => {
  const token = localStorage.getItem("token");

  let userPermissions = [];

  try {
    if (token) {
      const decoded = jwtDecode(token);
      userPermissions = decoded.permissions || [];
    }
  } catch (err) {
    console.error("Invalid token", err);
  }

  const hasPermission = () => {
    if (!userPermissions.length) return false;

    if (Array.isArray(permission)) {
      return permission.some(p => userPermissions.includes(p));
    }

    return userPermissions.includes(permission);
  };

  if (!hasPermission()) {
    return (
      <div className="p-4 text-center text-red-600 font-semibold">
        🚫 You do not have permission to access this page.
      </div>
    );
  }

  return children;
};

export default RequirePermission;
