import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";

const OrdersRedirectPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [noOrders, setNoOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/customer", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const orders = res.data;

        if (orders.length === 0) {
          setNoOrders(true); // ✅ Show message instead of alert
        } else {
          navigate(`/order/${orders[0]._id}`);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
        navigate("/login"); // or home if preferred
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="p-6 text-center text-gray-700">
      {loading ? (
        <p>Loading your orders...</p>
      ) : noOrders ? (
        <div>
          <p className="text-lg font-semibold">You have no orders yet.</p>
          <p className="mt-2 text-sm text-gray-500">Start exploring our products and place your first order!</p>
        </div>
      ) : (
        <p>Redirecting to your recent order...</p>
      )}
    </div>
  );
};

export default OrdersRedirectPage;
