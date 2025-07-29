import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

export default function LoginActivityPage() {
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const fetchLogins = async (date) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/logins/by-date", {
        params: { date },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedLogins = res.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setLogins(sortedLogins);
      setCurrentPage(1); // Reset to first page when date changes
    } catch (err) {
      console.error("Error fetching login data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogins(selectedDate);
  }, [selectedDate]);

  // Pagination calculations
  const totalPages = Math.ceil(logins.length / itemsPerPage);
  const paginatedLogins = logins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-[#0b7b7b]">
            Customer Login Activity
          </h1>
          <p className="text-sm text-[#0b7b7b]/80">
            Track who logged in and when
          </p>
        </header>

        <div className="flex justify-between items-center">
          <input
            type="date"
            className="border border-[#0b7b7b]/40 rounded-lg px-3 py-2 shadow-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {/* Pagination Controls */}
          <div className="space-x-2 text-[#0b7b7b]">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-white border rounded hover:bg-[#d1eeee] disabled:opacity-40"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-white border rounded hover:bg-[#d1eeee] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        <section className="bg-white border border-[#0b7b7b]/20 rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-[#0b7b7b] mb-4">
            Logins on {selectedDate}
          </h2>

          {loading ? (
            <p className="text-[#0b7b7b]">Loading...</p>
          ) : paginatedLogins.length === 0 ? (
            <p className="text-gray-500">No logins recorded on this date.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
                <thead className="bg-[#0b7b7b] text-white">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Customer Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3 rounded-tr-lg">Login Time</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogins.map((log) => (
                    <tr
                      key={log._id}
                      className="bg-[#f9fefe] hover:bg-[#eefafa] rounded-md shadow-sm transition"
                    >
                      <td className="px-4 py-3 rounded-l-md">
                        {log.customerId?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {log.customerId?.email || "N/A"}
                      </td>
                      <td className="px-4 py-3 rounded-r-md">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
