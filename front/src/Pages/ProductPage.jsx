// pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";
import ProductList from "../components/ProductList";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products"); // Change URL if deployed
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToOrder = (product) => {
    setOrderItems((prev) => [...prev, product]);
  };

  const handleProceed = () => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    navigate("/order-summary");
  };

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <ProductList products={products} onAddToOrder={handleAddToOrder} />

      {orderItems.length > 0 && (
        <div className="text-right mt-4">
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
