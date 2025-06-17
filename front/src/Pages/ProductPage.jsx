import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";
import { Search, Minus, Plus } from "lucide-react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role"); // "Admin" or "Customer"
  const userPosition = localStorage.getItem("position"); // "doctor", "retailer", "distributor" (only for Customer)

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

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) + delta, 1),
    }));
  };

  const handleAddToOrder = (product) => {
    const quantity = quantities[product._id] || 1;
    const existing = orderItems.find((item) => item._id === product._id);
    if (!existing) {
      setOrderItems([...orderItems, { ...product, quantity }]);
    }
  };

  const handleProceed = () => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    navigate("/order-summary");
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 relative">
      <div className="text-sm text-gray-600 mb-2">
        Role: {userRole}
        {userRole === "Customer" && userPosition && ` (${userPosition})`}
      </div>

      {/* Search Input */}
      <div className="flex items-center bg-white p-3 rounded-md shadow-sm mb-4 w-full max-w-xl">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by product name or code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none bg-transparent"
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-2 px-3">Product</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3">Dosage Form</th>
              <th className="py-2 px-3">Packing</th>
              <th className="py-2 px-3">MRP</th>

              {userRole === "Customer" && userPosition === "Doctor" && (
                <th className="py-2 px-3">Net Rate</th>
              )}
              {userRole === "Customer" && userPosition === "Retailer" && (
                <th className="py-2 px-3">PTR</th>
              )}
              {userRole === "Customer" && userPosition === "Distributor" && (
                <th className="py-2 px-3">PTS</th>
              )}

              <th className="py-2 px-3">Tax</th>
              <th className="py-2 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-slate-50 transition border-b last:border-none"
              >
                <td className="py-3 px-3">{product.name}</td>
                <td className="py-3 px-3">{product.description}</td>
                <td className="py-3 px-3">{product.dosageForm || "TABLET"}</td>
                <td className="py-3 px-3">
                  {product.packing || "10X10 PVC BLISTER"}
                </td>
                <td className="py-3 px-3">₹{product.mrp}</td>

                {userRole === "Customer" && userPosition === "Doctor" && (
                  <td className="py-3 px-3 text-green-600">
                    ₹{product.specialPrice || product.netRate}
                  </td>
                )}
                {userRole === "Customer" && userPosition === "Retailer" && (
                  <td className="py-3 px-3 text-blue-600">
                    ₹{product.ptr || "-"}
                  </td>
                )}
                {userRole === "Customer" && userPosition === "Distributor" && (
                  <td className="py-3 px-3 text-purple-600">
                    ₹{product.pts || "-"}
                  </td>
                )}

                <td className="py-3 px-3">{product.tax || 12}%</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      onClick={() => handleQuantityChange(product._id, -1)}
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      className="w-10 text-center bg-slate-100 rounded"
                      value={quantities[product._id] || 1}
                      readOnly
                    />
                    <button
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      onClick={() => handleQuantityChange(product._id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => handleAddToOrder(product)}
                      className="ml-2 px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-xs"
                    >
                      Add
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Place Order Button */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleProceed}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-700"
          >
            Place Orders ({orderItems.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
