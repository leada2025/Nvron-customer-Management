import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";
import { Search, Minus, Plus } from "lucide-react";

const ITEMS_PER_PAGE = 16;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");
  const userPosition = localStorage.getItem("position");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [prods, specials] = await Promise.all([
          axios.get("/api/products", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/negotiations/special-prices", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const sp = specials.data;
        const enriched = prods.data.map((p) => {
          const match = sp.filter((s) => s.productId === p._id)
                          .sort((a, b) => (a._id < b._id ? 1 : -1))[0];
          return match ? { ...p, specialPrice: match.approvedPrice } : p;
        });
        setProducts(enriched);
      } catch (e) {
        console.error("Fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQty = (id, d) => {
    setQuantities((q) => ({ ...q, [id]: Math.max((q[id] || 1) + d, 1) }));
  };

  const handleAdd = (p) => {
    const qty = quantities[p._id] || 1;
    setOrderItems((o) =>
      o.some((i) => i._id === p._id) ? o.filter((i) => i._id !== p._id) : [...o, { ...p, quantity: qty }]
    );
  };

  const handleProceed = () => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    navigate("/order-summary");
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const shown = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading)
    return <div className="p-6 text-center text-[#0b7b7b]">Loading products...</div>;

  return (
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-sm text-[#0b7b7b]">
          Role: {userRole}
          {userRole === "Customer" && userPosition ? ` (${userPosition})` : ""}
        </div>

        <div className="flex items-center bg-white rounded-lg shadow-sm border border-[#0b7b7b]/20 px-4 py-2 w-full max-w-md">
          <Search size={18} className="text-[#0b7b7b]/60 mr-2" />
          <input
            type="text"
            placeholder="Search by product name or code"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full outline-none bg-transparent text-[#0b7b7b]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shown.map((p) => {
            const qty = quantities[p._id] || 1;
            const added = orderItems.some((i) => i._id === p._id);
            let priceLabel = null;
            if (userRole === "Customer") {
              if (userPosition === "Doctor") priceLabel = p.specialPrice || p.netRate || "-";
              if (userPosition === "Retailer") priceLabel = p.specialPrice || p.ptr || "-";
              if (userPosition === "Distributor") priceLabel = p.specialPrice || p.pts || "-";
            }

            return (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 relative"
              >
                <h3 className="text-[#0b7b7b] font-semibold mb-1">{p.name}</h3>
                <p className="text-xs text-[#0b7b7b]/70 mb-1">{p.description}</p>
                <p className="text-xs text-[#0b7b7b]/60">Dosage: {p.dosageForm || "TABLET"}</p>
                <p className="text-xs text-[#0b7b7b]/60">Packing: {p.packing || "10X10 PVC BLISTER"}</p>
                <p className="text-sm font-bold text-[#0b7b7b] mt-1">MRP: ₹{p.mrp}</p>
                {userRole === "Customer" && (
                  <p className="text-sm font-semibold mt-1">
                    {userPosition === "Doctor" && <span className="text-green-600">Net ₹{priceLabel}</span>}
                    {userPosition === "Retailer" && <span className="text-blue-600">PTR ₹{priceLabel}</span>}
                    {userPosition === "Distributor" && <span className="text-purple-600">PTS ₹{priceLabel}</span>}
                  </p>
                )}
                <p className="text-xs text-[#0b7b7b]/60 mt-1">Tax: {p.tax || 12}%</p>

             <div className="flex items-center gap-2 mt-3">
  <button
    className="px-2 py-1 bg-[#d9f0f0] hover:bg-[#bef0f0] rounded disabled:opacity-50"
    onClick={() => handleQty(p._id, -1)}
    disabled={added}
  >
    <Minus size={14} />
  </button>
  <input
    type="number"
    className="w-12 text-center bg-[#f1f5f5] rounded disabled:opacity-50"
    value={qty}
    onChange={(e) => {
      const v = parseInt(e.target.value);
      if (!isNaN(v) && v > 0) setQuantities((q) => ({ ...q, [p._id]: v }));
    }}
    min="1"
    disabled={added}
  />
  <button
    className="px-2 py-1 bg-[#d9f0f0] hover:bg-[#bef0f0] rounded disabled:opacity-50"
    onClick={() => handleQty(p._id, 1)}
    disabled={added}
  >
    <Plus size={14} />
  </button>
</div>


                <button
                  onClick={() => handleAdd(p)}
                  className={`relative bottom-0 mt-3 w-full py-2 text-sm font-semibold rounded ${
                    added
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#0b7b7b] hover:bg-[#095e5e]"
                  } text-white transition`}
                >
                  {added ? "Remove" : "Add"}
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
              className="px-3 py-1 bg-white border border-[#0b7b7b] text-[#0b7b7b] disabled:opacity-50 hover:bg-[#d9f0f0] transition"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded transition ${
                  currentPage === i + 1
                    ? "bg-[#0b7b7b] text-white"
                    : "bg-white border-[#0b7b7b] text-[#0b7b7b] hover:bg-[#d9f0f0]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-[#0b7b7b] text-[#0b7b7b] disabled:opacity-50 hover:bg-[#d9f0f0] transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {orderItems.length > 0 && (
        <button
          onClick={handleProceed}
          className="fixed bottom-6 right-6 bg-[#095e5e] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#095e5e] transition"
        >
          Place Orders ({orderItems.length})
        </button>
      )}
    </div>
  );
}
