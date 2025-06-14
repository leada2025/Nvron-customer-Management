import React, { useRef } from "react";

export default function ProfileSettings() {
  const businessRef = useRef(null);
  const addressRef = useRef(null);
  const contactRef = useRef(null);
  const passwordRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => ref.current?.querySelector("input")?.focus(), 300);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6 space-y-10">
      {/* Top Navigation Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-2">
        <button
          onClick={() => scrollTo(businessRef)}
          className="px-4 py-2 bg-[#0b7b7b] text-white rounded-md hover:bg-[#096969] transition"
        >
          🏥 Business Info
        </button>
        <button
          onClick={() => scrollTo(addressRef)}
          className="px-4 py-2 bg-[#0b7b7b] text-white rounded-md hover:bg-[#096969] transition"
        >
          🏠 Address Book
        </button>
        <button
          onClick={() => scrollTo(contactRef)}
          className="px-4 py-2 bg-[#0b7b7b] text-white rounded-md hover:bg-[#096969] transition"
        >
          📞 Contact Info
        </button>
        <button
          onClick={() => scrollTo(passwordRef)}
          className="px-4 py-2 bg-[#0b7b7b] text-white rounded-md hover:bg-[#096969] transition"
        >
          🔑 Change Password
        </button>
      </div>

      {/* Business Info */}
      <div ref={businessRef} className="space-y-3 border-b pb-6">
        <h2 className="text-lg font-semibold text-gray-800">🏥 Business Info</h2>
        <input
          type="text"
          placeholder="Pharmacy Name"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
        <input
          type="text"
          placeholder="License No"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
        <input
          type="text"
          placeholder="GST Number"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
      </div>

      {/* Address Book */}
      <div ref={addressRef} className="space-y-3 border-b pb-6">
        <h2 className="text-lg font-semibold text-gray-800">🏠 Address Book</h2>
        <input
          type="text"
          placeholder="Shipping Address"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
        <input
          type="text"
          placeholder="Billing Address"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
      </div>

      {/* Contact Info */}
      <div ref={contactRef} className="space-y-3 border-b pb-6">
        <h2 className="text-lg font-semibold text-gray-800">📞 Contact Info</h2>
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
      </div>

      {/* Change Password */}
      <div ref={passwordRef} className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">🔑 Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full p-3 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />
      </div>

      {/* Save Button */}
      <div className="text-center pt-4">
        <button className="px-6 py-2 bg-[#0b7b7b] text-white rounded-lg hover:bg-[#096969] transition">
          Save All Changes
        </button>
      </div>
    </div>
  );
}
