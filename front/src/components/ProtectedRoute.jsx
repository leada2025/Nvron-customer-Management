// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectPath = "/login" }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={redirectPath} replace />;
  return children;
};

export default ProtectedRoute;
