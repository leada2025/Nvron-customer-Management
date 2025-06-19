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
        {/* Header with Logo */}
        <div className="flex items-center justify-between px-3 py-5">
          {!collapsed && (
            <div className="flex items-center gap-3">
              {/* SVG Logo */}
              <div className="w-10 h-10 flex items-center justify-center bg-[#0b7b7b] rounded-full shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2 C7.5 2 4 6 4 10.5 C4 16 12 22 12 22 C12 22 20 16 20 10.5 C20 6 16.5 2 12 2 Z" />
                  <path d="M12 7v6M9 10h6" strokeLinecap="round" />
                </svg>
              </div>

              {/* Brand Text */}
              <div className="leading-snug">
                <div className="text-xl font-bold text-[#0b7b7b]">Fishman</div>
                <div className="text-sm font-medium opacity-70 text-[#0b7b7b]">
                  HealthCare
                </div>
              </div>
            </div>
          )}

          {/* Collapse Button */}
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
