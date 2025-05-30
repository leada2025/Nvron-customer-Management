// pages/ProductPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import products from "../Data/Product.js";

const ProductPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  const handleAddToOrder = (product) => {
    setOrderItems((prev) => [...prev, product]);
  };

  const handleProceed = () => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    navigate("/order-summary");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
     <ProductList products={products} onAddToOrder={handleAddToOrder} />


      {orderItems.length > 0 && (
        <div className=" text-right">
          <button
            onClick={handleProceed}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
          >
            Proceed to Order Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
