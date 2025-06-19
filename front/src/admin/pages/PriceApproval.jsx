import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const NegotiationApprovalPage = () => {
  const [negotiations, setNegotiations] = useState([]);
  const token = localStorage.getItem("token");

  const fetchNegotiations = async () => {
    try {
      const res = await axios.get("/api/negotiations/", {
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

  // ✅ Filter only pending/proposed negotiations on frontend
  const filteredNegotiations = negotiations.filter(
    (item) => item.status === "pending" || item.status === "proposed"
  );

  return (
    <div className="min-h-screen bg-[#e1f4f6] p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-[#0b7b7b] mb-6">Pending Price Approvals</h2>

        {filteredNegotiations.length > 0 ? (
          <div className="grid gap-6">
            {filteredNegotiations.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Product</p>
                    <p className="text-base font-medium text-gray-800">
                      {item.productId?.name || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="text-base font-medium text-gray-800">
                      {item.customerId?.name || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Requested Price</p>
                    <p className="text-base font-medium text-[#d97706]">
                      ₹{item.proposedPrice}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Sales Proposed Rate</p>
                    <p className="text-base font-medium text-[#0284c7]">
                      ₹{item.salesProposedRate || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleApprove(item._id)}
                    className="bg-[#0b7b7b] hover:bg-[#086969] text-white text-sm px-5 py-2 rounded-md transition"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-lg">
            No pending negotiations.
          </div>
        )}
      </div>
    </div>
  );
};

export default NegotiationApprovalPage;
