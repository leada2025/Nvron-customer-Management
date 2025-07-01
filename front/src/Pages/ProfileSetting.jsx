import React, { useRef, useState, useEffect } from "react";
import axios from "../api/Axios";
import { Eye, EyeOff } from "lucide-react";

export default function ProfileSettings() {
  const passwordRef = useRef(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Bank details
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branch: "",
  });
  const [bankMessage, setBankMessage] = useState("");
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Fetch bank details
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`/api/bank-details/${userId}`);
        if (res.data) {
          setBankDetails(res.data);
          setHasBankDetails(true);
        }
      } catch (err) {
        console.log("No bank details found");
        setHasBankDetails(false);
      }
    };
    fetchBankDetails();
  }, []);

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

      const res = await axios.post("/admin/users/password", {
        userId,
        currentPassword,
        newPassword,
      });

      setMessage(res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
    }
  };

  const handleBankSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post(`/api/bank-details/${userId}`, bankDetails);
      setBankMessage(res.data.message || "Bank details saved!");
      setHasBankDetails(true);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setBankMessage("Error saving bank details.");
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

  const renderBankInput = (placeholder, key) => (
    <input
      type="text"
      placeholder={placeholder}
      value={bankDetails[key]}
      onChange={(e) => setBankDetails({ ...bankDetails, [key]: e.target.value })}
      disabled={!editMode}
      className={`w-full p-3 bg-slate-50 border border-gray-300 rounded-md ${
        !editMode ? "opacity-60 cursor-not-allowed" : ""
      }`}
    />
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6 space-y-10">
      {/* 🔑 Change Password */}
      <div ref={passwordRef} className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">🔑 Change Password</h2>
        {renderPasswordField("Current Password", currentPassword, (e) => setCurrentPassword(e.target.value), showCurrent, setShowCurrent)}
        {renderPasswordField("New Password", newPassword, (e) => setNewPassword(e.target.value), showNew, setShowNew)}
        {renderPasswordField("Confirm New Password", confirmPassword, (e) => setConfirmPassword(e.target.value), showConfirm, setShowConfirm)}
        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
        <div className="text-right pt-2">
          <button
            onClick={handlePasswordChange}
            className="px-6 py-2 bg-[#0b7b7b] text-white rounded-lg hover:bg-[#096969] transition"
          >
            Save Password
          </button>
        </div>
      </div>

      {/* 🏦 Bank Details */}
      <div className="pt-8 space-y-4 border-t border-gray-200 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">🏦 Bank Details</h2>
          {hasBankDetails ? (
            editMode ? (
              <button onClick={() => setEditMode(false)} className="text-sm text-red-600 hover:underline">
                Cancel
              </button>
            ) : (
              <button onClick={() => setEditMode(true)} className="text-sm text-blue-600 hover:underline">
                Edit
              </button>
            )
          ) : (
            <button onClick={() => setEditMode(true)} className="text-sm text-blue-600 hover:underline">
              + Add Bank Details
            </button>
          )}
        </div>

        {renderBankInput("Account Holder Name", "accountHolder")}
        {renderBankInput("Account Number", "accountNumber")}
        {renderBankInput("IFSC Code", "ifsc")}
        {renderBankInput("Bank Name", "bankName")}
        {renderBankInput("Branch", "branch")}

        {bankMessage && <p className="text-green-600">{bankMessage}</p>}

        {editMode && (
          <div className="text-right pt-2">
            <button
              onClick={handleBankSave}
              className="px-6 py-2 bg-[#0b7b7b] text-white rounded-lg hover:bg-[#096969] transition"
            >
              Save Bank Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
