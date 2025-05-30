import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react"

// Global toast flag
let toastAlreadyShown = false;

export default function RequirePermission({ permission, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Reset toast on path change
    toastAlreadyShown = false;

    if (!user || !user.permissions) {
      if (!toastAlreadyShown) {
        toast.error("Login required or user not valid");
        toastAlreadyShown = true;
      }
      navigate("/admin", { replace: true });
      return;
    }

    const requiredPermissions = Array.isArray(permission)
      ? permission
      : [permission];

    const hasAccess = requiredPermissions.some((perm) =>
      user.permissions.includes(perm)
    );

    if (!hasAccess) {
      if (!toastAlreadyShown) {
        toast.error("You do not have permission to access this page.");
        toastAlreadyShown = true;
      }
      navigate("/admin", { replace: true });
    } else {
      setIsAllowed(true);
    }
  }, [permission, location.pathname]);

  if (!isAllowed) return null;

  return children;
}
