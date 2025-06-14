import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { Dialog } from "@mui/material";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/orders/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  if (loading) return <p className="text-center mt-8">Loading order history...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-[#0b7b7b]">Order History</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="mb-6 p-4 border rounded-xl shadow-sm bg-white">
            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
            <p className="font-semibold">Status: <span className="capitalize">{order.status}</span></p>
            <p>Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
            <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Feedback: {order.feedback || "N/A"}</p>

            <div className="mt-4">
              <button
                onClick={() => handleViewDetails(order)}
                className="bg-[#0b7b7b] text-white px-4 py-2 rounded hover:bg-[#095f5f] transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#0b7b7b]">Order Details</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-black">✖</button>
          </div>

          {selectedOrder && (
            <>
              <div className="space-y-1 text-sm">
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Status:</strong> <span className="capitalize">{selectedOrder.status}</span></p>
                <p><strong>Placed On:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                {selectedOrder.feedback && (
                  <p className="italic text-gray-500">Feedback: {selectedOrder.feedback}</p>
                )}
              </div>

              <table className="mt-4 w-full text-sm border rounded overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-3 py-2">Product</th>
                    <th className="text-center px-3 py-2">Qty</th>
                    <th className="text-right px-3 py-2">Rate</th>
                    <th className="text-right px-3 py-2">Tax (%)</th>
                    <th className="text-right px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-2">{item.productName}</td>
                      <td className="text-center px-3 py-2">{item.quantity}</td>
                      <td className="text-right px-3 py-2">₹{item.netRate.toFixed(2)}</td>
                      <td className="text-right px-3 py-2">{item.tax}</td>
                      <td className="text-right px-3 py-2">
                        ₹{(item.netRate * item.quantity * (1 + item.tax / 100)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right mt-6 space-y-1 text-sm font-medium">
                <p>Subtotal: ₹{selectedOrder.subtotal.toFixed(2)}</p>
                <p>Tax: ₹{selectedOrder.taxAmount.toFixed(2)}</p>
                <p>Shipping: ₹{selectedOrder.shippingCharge}</p>
                <hr className="my-2" />
                <p className="text-lg">Grand Total: ₹{selectedOrder.totalAmount.toFixed(2)}</p>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default OrderHistory;
