import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  BookOpen,
  ShoppingCart,
  Settings,
  FileText,
  Package,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { label: "Home", path: "/products", icon: <Home size={18} /> },
    { label: "Catalogue", path: "/catalog", icon: <BookOpen size={18} /> },
    { label: "Order History", path: "/order-history", icon: <ShoppingCart size={18} /> },
    { label: "Offers", path: "/offers", icon: <FileText size={18} /> },
    { label: "Support", path: "/request-services", icon: <Package size={18} /> },
    { label: "Settings", path: "/profile/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#e6f7f7] text-[#0b7b7b] border-r border-[#0b7b7b]">
      {/* Logo/Title */}
      <div className="px-6 py-5 border-b border-[#0b7b7b]">
        <div className="text-2xl font-bold leading-snug">
          Fishman
          <br />
          <span className="text-sm font-medium opacity-70">HealthCare</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 px-4 py-6">
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#0b7b7b] text-white shadow-md"
                  : "hover:bg-[#d1f3f3] text-[#0b7b7b]"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
