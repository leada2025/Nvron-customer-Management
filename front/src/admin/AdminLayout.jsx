// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";

const hiddenRoutes = ["/admin-login", "/admin/unauthorized"];

export default function AdminLayout({ setToken }) {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const decoded = jwtDecode(token);
        const parsedUser = JSON.parse(userData);
        setUser({ ...decoded, ...parsedUser, role: parsedUser.role?.toLowerCase() });
      } catch (e) {
        console.error("Invalid token or user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/", { replace: true });
  };

  const isHidden = hiddenRoutes.includes(location.pathname);

  if (isHidden) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar user={user} navigate={navigate} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar navigate={navigate} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
