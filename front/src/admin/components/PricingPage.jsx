import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

export default function PricingPage() {
  const [products, setProducts] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [proposedRates, setProposedRates] = useState({});
  const [minRates, setMinRates] = useState({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Add this line

  useEffect(() => {
    fetchProducts();
    fetchPricing();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products/unapproved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchPricing = async () => {
    try {
      const res = await axios.get("/api/pricing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPricingList(res.data);
    } catch (err) {
      console.error("Failed to fetch pricing proposals", err);
    }
  };

 const handleProposePrice = async (productId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const customerId = user?._id;

    if (!customerId) {
      console.error("User is not logged in or missing ID.");
      return; // stop if no user ID
    }

    const proposedRate = proposedRates[productId];
    const minRate = minRates[productId];

    await axios.post(
      "/api/pricing",
      { customerId, productId, proposedRate, minRate },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setProposedRates((prev) => ({ ...prev, [productId]: "" }));
    setMinRates((prev) => ({ ...prev, [productId]: "" }));
    fetchPricing();
  } catch (err) {
    console.error("Failed to submit proposal", err);
  }
};


  const handleApprove = async (pricingId) => {
    try {
      const approvedRate = prompt("Enter approved rate:");
      if (!approvedRate) return;

      await axios.patch(
        `/api/pricing/${pricingId}/approve`,
        { approvedRate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPricing();
      fetchProducts(); // Might be removed from unapproved list
    } catch (err) {
      console.error("Failed to approve", err);
    }
  };

  const filteredPricing = pricingList.filter((p) => {
   
    const product = p.productId?.name || "";
    return (
     
      product.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (pricingId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this pricing?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`/api/pricing/${pricingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPricing();
  } catch (err) {
    console.error("Failed to delete pricing", err);
  }
};

const filteredProducts = products.filter((prod) =>
  prod.name.toLowerCase().includes(searchTerm.toLowerCase())
);



  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Pricing Management</h2>

      <input
        type="text"
        placeholder="Search by customer or product"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 mb-6 w-full max-w-md"
      />

      {/* Unapproved Products */}
      <h3 className="text-xl font-medium mb-3">Unapproved Products</h3>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full border border-gray-200">
         <thead className="bg-gray-100">
  <tr>
    <th className="p-3 border-b text-left">Product</th>
    <th className="p-3 border-b text-right">MRP (₹)</th>
    <th className="p-3 border-b text-right">Net Rate (₹)</th>
    <th className="p-3 border-b text-right">Proposed Rate</th>
    <th className="p-3 border-b text-right">Min Rate</th>
    <th className="p-3 border-b text-center">Action</th>
  </tr>
</thead>

       <tbody>
  {filteredProducts.map((prod) => (

    <tr key={prod._id}>
      <td className="p-3 border-b">{prod.name}</td>
      <td className="p-3 border-b text-right">{prod.mrp?.toFixed(2)}</td>
      <td className="p-3 border-b text-right">{prod.netRate?.toFixed(2)}</td>
      <td className="p-3 border-b text-right">
        <input
          type="number"
          value={proposedRates[prod._id] || ""}
          onChange={(e) =>
            setProposedRates({ ...proposedRates, [prod._id]: e.target.value })
          }
          className="border px-2 py-1 w-24"
        />
      </td>
      <td className="p-3 border-b text-right">
        <input
          type="number"
          value={minRates[prod._id] || ""}
          onChange={(e) =>
            setMinRates({ ...minRates, [prod._id]: e.target.value })
          }
          className="border px-2 py-1 w-24"
        />
      </td>
      <td className="p-3 border-b text-center">
        <button
          onClick={() => handleProposePrice(prod._id)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Propose
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Pricing Proposals */}
      <h3 className="text-xl font-medium mb-3">Pricing Proposals</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-left">Propsed by</th>
              <th className="p-3 border-b text-left">Product</th>
              <th className="p-3 border-b text-right">Proposed (₹)</th>
              <th className="p-3 border-b text-right">Approved (₹)</th>
              <th className="p-3 border-b text-right">Min (₹)</th>
              <th className="p-3 border-b text-center">Status</th>
              <th className="p-3 border-b text-center">Date</th>
              <th className="p-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPricing.map((p, i) => (
              <tr key={p._id}>
                <td className="p-3 border-b">{p.customerId?.name || "N/A"}</td>
                <td className="p-3 border-b">{p.productId?.name || "N/A"}</td>
                <td className="p-3 border-b text-right">{p.proposedRate?.toFixed(2)}</td>
                <td className="p-3 border-b text-right">{p.approvedRate?.toFixed(2) || "-"}</td>
                <td className="p-3 border-b text-right">{p.minRate?.toFixed(2)}</td>
                <td className="p-3 border-b text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      p.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : p.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                  <td className="p-3 border-b text-center">
    {new Date(p.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}
  </td>
                <td className="p-3 border-b text-center space-x-2">
  {p.status === "pending" && (
    <button
      onClick={() => handleApprove(p._id)}
      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Approve
    </button>
  )}
  <button
    onClick={() => handleDelete(p._id)}
    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
  >
    Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
