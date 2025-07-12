import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  ShoppingCart,
  Settings,
  FileText,
  Package,
  Users,
  DollarSign,
   Info,
  X,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed, onNavigate }) => {
  const position = (localStorage.getItem("position") || "").trim().toLowerCase();

  const navItems = [
    { label: "Home", path: "/products", icon: <Home size={20} /> },
     { label: "About Us", path: "/aboutpage", icon: <Info size={20} /> },
    { label: "Catalogue", path: "/catalog", icon: <BookOpen size={20} /> },
    { label: "Order History", path: "/order-history", icon: <ShoppingCart size={20} /> },
    { label: "Offers", path: "/offers", icon: <FileText size={20} /> },
    { label: "Support", path: "/request-services", icon: <Package size={20} /> },
    { label: "Settings", path: "/profile/settings", icon: <Settings size={20} /> },
  ];

  // Add extra items only for "partners"
  if (position === "partners") {
    navItems.splice(
      navItems.findIndex(item => item.label === "Support"), // insert before "Support"
      0,
      { label: "Payout", path: "/payout", icon: <DollarSign size={20} /> },
      { label: "Customers", path: "/customers", icon: <Users size={20} /> }
    );
  }

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024 && collapsed) setCollapsed(false);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024 && !collapsed) setCollapsed(true);
  };

  return (
    <aside
      className={`h-full bg-[#e6f7f7] border-r border-[#0b7b7b] text-[#0b7b7b] transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="h-15 flex items-center justify-between px-6">
        {!collapsed && (
          <div className="flex items-center space-x-2 ml-[50px]">
            <img
              src="/fishman.png"
              alt="Fishman Logo"
              className="h-24 w-full object-contain transition-transform duration-300 scale-200"
            />
          </div>
        )}
        {onNavigate && (
          <button onClick={onNavigate} className="block lg:hidden text-[#0b7b7b] ml-[50px]">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2 py-4">
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            key={label}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#0b7b7b] text-white font-semibold shadow-inner before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded before:bg-white"
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
