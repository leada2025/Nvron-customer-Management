import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const NegotiationApprovalPage = () => {
  const [negotiations, setNegotiations] = useState([]);
  const token = localStorage.getItem("token");

  const fetchNegotiations = async () => {
    try {
      const res = await axios.get("/api/negotiations/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNegotiations(res.data);
    } catch (err) {
      console.error("Error fetching negotiations:", err.response?.data || err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `/api/negotiations/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Price approved!");
      fetchNegotiations();
    } catch (err) {
      console.error("Approval error:", err.response?.data || err.message);
      alert("Failed to approve price.");
    }
  };

  useEffect(() => {
    fetchNegotiations();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">Pending Price Approvals</h2>
      {Array.isArray(negotiations) && negotiations.length > 0 ? (
        <div className="grid gap-4">
          {negotiations.map((item) => (
            <div key={item._id} className="border border-gray-300 rounded-lg p-5 bg-white shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <p className="text-sm text-gray-600">
                  <strong className="font-medium text-gray-700">Product:</strong> {item.productId?.name || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-medium text-gray-700">Customer:</strong> {item.customerId?.name || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-medium text-gray-700">Requested Price:</strong> ₹{item.proposedPrice}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-medium text-gray-700">Sales Proposed Rate:</strong> ₹{item.salesProposedRate}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleApprove(item._id)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded shadow"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pending negotiations.</p>
      )}
    </div>
  );
};

export default NegotiationApprovalPage;
