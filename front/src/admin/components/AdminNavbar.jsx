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
      { path: "users", label: "User Access Management" },
    ];

    for (const page of pageMap) {
      if (pathname.includes(page.path)) return page.label;
    }

    return "Dashboard";
  };

  return (
    <header className="h-[61px] bg-white border-b shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold capitalize text-gray-700">
        {getCurrentPageTitle()}
      </h1>

      <div className="flex items-center space-x-4 relative" ref={settingsRef}>
        <button
          onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
          className="text-gray-600 hover:text-black"
          title="Settings"
        >
          <FiSettings className="w-5 h-5" />
        </button>

        {settingsDropdownOpen && (
          <div className="absolute right-16 top-12 w-64 bg-white border rounded-md shadow-lg z-50">
            <ul className="text-sm text-gray-700">
              <li>
                <button
                  onClick={() => {
                    navigate("/admin/Users");
                    setSettingsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  User Access Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/admin/pricing/roles");
                    setSettingsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Edit Branding
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/admin/pricing/history");
                    setSettingsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Update Terms / Policies
                </button>
              </li>
            </ul>
          </div>
        )}

        <button
          onClick={onLogout}
          className="flex items-center text-sm text-red-600 hover:text-red-800"
        >
          <FiLogOut className="w-5 h-5 mr-1" />
          Logout
        </button>
      </div>
    </header>
  );
}
