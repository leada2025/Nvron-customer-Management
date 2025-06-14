import React from "react";
import { NavLink } from "react-router-dom";
import {
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
    <aside className="w-64 min-h-screen bg-slate-100 text-gray-800 border-r">
      <div className="px-6 py-4 border-b">
        <div className="text-xl font-semibold leading-tight">
          Fishman <br />
          <span className="text-sm text-gray-600 font-normal">HealthCare</span>
        </div>
      </div>

      <nav className="flex flex-col gap-2 px-4 py-6">
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-[#0b7b7b] text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 text-xs text-gray-400">
        Customer UI
      </div>
    </aside>
  );
};

export default Sidebar;
