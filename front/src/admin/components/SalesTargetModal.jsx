import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { X } from "lucide-react";

export default function SalesTargetModal({ open, onClose, onSuccess }) {
  const [salesUsers, setSalesUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [targetAmount, setTargetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchSalesUsers();
    }
  }, [open]);

  const fetchSalesUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/users?onlyRole=sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSalesUsers(res.data);
    } catch (err) {
      console.error("Error fetching sales users:", err);
      setError("Failed to load sales users.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 if (!selectedUser || !targetAmount || !month) {
  setError("All fields are required.");
  return;
}

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

     await axios.post(
  "/admin/users/sales-target",
  {
    salesUserId: selectedUser,
    targetAmount: parseFloat(targetAmount), // ✅ Parse as float
    month,
  },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess?.(); // Optional callback to refresh dashboard or show toast
      onClose();
    } catch (err) {
      console.error("Target submit error:", err);
      setError("Failed to save sales target.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-[#0b7b7b] mb-4">Assign Sales Target</h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sales Executive</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select --</option>
              {salesUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

     <div>
  <label className="block text-sm font-medium mb-1">Target Amount ₹</label>
  <input
    type="number"
    min="0"
    step="0.01"
    value={targetAmount}
    onChange={(e) => setTargetAmount(e.target.value)}
    className="w-full border rounded px-3 py-2"
    placeholder="Enter target amount"
  />
</div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0b7b7b] text-white px-4 py-2 rounded hover:bg-[#095e5e] transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Assign Target"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
