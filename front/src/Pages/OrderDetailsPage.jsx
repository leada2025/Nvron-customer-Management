import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/Axios";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      await axios.patch(
        `/api/orders/${id}/cancel`,
        { feedback: cancelReason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order cancelled.");
      fetchOrder();
      setConfirmCancel(false);
    } catch (err) {
      console.error(err);
      alert("Unable to cancel order.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading order details...</div>;
  if (!order) return <div className="p-6 text-center text-red-500">Order not found.</div>;

  const isCancellable = order.status === "pending";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0b7b7b]">Order Details</h1>
          <button
            className="text-sm text-[#0b7b7b] underline"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        <div className="mb-4 space-y-1">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`font-semibold ${
              order.status === "delivered" ? "text-green-600" :
              order.status === "cancelled" ? "text-red-600" :
              "text-yellow-600"
            }`}>
              {order.status.toUpperCase()}
            </span>
          </p>
          {order.feedback && (
            <p className="text-sm text-gray-500 italic">Cancel Reason: {order.feedback}</p>
          )}
        </div>

        <table className="min-w-full text-sm border rounded overflow-hidden mt-4">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="text-center px-4 py-2">Qty</th>
              <th className="text-right px-4 py-2">Rate</th>
              <th className="text-right px-4 py-2">Tax (%)</th>
              <th className="text-right px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.productName}</td>
                <td className="text-center px-4 py-2">{item.quantity}</td>
                <td className="text-right px-4 py-2">₹{item.netRate.toFixed(2)}</td>
                <td className="text-right px-4 py-2">{item.tax}</td>
                <td className="text-right px-4 py-2">
                  ₹{(item.netRate * item.quantity * (1 + item.tax / 100)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-6 space-y-1 text-lg font-medium">
          <p>Subtotal: ₹{order.subtotal.toFixed(2)}</p>
          <p>Tax: ₹{order.taxAmount.toFixed(2)}</p>
          <p>Shipping: ₹{order.shippingCharge}</p>
          <hr className="my-2" />
          <p className="text-xl">Grand Total: ₹{order.totalAmount.toFixed(2)}</p>
        </div>

        {isCancellable && (
          <div className="mt-6">
            {confirmCancel ? (
              <div className="space-y-3">
                <p className="text-red-600 font-medium">Confirm cancellation?</p>
                <textarea
                  placeholder="Optional feedback..."
                  rows={3}
                  className="w-full border p-2 rounded text-sm"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelOrder}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Yes, Cancel
                  </button>
                  <button
                    onClick={() => setConfirmCancel(false)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmCancel(true)}
                className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel Order
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
