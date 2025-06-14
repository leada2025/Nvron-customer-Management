import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const SalesNegotiationPanel = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [proposedRates, setProposedRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllNegotiations();
  }, []);

  const fetchAllNegotiations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [pendingRes, approvedRes] = await Promise.all([
        axios.get("/api/negotiations", { headers }),
        axios.get("/api/negotiations/approved", { headers }),
      ]);

      setPendingRequests(pendingRes.data);
      setApprovedRequests(approvedRes.data);
    } catch (err) {
      console.error("Failed to fetch negotiations:", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/negotiations/${id}/propose`,
        { proposedRate: proposedRates[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Proposed rate submitted!");
      fetchAllNegotiations();
    } catch (err) {
      console.error("Error submitting proposed rate:", err);
      alert("Submission failed.");
    }
  };

  const handleReopen = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/negotiations/reopen/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Negotiation reopened.");
      fetchAllNegotiations();
    } catch (err) {
      console.error("Error reopening negotiation:", err);
      alert("Reopen failed.");
    }
  };

  const handleRateChange = (id, value) => {
    setProposedRates((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-600 mb-6">Pending Negotiation Requests</h1>
      {pendingRequests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded mb-10">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 border border-gray-300">Customer</th>
              <th className="px-4 py-2 border border-gray-300">Product</th>
              <th className="px-4 py-2 border border-gray-300">MRP</th>
              <th className="px-4 py-2 border border-gray-300">Requested Price</th>
              <th className="px-4 py-2 border border-gray-300">Proposed Rate</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((req) => (
              <tr key={req._id} className="border-t border-gray-300">
                <td className="px-4 py-2 border text-sm border-gray-300">{req.customerId?.name || "-"}</td>
                <td className="px-4 py-2 border text-sm border-gray-300">{req.productId?.name || "-"}</td>
                <td className="px-4 py-2 border text-sm border-gray-300">₹{req.productId?.mrp}</td>
                <td className="px-4 py-2 border text-sm border-gray-300 text-blue-600">₹{req.proposedPrice}</td>
                <td className="px-4 py-2 border text-sm border-gray-300">
                  <input
                    type="number"
                    className="border border-gray-300 px-2 py-1 rounded w-24 text-sm"
                    value={proposedRates[req._id] || ""}
                    onChange={(e) => handleRateChange(req._id, e.target.value)}
                    placeholder="₹"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    onClick={() => handleSubmit(req._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="text-xl font-semibold text-gray-600 mb-4">Approved Negotiations</h2>
      {approvedRequests.length === 0 ? (
        <p className="text-gray-500">No approved negotiations.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded">
          <thead className="bg-green-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 border border-gray-300">Customer</th>
              <th className="px-4 py-2 border border-gray-300">Product</th>
              <th className="px-4 py-2 border border-gray-300">MRP</th>
              <th className="px-4 py-2 border border-gray-300">Approved Price</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.map((req) => (
              <tr key={req._id} className="border-t border-gray-300 ">
                <td className="px-4 text-sm py-2 border border-gray-300">{req.customerId?.name || "-"}</td>
                <td className="px-4 py-2 text-sm border border-gray-300">{req.productId?.name || "-"}</td>
                <td className="px-4 py-2 text-sm border border-gray-300">₹{req.productId?.mrp}</td>
                <td className="px-4 py-2 text-smborder border-gray-300 text-green-700 font-medium">
                  ₹{req.approvedPrice || req.salesProposedRate || "-"}
                </td>
                <td className="px-4 py-2 text-sm border border-gray-300">
                  <button
                    onClick={() => handleReopen(req._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Reopen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesNegotiationPanel;
