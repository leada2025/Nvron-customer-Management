import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut } from "lucide-react"; // Lucide icons

export default function ProfileDropdown() {
   const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null); // Load user from localStorage
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
     const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (sectionId) => {
    navigate(`/profile/settings#${sectionId}`);
    setOpen(false);
  };

const handleLogout = () => {
  const position = localStorage.getItem("position");

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("position");

  if (position === "Partners") {
    navigate("/distributor-signup");
  } else {
    navigate("/");
  }
};


  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#0b7b7b] text-white px-3 py-1 rounded-md hover:bg-[#096969] transition"
      >
        <UserCircle className="w-5 h-5" />
        <h4 className="text-base sm:text-lg font-medium capitalize tracking-wide">
        {name}
        </h4>

      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-teal-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex flex-col text-sm text-gray-800 divide-y divide-gray-200">
           

            <button
              onClick={() => handleNavigate("")}
              className="flex items-center gap-2 px-4 py-3 hover:bg-teal-50 transition text-left"
            >
              <UserCircle size={18} className="text-[#0b7b7b]" />
              <span>My Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition text-left text-red-500"
            >
              <LogOut size={18} className="text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
