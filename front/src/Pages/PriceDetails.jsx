import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

export default function NegotiationHistory() {
  const [history, setHistory] = useState([]);
useEffect(() => {
  const token = localStorage.getItem("token");

  axios
    .get("/api/negotiations/customer-history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => setHistory(res.data))
    .catch((err) => {
      console.error("Failed to fetch negotiation history", err);
    });
}, []);

  return (
   <div className="mt-6 ml-6">
  <h3 className="text-xl font-semibold mb-4 text-gray-800">Negotiation History</h3>

  <div className="overflow-x-auto rounded-lg shadow border w-full max-w-4xl">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Product</th>
          <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Requested Price</th>
          <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Sales Proposal</th>
          <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
        </tr>
      </thead>
      <tbody>
        {history.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center text-gray-500 py-6">
              No negotiation history found.
            </td>
          </tr>
        ) : (
          history.map((h) => (
            <tr key={h._id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-gray-800">{h.productId?.name}</td>
              <td className="px-4 py-3">₹{h.proposedPrice}</td>
              <td className="px-4 py-3">{h.salesProposedRate ? `₹${h.salesProposedRate}` : "-"}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    h.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : h.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : h.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}
