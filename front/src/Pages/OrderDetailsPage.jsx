import React, { useState, useEffect } from "react";

const OrderDetailsPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const storedItems = localStorage.getItem("orderItems");
    if (storedItems) {
      setOrderItems(JSON.parse(storedItems));
    }
  }, []);

  if (!orderItems.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        No order found in localStorage.
      </div>
    );
  }

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.netRate * item.quantity,
    0
  );

  const totalTax = orderItems.reduce(
    (sum, item) => sum + (item.netRate * item.quantity * item.tax) / 100,
    0
  );

  const shipping = subtotal > 10000 ? 0 : 250;
  const grandTotal = subtotal + totalTax + shipping;

  const handleCancelOrder = () => {
    console.log("Cancelled with reason:", cancelReason);
    setStatus("Cancelled");
    setConfirmCancel(false);
    alert("Order cancelled. Thank you for your feedback!");
  };

  const isCancellable = !["Delivered", "Cancelled"].includes(status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Order</h1>

        <div className="mb-4">
          <p><strong>Order ID:</strong> #ORDER123456</p>
          <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
          <p><strong>Status:</strong>
            <span className={`ml-2 font-semibold ${
              status === "Delivered"
                ? "text-green-600"
                : status === "Cancelled"
                ? "text-red-600"
                : "text-yellow-600"
            }`}>
              {status}
            </span>
          </p>
        </div>

        <table className="min-w-full text-sm border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Product</th>
              <th className="text-left px-4 py-2">Description</th>
              <th className="text-left px-4 py-2">Packing</th>
              <th className="text-center px-4 py-2">Qty</th>
              <th className="text-right px-4 py-2">Rate (₹)</th>
              <th className="text-right px-4 py-2">Tax (%)</th>
              <th className="text-right px-4 py-2">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2 text-gray-600">{item.description}</td>
                <td className="px-4 py-2">{item.packing}</td>
                <td className="px-4 py-2 text-center">{item.quantity}</td>
                <td className="px-4 py-2 text-right">{item.netRate.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{item.tax}</td>
                <td className="px-4 py-2 text-right">
                  ₹{(item.netRate * item.quantity * (1 + item.tax / 100)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-6 space-y-1 text-lg font-medium">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Tax: ₹{totalTax.toFixed(2)}</p>
          <p>Shipping: ₹{shipping}</p>
          <hr className="my-2" />
          <p className="text-xl">Grand Total: ₹{grandTotal.toFixed(2)}</p>
        </div>

        {isCancellable && (
          <div className="mt-6">
            {confirmCancel ? (
              <div className="space-y-3">
                <p className="text-red-600 font-medium">
                  Are you sure you want to cancel this order?
                </p>

                <label className="block text-sm font-medium text-gray-700">
                  Reason for cancellation:
                </label>
                <textarea
                  rows="3"
                  placeholder="Optional feedback..."
                  className="w-full p-2 border rounded-md text-sm"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelOrder}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Yes, Cancel Order
                  </button>
                  <button
                    onClick={() => setConfirmCancel(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
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
