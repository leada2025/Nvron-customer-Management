import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { Dialog, TextField, Button } from "@mui/material";
import { Table, LayoutGrid } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const [viewMode, setViewMode] = useState(() =>
    window.innerWidth < 640 ? "card" : localStorage.getItem("orderViewMode") || "table"
  );

  // Detect window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) setViewMode("card");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/orders/customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleView = () => {
    const newMode = viewMode === "card" ? "table" : "card";
    setViewMode(newMode);
    localStorage.setItem("orderViewMode", newMode);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setCancelFeedback("");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    try {
      setIsCancelling(true);
      const token = localStorage.getItem("token");
      await axios.patch(`/api/orders/${selectedOrder._id}/cancel`, {
        feedback: cancelFeedback,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
      setOpen(false);
    } catch (err) {
      alert("Failed to cancel order.");
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-[#0b7b7b]">Loading order history...</p>;

  return (
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-[#0b7b7b]">Order History</h2>

        <div className="flex justify-end sm:flex hidden">
          <button
            onClick={toggleView}
            className="mb-4 p-2 bg-white border border-[#0b7b7b] rounded-full shadow hover:bg-[#d9f0f0] transition"
            title={viewMode === "card" ? "Switch to Table View" : "Switch to Card View"}
          >
            {viewMode === "card" ? (
              <Table size={18} className="text-[#0b7b7b]" />
            ) : (
              <LayoutGrid size={18} className="text-[#0b7b7b]" />
            )}
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-[#0b7b7b]">No past orders found.</p>
        ) : viewMode === "table" ? (
          <div className="overflow-auto rounded-xl shadow border border-[#0b7b7b]/20 bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#c2efef] text-[#0b7b7b]">
                <tr>
                  <th className="p-3 font-medium">Order ID</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Total Amount</th>
                  <th className="p-3 font-medium">Placed On</th>
                  <th className="p-3 font-medium">Feedback</th>
                  <th className="p-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-[#f0fdfd] transition">
                    <td className="p-3">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="p-3 capitalize">{order.status}</td>
                    <td className="p-3 text-right">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="p-3">{order.feedback || "N/A"}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="bg-[#0b7b7b] text-white px-4 py-1.5 rounded-lg hover:bg-[#095f5f] transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow p-4 space-y-2 border border-[#0b7b7b]/10">
                <div className="flex justify-between text-sm text-[#0b7b7b]">
                  <span><strong>ID:</strong> {order._id.slice(-6).toUpperCase()}</span>
                  <span className="capitalize font-semibold">{order.status}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                  <p><strong>Feedback:</strong> {order.feedback || "N/A"}</p>
                </div>
                <div className="text-right mt-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="bg-[#0b7b7b] text-white px-4 py-1.5 rounded-lg hover:bg-[#095f5f] transition text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
          <div className="bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#0b7b7b]">Order Details</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-black text-lg">✖</button>
            </div>

            {selectedOrder && (
              <>
                <div className="space-y-1 text-sm mb-4">
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Status:</strong> <span className="capitalize">{selectedOrder.status}</span></p>
                  <p><strong>Placed On:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  {selectedOrder.feedback && (
                    <p className="italic text-gray-500">Feedback: {selectedOrder.feedback}</p>
                  )}
                </div>

                {/* Mobile view */}
                {isMobile ? (
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="border rounded p-3 text-sm space-y-1 bg-[#f9fefe]">
                        <p><strong>Product:</strong> {item.productName}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Rate:</strong> ₹{item.netRate.toFixed(2)}</p>
                        <p><strong>Tax:</strong> {item.tax}%</p>
                        <p><strong>Total:</strong> ₹{(item.netRate * item.quantity * (1 + item.tax / 100)).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <table className="w-full text-sm rounded border mt-4">
                    <thead className="bg-[#e9fafa] text-[#0b7b7b]">
                      <tr>
                        <th className="px-3 py-2 text-left">Product</th>
                        <th className="px-3 py-2 text-center">Qty</th>
                        <th className="px-3 py-2 text-right">Rate</th>
                        <th className="px-3 py-2 text-right">Tax (%)</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2">{item.productName}</td>
                          <td className="px-3 py-2 text-center">{item.quantity}</td>
                          <td className="px-3 py-2 text-right">₹{item.netRate.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">{item.tax}</td>
                          <td className="px-3 py-2 text-right">
                            ₹{(item.netRate * item.quantity * (1 + item.tax / 100)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="text-right mt-6 space-y-1 text-sm font-medium text-[#0b7b7b]">
                  <p>Subtotal: ₹{selectedOrder.subtotal.toFixed(2)}</p>
                  <p>Tax: ₹{selectedOrder.taxAmount.toFixed(2)}</p>
                  <p>Shipping: ₹{selectedOrder.shippingCharge}</p>
                  <hr className="my-2" />
                  <p className="text-lg font-semibold">Grand Total: ₹{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>

                {selectedOrder.status === "pending" && (
                  <div className="mt-6 space-y-4">
                    <TextField
                      label="Cancellation Feedback"
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      value={cancelFeedback}
                      onChange={(e) => setCancelFeedback(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleCancelOrder}
                      disabled={isCancelling || cancelFeedback.trim() === ""}
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Order"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderHistory;
