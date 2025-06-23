import React, { useRef, useState } from "react";
import axios from "../api/Axios";
import { Eye, EyeOff } from "lucide-react";

export default function ProfileSettings() {
  const businessRef = useRef(null);
  const addressRef = useRef(null);
  const contactRef = useRef(null);
  const passwordRef = useRef(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Toggle visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => ref.current?.querySelector("input")?.focus(), 300);
  };

  const handlePasswordChange = async () => {
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      const response = await axios.post("/admin/users/password", {
        userId,
        currentPassword,
        newPassword,
      });

      setMessage(response.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
    }
  };

  const renderPasswordField = (label, value, onChange, show, setShow) => (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="w-full p-3 pr-10 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
      />
      <div
        className="absolute right-3 top-3 cursor-pointer text-gray-600 hover:text-black"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6 space-y-10">
      {/* Navigation Buttons */}
      {/* <div className="flex flex-wrap gap-3 justify-center mb-2">
        <button onClick={() => scrollTo(businessRef)} className="px-4 py-2 bg-[#0b7b7b] text-white rounded-md hover:bg-[#096969] transition">🏥 Business Info</button>
        <button onClick={() => scrollTo(addressRef)} className="px-4 py-2 bg-[#0b7b7b] text-white rounded-md hover:bg-[#096969] transition">🏠 Address Book</button>
        <button onClick={() => scrollTo(contactRef)} className="px-4 py-2 bg-[#0b7b7b] text-white rounded-md hover:bg-[#096969] transition">📞 Contact Info</button>
        <button onClick={() => scrollTo(passwordRef)} className="px-4 py-2 bg-[#0b7b7b] text-white rounded-md hover:bg-[#096969] transition">🔑 Change Password</button>
      </div> */}

      {/* 🔐 Change Password Section */}
      <div ref={passwordRef} className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">🔑 Change Password</h2>

        {renderPasswordField("Current Password", currentPassword, (e) => setCurrentPassword(e.target.value), showCurrent, setShowCurrent)}
        {renderPasswordField("New Password", newPassword, (e) => setNewPassword(e.target.value), showNew, setShowNew)}
        {renderPasswordField("Confirm New Password", confirmPassword, (e) => setConfirmPassword(e.target.value), showConfirm, setShowConfirm)}

        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
      </div>

      {/* Save Button */}
      <div className="text-center pt-4">
        <button
          onClick={handlePasswordChange}
          className="px-6 py-2 bg-[#0b7b7b] text-white rounded-lg hover:bg-[#096969] transition"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
}
