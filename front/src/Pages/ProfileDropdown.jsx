import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (sectionId) => {
    navigate(`/profile/settings#${sectionId}`);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-gray-800 hover:text-black font-medium"
      >
        <span>My Profile</span> <span>👤</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 border-b font-semibold">👤 My Profile</div>
          <div className="flex flex-col text-sm text-gray-700">
            <button onClick={() => handleNavigate("business")} className="text-left px-4 py-2 hover:bg-gray-100">
              🏥 Manage Business Info
            </button>
            <button onClick={() => handleNavigate("address")} className="text-left px-4 py-2 hover:bg-gray-100">
              🏠 Address Book
            </button>
            <button onClick={() => handleNavigate("contact")} className="text-left px-4 py-2 hover:bg-gray-100">
              📞 Contact Details
            </button>
            <button onClick={() => handleNavigate("password")} className="text-left px-4 py-2 hover:bg-gray-100">
              🔑 Change Password
            </button>
            <button onClick={handleLogout} className="text-left px-4 py-2 text-red-500 hover:bg-red-50">
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
