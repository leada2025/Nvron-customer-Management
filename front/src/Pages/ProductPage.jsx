import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/Axios";
import { Search, Minus, Plus } from "lucide-react";
import { LayoutGrid, Table } from "lucide-react"; // 👈 Add at top


const ITEMS_PER_PAGE = 12;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 640; // Tailwind 'sm' breakpoint
const [viewMode, setViewMode] = useState(() => {
  if (isMobile) return "card";
  return localStorage.getItem("viewMode") || "card";
});
const [commissionConfig, setCommissionConfig] = useState({ slabs: [], fixedPTSRate: 9 });

const [specialPrices, setSpecialPrices] = useState([]);




  const userRole = localStorage.getItem("role");
  const userPosition = localStorage.getItem("position");

useEffect(() => {
  window.scroll(0, 0);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const [prods, specials] = await Promise.all([
        axios.get("/api/products", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/negotiations/special-prices", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      // Try partner-specific config first
      let config = null;
      try {
        const partnerRes = await axios.get(`/api/partner-commission/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        config = partnerRes.data;
      } catch (err) {
        console.warn("No partner-specific config found. Falling back to global...");
        const globalRes = await axios.get("/api/commission", {
          headers: { Authorization: `Bearer ${token}` }
        });
        config = globalRes.data;
      }
setSpecialPrices(specials.data);
      setCommissionConfig(config);

      // Enrich products with special prices
      const sp = specials.data;
      // ✅ check if partner has any special price at all
const partnerHasAnySpecial = sp.length > 0;

      const enriched = prods.data.map((p) => {
        const match = sp
          .filter((s) => s.productId === p._id)
          .sort((a, b) => (a._id < b._id ? 1 : -1))[0];
        return match ? { ...p, specialPrice: match.approvedPrice } : p;
      });

      const savedItems = JSON.parse(localStorage.getItem("orderItems")) || [];
      setProducts(enriched);
      setOrderItems(savedItems);

      const initialQuantities = {};
      savedItems.forEach(item => {
        initialQuantities[item._id] = item.quantity || 1;
      });
      setQuantities(initialQuantities);
    } catch (e) {
      console.error("Fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



const handleQty = (id, d) => {
  setQuantities((q) => {
    const current = parseInt(q[id] ?? "1");
    const updated = isNaN(current) ? 1 : Math.max(current + d, 1);
    return { ...q, [id]: String(updated) };
  });
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
let partnerSubtotal = 0;
const hasSpecialRate = specialPrices.length > 0;
// ✅ Global flag
const partnerProductTotals = {};

if (userPosition === "Partners") {
  orderItems.forEach((item) => {
    const price = parseFloat(item.specialPrice || item.pts || 0);
    const qty = parseInt(item.quantity || 1);
    const total = price * qty;
    partnerSubtotal += total;
    partnerProductTotals[item._id] = total;
  });
}





const getCommissionPercent = (total, hasSpecialRate) => {
  if (!hasSpecialRate) {
    return commissionConfig.fixedPTSRate ?? 9;
  }

  const slabs = commissionConfig.slabs || [];
  for (const slab of slabs) {
    if (total >= slab.from && total <= slab.to) {
      return slab.percent;
    }
  }
  return 0;
};



const commissionPercent = getCommissionPercent(partnerSubtotal, hasSpecialRate);


  if (loading)
    return <div className="p-6 text-center text-[#0b7b7b]">Loading products...</div>;

  const toggleView = () => {
  const newMode = viewMode === "card" ? "table" : "card";
  setViewMode(newMode);
  localStorage.setItem("viewMode", newMode);
};




// Subtotal only for Partner



  return (
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* <div className="text-sm text-[#0b7b7b]">
          Role: {userRole}
          {userRole === "Customer" && userPosition ? ` (${userPosition})` : ""}
        </div> */}

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
      <div className="flex justify-end sm:flex hidden">
  <button
    onClick={toggleView}
    className="mb-4 p-2 bg-white border border-[#0b7b7b] rounded-full shadow hover:bg-[#d9f0f0] transition"
    title={viewMode === "card" ? "Switch to Table View" : "Switch to Card View"}
  >
    {viewMode === "card" ? (
      <Table size={18} className="text-[#0b7b7b]" />
    ) : (
      <LayoutGrid size={18} className="text-[#0b7b7b]" />
    )}
  </button>
</div>



{viewMode === "card" ? (
  <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shown.map((p) => {
            const qty = quantities[p._id] || 1;
            const added = orderItems.some((i) => i._id === p._id);
            let priceLabel = null;
            if (userRole === "Customer") {
              if (userPosition === "Doctor") priceLabel = p.specialPrice || p.pts || "-";
              if (userPosition === "Retailer") priceLabel = p.specialPrice || p.ptr || "-";
              if (userPosition === "Distributor") priceLabel = p.specialPrice || p.pts || "-";
              if (userPosition === "Partners") priceLabel = p.specialPrice || p.pts || "-";
            }

            return (
              <div
                key={p._id}
                 className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col justify-between h-full relative"
              >
               <div className="flex-1">
  <h3 className="text-[#0b7b7b] font-semibold mb-1">{p.name}</h3>
  <p className="text-xs text-[#0b7b7b]/70 mb-1">{p.description}</p>
  <p className="text-xs text-[#0b7b7b]/60">Dosage: {p.dosageForm || "TABLET"}</p>
  <p className="text-xs text-[#0b7b7b]/60">Packing: {p.packing || "10X10 PVC BLISTER"}</p>
  <p className="text-sm font-bold text-[#0b7b7b] mt-1">MRP: ₹{p.mrp}</p>
  {userRole === "Customer" && (
    <p className="text-sm font-semibold mt-1">
      {userPosition === "Doctor" && <span className="text-green-600">PTS  ₹{priceLabel}</span>}
      {userPosition === "Retailer" && <span className="text-blue-600">PTR ₹{priceLabel}</span>}
      {userPosition === "Distributor" && <span className="text-purple-600">PTS ₹{priceLabel}</span>}
      {userPosition === "Partners" && <span className="text-purple-600">PTS ₹{priceLabel}</span>}
    </p>
  )}

  {userPosition === "Partners" && added && (
  <p className="text-xs text-green-700 mt-1">
    Commission: ₹{((partnerProductTotals[p._id] || 0) * commissionPercent / 100).toFixed(2)}
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
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  className="w-12 text-center bg-[#f1f5f5] rounded disabled:opacity-50"
  value={quantities[p._id] ?? "1"}
  onChange={(e) => {
    const val = e.target.value;

    // Allow only digits and empty string
    if (/^\d*$/.test(val)) {
      setQuantities((q) => ({ ...q, [p._id]: val }));
    }
  }}
  onBlur={() => {
    const val = quantities[p._id];
    const num = parseInt(val);
    if (!num || num < 1) {
      setQuantities((q) => ({ ...q, [p._id]: "1" }));
    } else {
      setQuantities((q) => ({ ...q, [p._id]: String(num) }));
    }
  }}
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

          {userPosition === "Partners" && (
      <div className="p-3 text-right text-sm text-[#0b7b7b] font-medium">
        Order Subtotal: ₹{partnerSubtotal.toFixed(2)} <br />
        Commission: {commissionPercent}% <br />
        Estimated Commission Amount: ₹{(partnerSubtotal * commissionPercent / 100).toFixed(2)}
      </div>
    )}
         </>

       

        
        ) :(  <div className="overflow-auto rounded shadow border border-[#0b7b7b]/30">
    <table className="w-full text-sm text-left">
      <thead className="bg-[#0b7b7b] text-white">
        <tr>
          <th className="p-2">Name</th>
          <th className="p-2">Description</th>
          <th className="p-2">Packing</th>
          <th className="p-2">MRP</th>
          <th className="p-2">Rate</th>
          <th className="p-2">Qty</th>
          {userPosition === "Partners" && <th className="p-2">Commission/{commissionPercent}%</th>}
          <th className="p-2">Action</th>
          
        </tr>
      </thead>
      <tbody>
        {shown.map((p) => {
          const qty = quantities[p._id] || 1;
          const added = orderItems.some((i) => i._id === p._id);
          let priceLabel = "-";
          if (userRole === "Customer") {
            if (userPosition === "Doctor") priceLabel = p.specialPrice || p.pts || "-";
            if (userPosition === "Retailer") priceLabel = p.specialPrice || p.ptr || "-";
            if (userPosition === "Distributor") priceLabel = p.specialPrice || p.pts || "-";
             if (userPosition === "Partners") priceLabel = p.specialPrice || p.pts || "-";
          }

          return (
            <tr key={p._id} className="border-b hover:bg-[#f1f5f5]">
              <td className="p-2">{p.name}</td>
              <td className="p-2 text-xs text-gray-700">{p.description}</td>
              <td className="p-2">{p.packing || "10X10 PVC BLISTER"}</td>
              <td className="p-2">₹{p.mrp}</td>
              <td className="p-2">
                {userPosition === "Doctor" && <span className="text-green-600">₹{priceLabel}</span>}
                {userPosition === "Retailer" && <span className="text-blue-600">₹{priceLabel}</span>}
                {userPosition === "Distributor" && <span className="text-purple-600">₹{priceLabel}</span>}
                 {userPosition === "Partners" && <span className="text-purple-600">{priceLabel}</span>}
              </td>
             

              <td className="p-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQty(p._id, -1)}
                    className="px-1 bg-[#d9f0f0] hover:bg-[#bef0f0] rounded disabled:opacity-50"
                    disabled={added}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={quantities[p._id] ?? "1"}
                    disabled={added}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) {
                        setQuantities((q) => ({ ...q, [p._id]: val }));
                      }
                    }}
                    onBlur={() => {
                      const val = quantities[p._id];
                      const num = parseInt(val);
                      if (!num || num < 1) {
                        setQuantities((q) => ({ ...q, [p._id]: "1" }));
                      } else {
                        setQuantities((q) => ({ ...q, [p._id]: String(num) }));
                      }
                    }}
                    className="w-10 text-center border rounded"
                  />
                  <button
                    onClick={() => handleQty(p._id, 1)}
                    className="px-1 bg-[#d9f0f0] hover:bg-[#bef0f0] rounded disabled:opacity-50"
                    disabled={added}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </td>

               {userPosition === "Partners" && (
  <td className="p-2">
    {added
      ? `₹${((partnerProductTotals[p._id] || 0) * commissionPercent / 100).toFixed(2)}`
      : "-"}
  </td>
)}

              <td className="p-2">
                <button
                  onClick={() => handleAdd(p)}
                  className={`px-3 py-1 rounded text-white text-xs ${
                    added ? "bg-red-600 hover:bg-red-700" : "bg-[#0b7b7b] hover:bg-[#095e5e]"
                  }`}
                >
                  {added ? "Remove" : "Add"}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    {userPosition === "Partners" && (
  <div className="p-3 text-right text-sm text-[#0b7b7b] font-medium">
    Order Subtotal: ₹{partnerSubtotal.toFixed(2)} <br />
    Commission: {commissionPercent}% <br />
    Estimated Commission Amount: ₹{(partnerSubtotal * commissionPercent / 100).toFixed(2)}
  </div>
)}

  </div>
)}

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
