import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import SalesTargetModal from "../components/SalesTargetModal";

export default function SalesTargetPage() {
  const [open, setOpen] = useState(false); // ⛔ initially closed
  const [targetHistory, setTargetHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTargets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/users/sales-targets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTargetHistory(res.data);
    } catch (err) {
      console.error("Error fetching target history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6fbfb] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0b7b7b] mb-4">Sales Target Management</h1>

        <button
          onClick={() => setOpen(true)}
          className="mb-6 bg-[#0b7b7b] text-white px-4 py-2 rounded hover:bg-[#095e5e]"
        >
          + New Target
        </button>

        <SalesTargetModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            fetchTargets(); // refresh table after assigning
          }}
        />

        <h2 className="text-lg font-semibold text-[#0b7b7b] mb-2">Target History</h2>

        {loading ? (
          <p className="text-[#0b7b7b]">Loading...</p>
        ) : targetHistory.length === 0 ? (
          <p className="text-gray-500">No targets assigned yet.</p>
        ) : (
          <div className="overflow-x-auto border rounded-xl bg-white">
            <table className="w-full table-auto text-sm text-left border-collapse">
              <thead className="bg-[#0b7b7b] text-white">
                <tr>
                  <th className="p-3">Sales Executive</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Target Orders</th>
                  <th className="p-3">Assigned At</th>
                </tr>
              </thead>
              <tbody>
                {targetHistory.map((t) => (
                  <tr key={t._id} className="border-b hover:bg-[#f0fafa]">
                    <td className="p-3">{t.salesUser?.name || "N/A"}</td>
                    <td className="p-3">{t.salesUser?.email || "N/A"}</td>
                    <td className="p-3">{t.month}</td>
                    <td className="p-3">{t.targetOrders}</td>
                    <td className="p-3">{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
