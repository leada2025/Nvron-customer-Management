import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { LayoutGrid, Table } from "lucide-react";

const PayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/payouts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayouts(res.data);
      } catch (err) {
        console.error("Failed to fetch payouts:", err);
      }
    };

    fetchPayouts();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const toggleView = () => {
    setViewMode(viewMode === "table" ? "card" : "table");
  };

  return (
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#0b7b7b]">My Payouts</h2>
          <button
            onClick={toggleView}
            className="p-2 bg-white border border-[#0b7b7b] rounded-full shadow hover:bg-[#d9f0f0] transition"
            title={viewMode === "card" ? "Switch to Table View" : "Switch to Card View"}
          >
            {viewMode === "card" ? (
              <Table size={18} className="text-[#0b7b7b]" />
            ) : (
              <LayoutGrid size={18} className="text-[#0b7b7b]" />
            )}
          </button>
        </div>

        {payouts.length === 0 ? (
          <p className="text-[#0b7b7b]">No commissions yet.</p>
        ) : viewMode === "table" ? (
          <div className="overflow-auto rounded-xl shadow border border-[#0b7b7b]/20 bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#c2efef] text-[#0b7b7b]">
                <tr>
                  <th className="p-3 font-medium">Order ID</th>
                  <th className="p-3 font-medium">Commission %</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Buyer</th>

                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <React.Fragment key={p._id}>
                    <tr
                      onClick={() => toggleExpand(p._id)}
                      className="border-t hover:bg-[#f0fdfd] transition cursor-pointer"
                    >
                      <td className="p-3">{p.orderId?.slice(-6).toUpperCase()}</td>
                      <td className="p-3">{p.commissionPercent}%</td>
                      <td className="p-3">₹{p.commissionAmount.toFixed(2)}</td>
                      <td className="p-3 capitalize">{p.status}</td>
                      <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
  {p.referredCustomerId && p.referredCustomerId._id !== p.partnerId
    ? p.referredCustomerId.name || p.referredCustomerId.email
    : "Self"}
</td>

                    </tr>
                    {expandedId === p._id && p.products?.length > 0 && (
                      <tr className="bg-[#f9fefe]">
                        <td colSpan={5} className="p-4">
                          <h4 className="font-semibold text-sm mb-2">Commission Breakdown:</h4>
                          <table className="w-full text-xs border">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-2 py-1 text-left">Product</th>
                                <th className="px-2 py-1 text-center">Qty</th>
                                <th className="px-2 py-1 text-right">Unit Price</th>
                                <th className="px-2 py-1 text-right">Commission</th>
                              </tr>
                            </thead>
                            <tbody>
                              {p.products.map((prod, idx) => (
                                <tr key={idx} className="border-t">
                                  <td className="px-2 py-1">{prod.productName}</td>
                                  <td className="px-2 py-1 text-center">{prod.quantity}</td>
                                  <td className="px-2 py-1 text-right">₹{prod.unitPrice.toFixed(2)}</td>
                                  <td className="px-2 py-1 text-right text-green-700 font-semibold">
                                    ₹{prod.productCommission.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {payouts.map((p) => (
              <div
                key={p._id}
                onClick={() => toggleExpand(p._id)}
                className="bg-white rounded-xl shadow p-4 space-y-2 border border-[#0b7b7b]/10 cursor-pointer hover:bg-[#f0fdfd]"
              >
                <div className="flex justify-between text-sm text-[#0b7b7b]">
                  <span><strong>ID:</strong> {p.orderId?.slice(-6).toUpperCase()}</span>
                  <span className="capitalize font-semibold">{p.status}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p><strong>Date:</strong> {new Date(p.createdAt).toLocaleDateString()}</p>
                  <p><strong>Commission:</strong> ₹{p.commissionAmount.toFixed(2)} ({p.commissionPercent}%)</p>
                </div>
                {expandedId === p._id && p.products?.length > 0 && (
                  <div className="border-t pt-2 mt-2 text-xs space-y-1 text-gray-700">
                    <p className="font-semibold mb-1">Product-wise Commission:</p>
                    {p.products.map((prod, idx) => (
                      <div key={idx} className="bg-[#f9fefe] p-2 rounded border text-sm">
                        <p><strong>{prod.productName}</strong></p>
                        <p>Qty: {prod.quantity}, Unit Price: ₹{prod.unitPrice.toFixed(2)}</p>
                        <p><strong>Commission:</strong> ₹{p.commissionAmount.toFixed(2)} ({p.commissionPercent}%)</p>
{p.referredCustomerId && p.referredCustomerId._id !== p.partnerId ? (
  <p className="text-gray-500">
    <strong>Buyer:</strong> {p.referredCustomerId.name || p.referredCustomerId.email}
  </p>
) : (
  <p className="text-gray-500"><strong>Buyer:</strong> Self</p>
)}



                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutsPage;
