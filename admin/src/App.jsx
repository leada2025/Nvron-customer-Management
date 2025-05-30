import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import AdminLogin from "./components/AdminLogin";
import UsersPage from "./components/UsersPage";
import ProductsPage from "./components/ProductPage";
import PricingPage from "./components/PricingPage";
import OrdersPage from "./components/OrdersPage";
import SettingsPage from "./components/Setting";
import DashboardPage from "./components/Dashboard";
import Unauthorized from "./components/Unauthorized";
import { AuthProvider } from "./Context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequirePermission from "./components/Toast";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Keep in sync with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
    
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/admin" replace /> : <AdminLogin setToken={setToken} />
          }
        />

        {/* Protected Route */}
      <Route
  path="/admin"
  element={token ? <AdminLayout setToken={setToken} /> : <Navigate to="/" replace />}
>

          <Route index element={<DashboardPage />} />
          <Route path="users" element={
  <RequirePermission permission="Manage Users">
    <UsersPage />
  </RequirePermission>
} />
          <Route path="products" element={
<RequirePermission permission={["View Products"]}>
  <ProductsPage />
</RequirePermission>
         }/>

         <Route path="pricing" element={
<RequirePermission permission={["Approve Pricing", "Manage Pricing","View Products"]}>
  <PricingPage />
</RequirePermission>
         }/>

          <Route path="orders" element={<OrdersPage />} />
          <Route path="settings" element={<SettingsPage />} />
         
        </Route>
         <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
    
    </>
  );
}
