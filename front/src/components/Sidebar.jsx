import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  ShoppingCart,
  Settings,
  FileText,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navItems = [
    { label: "Home", path: "/products", icon: <Home size={18} /> },
    { label: "Catalogue", path: "/catalog", icon: <BookOpen size={18} /> },
    { label: "Order History", path: "/order-history", icon: <ShoppingCart size={18} /> },
    { label: "Offers", path: "/offers", icon: <FileText size={18} /> },
    { label: "Support", path: "/request-services", icon: <Package size={18} /> },
    { label: "Settings", path: "/profile/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="min-h-screen text-[#0b7b7b] bg-[#e6f7f7] border-r border-[#0b7b7b] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-5 ">
        {!collapsed && (
          <div className="text-2xl font-bold leading-snug">
            Fishman
            <br />
            <span className="text-sm font-medium opacity-70">HealthCare</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#0b7b7b] p-1 hover:bg-[#c4eded] rounded"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2 py-4">
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#0b7b7b] text-white shadow-md"
                  : "hover:bg-[#d1f3f3] text-[#0b7b7b]"
              }`
            }
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
