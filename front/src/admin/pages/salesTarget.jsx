import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import SalesTargetModal from "../components/SalesTargetModal";

export default function SalesTargetPage() {
  const [open, setOpen] = useState(false);
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
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-[#0b7b7b]">Sales Target Management</h1>
          <p className="text-sm text-[#0b7b7b]/80">Assign and review monthly targets</p>
        </header>

        <section className="flex justify-end">
          <button
            onClick={() => setOpen(true)}
            className="bg-[#0b7b7b] text-white px-4 py-2 rounded-lg shadow hover:bg-[#095e5e] transition"
          >
            + New Target
          </button>
        </section>

        <SalesTargetModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            fetchTargets();
          }}
        />

        <section className="bg-white border border-[#0b7b7b]/20 rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-[#0b7b7b] mb-4">Target History</h2>

          {loading ? (
            <p className="text-[#0b7b7b]">Loading...</p>
          ) : targetHistory.length === 0 ? (
            <p className="text-gray-500">No targets assigned yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
                <thead className="bg-[#0b7b7b] text-white">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Sales Executive</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Target ₹</th>
                    <th className="px-4 py-3">Remaining / Achieved</th>
                    <th className="px-4 py-3 rounded-tr-lg">Assigned At</th>
                  </tr>
                </thead>
                <tbody>
                  {targetHistory
                    .filter((t) => t.salesUserId)
                    .map((t) => {
                      const target = t.targetAmount || 0;
                      const remaining = t.remainingAmount ?? target;
                      const achieved = remaining <= 0;
                      const overachieved = remaining < 0;

                      return (
                        <tr
                          key={t._id}
                          className="bg-[#f9fefe] hover:bg-[#eefafa] rounded-md shadow-sm transition"
                        >
                          <td className="px-4 py-3 rounded-l-md">{t.salesUserId.name}</td>
                          <td className="px-4 py-3">{t.salesUserId.email}</td>
                          <td className="px-4 py-3">{t.month}</td>
                          <td className="px-4 py-3">₹{parseFloat(target).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            {achieved ? (
                              <span className="text-green-600 font-semibold flex items-center gap-1">
                                ✅ Achieved
                                {overachieved && (
                                  <span className="ml-1 text-green-700 font-medium">
                                    +₹{Math.abs(remaining).toFixed(2)}
                                  </span>
                                )}
                              </span>
                            ) : (
                              `₹${remaining.toFixed(2)}`
                            )}
                          </td>
                          <td className="px-4 py-3 rounded-r-md">
                            {new Date(t.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
