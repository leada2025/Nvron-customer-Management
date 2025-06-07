// Pages/ProfileSettings.jsx
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6 space-y-8">
      {/* Top Nav Buttons */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <button onClick={() => scrollTo(businessRef)} className="px-4 py-2 bg-teal-600 text-white rounded">🏥 Business Info</button>
        <button onClick={() => scrollTo(addressRef)} className="px-4 py-2 bg-teal-600 text-white rounded">🏠 Address Book</button>
        <button onClick={() => scrollTo(contactRef)} className="px-4 py-2 bg-teal-600 text-white rounded">📞 Contact Info</button>
        <button onClick={() => scrollTo(passwordRef)} className="px-4 py-2 bg-teal-600 text-white rounded">🔑 Change Password</button>
      </div>

      {/* Business Info Section */}
      <div ref={businessRef}>
        <h2 className="text-lg font-semibold mb-2">🏥 Business Info</h2>
        <input type="text" placeholder="Pharmacy Name" className="w-full mb-2 p-2 border rounded" />
        <input type="text" placeholder="License No" className="w-full mb-2 p-2 border rounded" />
        <input type="text" placeholder="GST Number" className="w-full mb-2 p-2 border rounded" />
      </div>

      {/* Address Book Section */}
      <div ref={addressRef}>
        <h2 className="text-lg font-semibold mb-2">🏠 Address Book</h2>
        <input type="text" placeholder="Shipping Address" className="w-full mb-2 p-2 border rounded" />
        <input type="text" placeholder="Billing Address" className="w-full mb-2 p-2 border rounded" />
      </div>

      {/* Contact Info Section */}
      <div ref={contactRef}>
        <h2 className="text-lg font-semibold mb-2">📞 Contact Info</h2>
        <input type="text" placeholder="Phone Number" className="w-full mb-2 p-2 border rounded" />
        <input type="email" placeholder="Email Address" className="w-full mb-2 p-2 border rounded" />
      </div>

      {/* Change Password Section */}
      <div ref={passwordRef}>
        <h2 className="text-lg font-semibold mb-2">🔑 Change Password</h2>
        <input type="password" placeholder="Current Password" className="w-full mb-2 p-2 border rounded" />
        <input type="password" placeholder="New Password" className="w-full mb-2 p-2 border rounded" />
        <input type="password" placeholder="Confirm New Password" className="w-full mb-2 p-2 border rounded" />
      </div>

      <div className="text-center">
        <button className="px-6 py-2 bg-[#0b7b7b] text-white rounded hover:bg-[#096969]">Save All Changes</button>
      </div>
    </div>
  );
}
