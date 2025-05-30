import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSummaryPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const items = JSON.parse(localStorage.getItem("orderItems") || "[]");

  const normalizedItems = items.map((item) => ({
    ...item,
    quantity: Number(item.quantity) || 1,
    netRate: Number(item.netRate) || 0,
    tax: Number(item.tax) || 0,
  }));

  console.log("Normalized order items:", normalizedItems); // Debug log

  setOrderItems(normalizedItems);
}, []);


const subtotal = orderItems.reduce((sum, item) => {
  const lineTotal = item.netRate * item.quantity;
  return sum + lineTotal;
}, 0);

const totalTax = orderItems.reduce((sum, item) => {
  const taxAmount = (item.netRate * item.quantity * item.tax) / 100;
  return sum + taxAmount;
}, 0);

  const shipping = subtotal > 10000 ? 0 : 250;
  const grandTotal = subtotal + totalTax + shipping;

  const handlePlaceOrder = () => {
    const order = {
      items: orderItems,
      note,
      subtotal,
      tax: totalTax,
      shipping,
      total: grandTotal,
    };

    console.log("Order placed:", order);
    
    alert("Order placed successfully!");
    navigate("/thank-you");
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

      <div className="space-y-4 mb-6">
        {orderItems.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{item.productName}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="mt-2 text-gray-700">
                Quantity: <strong>{item.quantity}</strong>
              </p>
            </div>
            <div className="text-right">
              <p>₹{(item.netRate * (item.quantity || 1)).toFixed(2)}</p>
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
        <p>Shipping: ₹{shipping}</p>
        <hr className="my-2" />
        <p className="text-xl">Total: ₹{grandTotal.toFixed(2)}</p>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handlePlaceOrder}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
