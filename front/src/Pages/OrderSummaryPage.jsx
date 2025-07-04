import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";
import { jwtDecode } from "jwt-decode";

const OrderSummaryPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [successPopup, setSuccessPopup] = useState(false);
  const [commissionPercent, setCommissionPercent] = useState(0);
const [commissionAmount, setCommissionAmount] = useState(0);

  

  // ✅ Round up to 2 decimals like Zoho
  const safe = (val) => {
    if (typeof val !== "number") return 0.00;
    return Math.ceil(val * 100) / 100;
  };

  useEffect(() => {

    const calculateCommission = (items) => {
  const partnerSubtotal = items.reduce((acc, item) => {
    const price = Number(item.unitPrice) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  const getCommissionPercent = (total) => {
    if (total < 2000) return 0;
    if (total < 5000) return 3;
    if (total < 10000) return 4;
    if (total < 20000) return 6;
    if (total < 50000) return 7;
    if (total < 100000) return 8;
    if (total < 200000) return 9;
    return 10;
  };

  const percent = getCommissionPercent(partnerSubtotal);
  const amount = (partnerSubtotal * percent) / 100;

  setCommissionPercent(percent);
  setCommissionAmount(amount);
};

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const rawPosition = localStorage.getItem("position");
      const position = (rawPosition || "").trim().toLowerCase();

      try {
        const { data: specialPrices } = await axios.get("/api/negotiations/special-prices", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const priceMap = {};
        specialPrices.forEach((entry) => {
          priceMap[entry.productId] = entry.approvedPrice;
        });

        const items = JSON.parse(localStorage.getItem("orderItems") || "[]");

        const updatedItems = items.map((item) => {
          const quantity = Number(item.quantity) || 1;
          const tax = Number(item.tax) || 0;
          const approvedPrice = priceMap[item._id];

          let finalPrice = 0;
          if (approvedPrice) {
            finalPrice = approvedPrice;
          } else if (position === "doctor") {
            finalPrice = Number(item.pts);
          } else if (position === "retailer") {
            finalPrice = Number(item.ptr);
          } else if (position === "distributor") {
            finalPrice = Number(item.pts);
          } else if (position === "partners") {
            finalPrice = Number(item.pts);
          } else {
            finalPrice = Number(item.netRate); // fallback
          }

          return {
            ...item,
            quantity,
            tax,
            unitPrice: finalPrice,
            productId: item._id,
            productName: item.name,
            description: item.description,
          };
        });

        setOrderItems(updatedItems);
        if (position === "partners") {
  calculateCommission(updatedItems); // or fallback in catch block
}

      } catch (err) {
        console.error("Price load error:", err);
        const items = JSON.parse(localStorage.getItem("orderItems") || "[]");

        const fallback = items.map((item) => {
          const quantity = Number(item.quantity) || 1;
          const tax = Number(item.tax) || 0;
          let finalPrice = 0;

          if (position === "doctor") {
            finalPrice = Number(item.pts);
          } else if (position === "retailer") {
            finalPrice = Number(item.ptr);
          } else if (position === "distributor") {
            finalPrice = Number(item.pts);
            } else if (position === "partners") {
            finalPrice = Number(item.pts);
          } else {
            finalPrice = Number(item.netRate);
          }

          return {
            ...item,
            quantity,
            tax,
            unitPrice: finalPrice,
            productId: item._id,
            productName: item.name,
            description: item.description,
          };
        });

        setOrderItems(fallback);
      }
    };

    fetchData();
  }, []);

  const subtotal = safe(
    orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  );
  const totalTax = safe(
    orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity * item.tax) / 100, 0)
  );
  const shippingCharge = subtotal > 10000 ? 0 : 1;
  const totalAmount = safe(subtotal + totalTax + shippingCharge);
  <p className="text-xl">Total: ₹{safe(totalAmount).toFixed(2)}</p>
  {localStorage.getItem("position")?.toLowerCase() === "partners" && (
  <div className="mt-2 text-sm text-[#0b7b7b] text-right">
    <p>Commission Rate: {commissionPercent}%</p>
    <p>Estimated Commission: ₹{commissionAmount.toFixed(2)}</p>
  </div>
)}



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
      items: orderItems.map(
        ({ productId, productName, quantity, unitPrice, tax, description }) => ({
          productId,
          productName,
          quantity,
          netRate: unitPrice,
          tax,
          description,
        })
      ),
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
        },
      });
      setSuccessPopup(true); // Show custom box
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
        <button onClick={() => navigate("/products")} className="ml-2 text-blue-600 underline">
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

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
              <p>₹{safe(item.unitPrice * item.quantity).toFixed(2)}</p>
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
        <p>Subtotal: ₹{safe(subtotal).toFixed(2)}</p>
        <p>Tax: ₹{safe(totalTax).toFixed(2)}</p>
        <p>Shipping: ₹{shippingCharge}</p>
        <hr className="my-2" />
        <p className="text-xl">Total: ₹{safe(totalAmount).toFixed(2)}</p>
      </div>

      <div className="mt-6 text-right">
        <button
          disabled={loading}
          onClick={handlePlaceOrder}
          className={`bg-[#0b7b7b] text-white px-6 py-2 rounded-xl hover:bg-[#095e5e] ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>

      {successPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm text-center border border-[#095e5e]">
            <h2 className="text-lg font-semibold text-green-700">Success</h2>
            <p className="text-sm text-gray-600 mt-2">Your order has been placed successfully!</p>
            <button
              onClick={() => {
                localStorage.removeItem("orderItems");
                setSuccessPopup(false);
                navigate("/thank-you");
              }}
              className="mt-4 bg-[#0b7b7b] text-white px-4 py-2 rounded hover:bg-[#095e5e]"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <p className="text-xl">Total: ₹{safe(totalAmount).toFixed(2)}</p>
{localStorage.getItem("position")?.toLowerCase() === "partners" && (
  <div className="mt-2 text-sm text-[#0b7b7b] ">
    <p>Commission Rate: {commissionPercent}%</p>
    <p>Estimated Commission: ₹{commissionAmount.toFixed(2)}</p>
  </div>
)}

    </div>
  );
};

export default OrderSummaryPage;
