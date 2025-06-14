import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

export default function PricingProposalsPage() {
  const [pricingList, setPricingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await axios.get("/api/pricing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPricingList(res.data);
    } catch (err) {
      console.error("Failed to fetch pricing proposals", err);
    }
  };

  const handleApprove = async (pricingId) => {
    const approvedRate = prompt("Enter approved rate:");
    if (!approvedRate) return;

    try {
      await axios.patch(
        `/api/pricing/${pricingId}/approve`,
        { approvedRate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPricing();
    } catch (err) {
      console.error("Failed to approve", err);
    }
  };

  const handleDelete = async (pricingId) => {
    if (!window.confirm("Delete this proposal?")) return;
    try {
      await axios.delete(`/api/pricing/${pricingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPricing();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const filteredPricing = pricingList.filter((p) =>
    (p.productId?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Pricing Proposals</h2>

      <input
        type="text"
        placeholder="Search product"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 mb-6 w-full max-w-md"
      />

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Customer</th>
            <th className="p-3 border-b">Product</th>
            <th className="p-3 border-b text-right">Proposed</th>
            <th className="p-3 border-b text-right">Approved</th>
            <th className="p-3 border-b text-right">Min</th>
            <th className="p-3 border-b text-center">Status</th>
            <th className="p-3 border-b text-center">Date</th>
            <th className="p-3 border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPricing.map((p) => (
            <tr key={p._id}>
              <td className="p-3 border-b">{p.customerId?.name || "N/A"}</td>
              <td className="p-3 border-b">{p.productId?.name || "N/A"}</td>
              <td className="p-3 border-b text-right">{p.proposedRate?.toFixed(2)}</td>
              <td className="p-3 border-b text-right">{p.approvedRate?.toFixed(2) || "-"}</td>
              <td className="p-3 border-b text-right">{p.minRate?.toFixed(2)}</td>
              <td className="p-3 border-b text-center">{p.status}</td>
              <td className="p-3 border-b text-center">
                {new Date(p.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td className="p-3 border-b text-center space-x-2">
                {p.status === "pending" && (
                  <button
                    onClick={() => handleApprove(p._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
