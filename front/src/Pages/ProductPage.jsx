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
  const userPosition = localStorage.getItem("position")?.toLowerCase(); // doctor, retailer, distributor

  useEffect(() => {
    const fetchData = async () => {
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
  const matchedPrices = specialPrices.filter((sp) => {
    const spProductId = sp.productId?._id || sp.productId;
    return String(spProductId) === String(product._id);
  });

  // Sort matched prices by updatedAt or createdAt
  const sortedByDate = matchedPrices.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);
    return dateB - dateA;
  });

  // Get the most recent approvedPrice that is defined and not null
  const latestValid = sortedByDate.find(
    (item) => item.approvedPrice !== undefined && item.approvedPrice !== null
  );

  return {
    ...product,
    recentSpecialPrice: latestValid?.approvedPrice,
  };
});

 
        setProducts(enrichedProducts);
      } catch (err) {
        console.error("Failed to fetch products or prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

    // Determine unitPrice
    let unitPrice = 0;
    if (userRole === "Customer") {
      if (product.recentSpecialPrice) {
        unitPrice = product.recentSpecialPrice;
      } else if (userPosition === "doctor") {
        unitPrice = product.netRate;
      } else if (userPosition === "retailer") {
        unitPrice = product.ptr;
      } else if (userPosition === "distributor") {
        unitPrice = product.pts;
      }
    }

    if (exists) {
      setOrderItems(orderItems.filter((item) => item._id !== product._id));
    } else {
      setOrderItems([
        ...orderItems,
        {
          _id: product._id,
          productId: product._id,
          productName: product.name,
          quantity,
          description: product.description,
          unitPrice: unitPrice || 0,
          tax: product.tax || 12,
        },
      ]);
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

      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-2 px-3">Product</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3">Dosage Form</th>
              <th className="py-2 px-3">Packing</th>
              <th className="py-2 px-3">MRP</th>
              <th className="py-2 px-3">Price</th>
              <th className="py-2 px-3">Tax</th>
              <th className="py-2 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              let displayPrice = "-";
              let colorClass = "text-gray-700";

              if (userRole === "Customer") {
                if (product.recentSpecialPrice) {
                  displayPrice = `₹${product.recentSpecialPrice}`;
                  colorClass = "text-green-600";
                } else if (userPosition === "doctor") {
                  displayPrice = `₹${product.netRate || "-"}`;
                } else if (userPosition === "retailer") {
                  displayPrice = `₹${product.ptr || "-"}`;
                } else if (userPosition === "distributor") {
                  displayPrice = `₹${product.pts || "-"}`;
                }
              }

              return (
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
                  <td className={`py-3 px-3 font-semibold ${colorClass}`}>
                    {displayPrice}
                  </td>
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
                        className="w-12 text-center bg-slate-100 rounded"
                        value={quantities[product._id] || 1}
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

                      {orderItems.some((item) => item._id === product._id) ? (
                        <button
                          onClick={() => handleAddToOrder(product)}
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddToOrder(product)}
                          className="ml-2 px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-xs"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
