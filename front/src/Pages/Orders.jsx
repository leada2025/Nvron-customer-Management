import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/orders/customer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (id) => {
    try {
      await axios.patch(
        `/api/orders/${id}/cancel`,
        { feedback: cancelReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Order cancelled.");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "cancelled", feedback: cancelReason } : o))
      );
      setConfirmCancelId(null);
      setCancelReason("");
    } catch (err) {
      console.error(err);
      alert("Unable to cancel order.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-[#0b7b7b] font-semibold">Loading order history...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8 text-[#0b7b7b] text-center">🧾 Your Order History</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          const isCancellable = order.status === "pending";

          const borderColor =
            order.status === "delivered"
              ? "border-green-600"
              : order.status === "cancelled"
              ? "border-red-600"
              : order.status === "processing"
              ? "border-blue-600"
              : "border-yellow-500";

          const badgeColor =
            order.status === "delivered"
              ? "bg-green-600"
              : order.status === "cancelled"
              ? "bg-red-600"
              : order.status === "processing"
              ? "bg-blue-600"
              : "bg-yellow-500";

          return (
            <div
              key={order._id}
              className={`mb-6 bg-white p-6 rounded-xl shadow-md border relative pl-6 border-l-8 ${borderColor}`}
            >
              <span
                className={`absolute -left-3 top-3 text-xs px-3 py-1 rounded-r-md font-bold text-white ${badgeColor}`}
              >
                {order.status}
              </span>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Order ID: {order._id}</p>
                  <p className="font-semibold text-gray-700 mt-1">
                    Status:{" "}
                    <span
                      className={`${
                        order.status === "delivered"
                          ? "text-green-600"
                          : order.status === "cancelled"
                          ? "text-red-600"
                          : order.status === "processing"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      } uppercase font-bold`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.feedback && (
                    <p className="italic text-sm text-red-500 mt-1">
                      Cancel Reason: {order.feedback}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                  className="text-[#0b7b7b] hover:underline font-medium text-sm"
                >
                  {isExpanded ? "Hide Details" : "View Details"}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t pt-4 text-sm">
                  <table className="w-full text-sm border">
                    <thead className="bg-[#f0fafa] text-gray-700">
                      <tr>
                        <th className="text-left px-3 py-2">Product</th>
                        <th className="text-center px-3 py-2">Qty</th>
                        <th className="text-right px-3 py-2">Rate</th>
                        <th className="text-right px-3 py-2">Tax (%)</th>
                        <th className="text-right px-3 py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index} className="border-t">
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

                  <div className="text-right mt-4 space-y-1 text-sm font-medium">
                    <p>Subtotal: ₹{order.subtotal.toFixed(2)}</p>
                    <p>Tax: ₹{order.taxAmount.toFixed(2)}</p>
                    <p>Shipping: ₹{order.shippingCharge}</p>
                    <hr className="my-1" />
                    <p className="text-lg font-bold text-[#0b7b7b]">
                      Grand Total: ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  {isCancellable && (
                    <div className="mt-5">
                      {confirmCancelId === order._id ? (
                        <div className="space-y-3">
                          <p className="text-red-600 font-semibold">Confirm cancellation?</p>
                          <textarea
                            placeholder="Reason for cancellation (optional)"
                            rows={3}
                            className="w-full border p-2 rounded text-sm"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                              Yes, Cancel
                            </button>
                            <button
                              onClick={() => setConfirmCancelId(null)}
                              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmCancelId(order._id)}
                          className="mt-4 bg-[#0b7b7b] text-white px-6 py-2 rounded-lg hover:bg-[#095e5e]"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrdersPage;
