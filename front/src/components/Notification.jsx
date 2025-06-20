import React, { useState, useRef, useEffect } from "react";
import { Bell, Gift, Truck, Wrench } from "lucide-react";

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
    <div className="relative ml-2 inline-block text-left z-50" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white hover:text-gray-200 transition"
      >
        <Bell className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute left-[-100px] mt-2 w-60 bg-white border border-teal-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 bg-[#0b7b7b] text-white font-semibold text-sm">
            Notifications
          </div>
          <div className="flex flex-col text-sm text-gray-700 divide-y divide-gray-200">
            <div className="flex items-center gap-2 px-4 py-3 hover:bg-teal-50 transition cursor-pointer">
              <Gift size={16} className="text-[#0b7b7b]" />
              New Offers & Schemes
            </div>
            <div className="flex items-center gap-2 px-4 py-3 hover:bg-teal-50 transition cursor-pointer">
              <Truck size={16} className="text-[#0b7b7b]" />
              Dispatch & Payment Alerts
            </div>
            <div className="flex items-center gap-2 px-4 py-3 hover:bg-teal-50 transition cursor-pointer">
              <Wrench size={16} className="text-[#0b7b7b]" />
              Portal Updates
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
