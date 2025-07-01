import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const AdminPayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/payouts/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayouts(res.data);
    } catch (err) {
      console.error("Failed to fetch payouts:", err);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/payouts/${id}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchPayouts();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 bg-[#e6f7f7] min-h-screen">
      <h2 className="text-2xl font-bold text-[#0b7b7b] mb-6">Manage Payouts</h2>

      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#d1f3f3] text-[#0b7b7b]">
            <tr>
              <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Commission %</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Paid Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {payouts.map((payout) => (
              <tr key={payout._id} className="border-b hover:bg-[#f0fdfa]">
                <td className="px-4 py-3">
                  {payout.partnerId?.name || <span className="text-red-500 italic">Not Assigned</span>}
                  <br />
                  <span className="text-xs text-gray-500">{payout.partnerId?.email}</span>
                </td>
                 <td className="px-4 py-3 text-sm text-gray-800">{payout.partnerPhone || "—"}</td>
                <td className="px-4 py-3">{payout.orderId?._id?.slice(-6)}</td>
                <td className="px-4 py-3">{payout.commissionPercent}%</td>
                <td className="px-4 py-3 font-medium">
                  ₹{payout.commissionAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      payout.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payout.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {payout.paidDate
                    ? new Date(payout.paidDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={payout.status}
                    disabled={updatingId === payout._id}
                    onChange={(e) => updateStatus(payout._id, e.target.value)}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payouts.length === 0 && (
          <div className="py-6 text-center text-gray-500">No payout records found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminPayoutsPage;
