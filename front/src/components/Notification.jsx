// components/NotificationsDropdown.jsx
import React, { useState, useRef, useEffect } from "react";

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block text-left ml-[500px] z-[60]" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-gray-800 hover:text-black font-medium"
      >
        <span>🔔</span> 
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 border-b font-semibold">🔔 Important Messages</div>
          <div className="flex flex-col text-sm text-gray-700">
            <div className="px-4 py-2 hover:bg-gray-100">🎁 New Offers / Schemes</div>
            <div className="px-4 py-2 hover:bg-gray-100">🚚 Dispatch & Payment Alerts</div>
            <div className="px-4 py-2 hover:bg-gray-100">🛠️ Portal Updates</div>
          </div>
        </div>
      )}
    </div>
  );
}
