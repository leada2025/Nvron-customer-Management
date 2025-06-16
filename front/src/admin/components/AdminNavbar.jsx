import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiSettings, FiLogOut } from "react-icons/fi";

export default function AdminNavbar({ onLogout, navigate }) {
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const settingsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentPageTitle = () => {
    const pathname = location.pathname.toLowerCase();

    const pageMap = [
      { path: "customer", label: "Customers" },
      { path: "orders", label: "Orders" },
      { path: "products", label: "Products" },
      { path: "requests", label: "Requests" },
      { path: "priceconsole", label: "Price Console" },
      { path: "priceapproval", label: "Price Approval" },
      { path: "pricing/roles", label: "Role Pricing" },
      { path: "pricing/history", label: "Pricing History" },
      { path: "users", label: "User Access" },
    ];

    for (const page of pageMap) {
      if (pathname.includes(page.path)) return page.label;
    }

    return "Dashboard";
  };

  return (
    <header className="h-[83px] bg-[#e6f7f7] border-b border-[#0b7b7b] flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-[#0b7b7b]">
        {getCurrentPageTitle()}
      </h1>

      <div className="flex items-center gap-4 relative" ref={settingsRef}>
        {/* Settings button */}
        <button
          onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
          className="text-[#0b7b7b] hover:text-black"
          title="Settings"
        >
          <FiSettings className="w-5 h-5" />
        </button>

        {/* Dropdown menu */}
        {settingsDropdownOpen && (
          <div className="absolute right-0 top-10 w-56 bg-white border border-[#0b7b7b] rounded-md shadow z-50">
            <ul className="text-sm text-[#0b7b7b] py-2">
              <li>
                <button
                  onClick={() => {
                    navigate("/admin/users");
                    setSettingsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#c2efef]"
                >
                  User Access
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/admin/pricing/roles");
                    setSettingsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#c2efef]"
                >
                  Branding Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/admin/pricing/history");
                    setSettingsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#c2efef]"
                >
                  Terms & Policies
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="flex items-center text-sm text-[#0b7b7b] hover:text-red-600"
          title="Logout"
        >
          <FiLogOut className="w-5 h-5 mr-1" />
          Logout
        </button>
      </div>
    </header>
  );
}
