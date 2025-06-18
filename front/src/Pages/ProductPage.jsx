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
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");
  const userPosition = localStorage.getItem("position");

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
          const matchedPrices = specialPrices.filter(
            (sp) => sp.productId === product._id
          );
          const latest = matchedPrices.sort((a, b) =>
            a._id < b._id ? 1 : -1
          )[0];

          return latest
            ? { ...product, specialPrice: latest.approvedPrice }
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
    const exists = orderItems.find((item) => item._id === product._id);

    if (exists) {
      setOrderItems(orderItems.filter((item) => item._id !== product._id));
    } else {
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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 relative">
      <div className="text-sm text-gray-600 mb-2">
        Role: {userRole}
        {userRole === "Customer" && userPosition && ` (${userPosition})`}
      </div>

      <div className="flex items-center bg-white p-3 rounded-md shadow-sm mb-4 w-full max-w-xl">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by product name or code"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-full outline-none bg-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedProducts.map((product) => {
          const quantity = quantities[product._id] || 1;
          const isAdded = orderItems.some((item) => item._id === product._id);

          let priceLabel = null;
          if (userRole === "Customer") {
            if (userPosition === "Doctor")
              priceLabel = product.specialPrice || product.netRate || "-";
            if (userPosition === "Retailer")
              priceLabel = product.specialPrice || product.ptr || "-";
            if (userPosition === "Distributor")
              priceLabel = product.specialPrice || product.pts || "-";
          }

          return (
            <div
              key={product._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-md font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{product.description}</p>
              <p className="text-xs text-gray-400 mb-1">
                Dosage: {product.dosageForm || "TABLET"}
              </p>
              <p className="text-xs text-gray-400 mb-1">
                Packing: {product.packing || "10X10 PVC BLISTER"}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                MRP: ₹{product.mrp}
              </p>

              {userRole === "Customer" && (
                <p className="text-sm font-semibold mt-1">
                  {userPosition === "Doctor" && (
                    <span className="text-green-600">Net Rate: ₹{priceLabel}</span>
                  )}
                  {userPosition === "Retailer" && (
                    <span className="text-blue-600">PTR: ₹{priceLabel}</span>
                  )}
                  {userPosition === "Distributor" && (
                    <span className="text-purple-600">PTS: ₹{priceLabel}</span>
                  )}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-1">Tax: {product.tax || 12}%</p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => handleQuantityChange(product._id, -1)}
                >
                  <Minus size={14} />
                </button>

                <input
                  type="number"
                  className="w-12 text-center bg-slate-100 rounded"
                  value={quantity}
                  onChange={(e) => {
                    const newQty = parseInt(e.target.value);
                    if (!isNaN(newQty) && newQty > 0) {
                      setQuantities((prev) => ({
                        ...prev,
                        [product._id]: newQty,
                      }));
                    }
                  }}
                  min="1"
                />

                <button
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => handleQuantityChange(product._id, 1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => handleAddToOrder(product)}
                className={`mt-3 px-3 py-1 text-xs rounded text-white ${
                  isAdded
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {isAdded ? "Remove" : "Add"}
              </button>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

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
