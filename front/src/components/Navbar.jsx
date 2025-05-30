import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helper to check if the path matches
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-xl text-gray-800">MyApp</span>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex gap-8 text-gray-700 font-medium">
        <Link
          to="/products"
          className={`hover:text-blue-600 ${
            isActive("/products") ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1" : ""
          }`}
        >
          Products
        </Link>
        <Link
          to="/order-summary"
          className={`hover:text-blue-600 ${
            isActive("/order-summary") ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1" : ""
          }`}
        >
          Order Summary
        </Link>
          <Link
          to="/order/:id"
          className={`hover:text-blue-600 ${
            isActive("/order/:id") ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1" : ""
          }`}
        >
          My Orders
        </Link>
        <Link
          to="/request-services"
          className={`hover:text-blue-600 ${
            isActive("/request-services") ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1" : ""
          }`}
        >
          Request Services
        </Link>
       
      </div>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
