import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";
import {jwtDecode} from "jwt-decode"; // Correct default import

const OrderSummaryPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const fetchSpecialPrices = async () => {
    const token = localStorage.getItem("token");

    try {
      const { data: specialPrices } = await axios.get("/api/negotiations/special-prices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Convert to a Map for quick lookup
     const priceMap = {};
specialPrices.forEach((entry) => {
  priceMap[entry.productId] = entry.approvedPrice;
});


      const items = JSON.parse(localStorage.getItem("orderItems") || "[]");

      const normalizedItems = items.map((item) => {
        const specialNetRate = priceMap[item._id] ?? item.netRate;

        return {
          ...item,
          quantity: Number(item.quantity) || 1,
          netRate: Number(specialNetRate),
          tax: Number(item.tax) || 0,
          productId: item._id,
          productName: item.name,
          description: item.description,
        };
      });

      setOrderItems(normalizedItems);
    } catch (err) {
      console.error("Failed to fetch special prices:", err);
      const items = JSON.parse(localStorage.getItem("orderItems") || "[]");
      const fallbackItems = items.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        netRate: Number(item.netRate) || 0,
        tax: Number(item.tax) || 0,
        productId: item._id,
        productName: item.name,
        description: item.description,
      }));
      setOrderItems(fallbackItems);
    }
  };

  fetchSpecialPrices();
}, []);


  const subtotal = orderItems.reduce((sum, item) => sum + item.netRate * item.quantity, 0);

  const totalTax = orderItems.reduce(
    (sum, item) => sum + (item.netRate * item.quantity * item.tax) / 100,
    0
  );

  const shippingCharge = subtotal > 10000 ? 0 : 250;
  const totalAmount = subtotal + totalTax + shippingCharge;

  const handlePlaceOrder = async () => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to place an order.");
      setLoading(false);
      return;
    }

    const orderPayload = {
      items: orderItems.map(({ productId, productName, quantity, netRate, tax, description, }) => ({
        productId,
        productName,
        quantity,
        netRate,
        tax,
        description
      })),
      note,
      shippingCharge,
      subtotal,
      taxAmount: totalTax,
      totalAmount,
    };

    try {
      await axios.post("/api/orders", orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Order placed successfully!");
      localStorage.removeItem("orderItems");
      navigate("/thank-you");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No items in your order.{" "}
        <button
          onClick={() => navigate("/products")}
          className="ml-2 text-blue-600 underline"
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-4 mb-6">
        {orderItems.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="mt-2 text-gray-700">
                Quantity: <strong>{item.quantity}</strong>
              </p>
            </div>
            <div className="text-right">
              <p>₹{(item.netRate * item.quantity).toFixed(2)}</p>
              <p className="text-xs text-gray-500">{item.tax}% Tax</p>
            </div>
          </div>
        ))}
      </div>

      <textarea
        placeholder="Any special notes..."
        className="w-full p-3 mb-4 rounded-xl border"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="text-right text-lg font-medium space-y-1">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Tax: ₹{totalTax.toFixed(2)}</p>
        <p>Shipping: ₹{shippingCharge}</p>
        <hr className="my-2" />
        <p className="text-xl">Total: ₹{totalAmount.toFixed(2)}</p>
      </div>

      <div className="mt-6 text-right">
        <button
          disabled={loading}
          onClick={handlePlaceOrder}
          className={`bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
