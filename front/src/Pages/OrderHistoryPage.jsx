import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading order history...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
            <p className="font-semibold">Status: <span className="capitalize">{order.status}</span></p>
            <p>Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
            <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Feedback: {order.feedback || "N/A"}</p>

            <div className="mt-3">
              <h4 className="font-medium">Items:</h4>
              <ul className="list-disc ml-6">
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.productName} — Qty: {item.quantity}, Rate: ₹{item.netRate}, Tax: {item.tax}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
