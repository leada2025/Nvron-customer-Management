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
  const fetchProductsAndSpecialPrices = async () => {
    try {
      const token = localStorage.getItem("token");

      const [productsRes, specialPricesRes] = await Promise.all([
        axios.get("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/negotiations/special-prices", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Merge special prices into products
      const specialPrices = specialPricesRes.data;
      const enrichedProducts = productsRes.data.map((product) => {
        const matched = specialPrices.find(
          (sp) => sp.productId === product._id
        );
        return matched
         ? { ...product, specialPrice: matched.approvedPrice }

          : product;
      });

      setProducts(enrichedProducts);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProductsAndSpecialPrices();
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
