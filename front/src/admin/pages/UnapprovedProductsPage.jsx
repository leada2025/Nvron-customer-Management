import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

export default function UnapprovedProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [proposedRates, setProposedRates] = useState({});
  const [minRates, setMinRates] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
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

  const handleProposePrice = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const customerId = user?._id;

      if (!customerId) return;

      const proposedRate = proposedRates[productId];
      const minRate = minRates[productId];

      await axios.post(
        "/api/pricing",
        { customerId, productId, proposedRate, minRate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProposedRates((prev) => ({ ...prev, [productId]: "" }));
      setMinRates((prev) => ({ ...prev, [productId]: "" }));
      fetchProducts();
    } catch (err) {
      console.error("Failed to submit proposal", err);
    }
  };

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Unapproved Products</h2>

      <input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 mb-6 w-full max-w-md"
      />

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b text-left">Product</th>
            <th className="p-3 border-b text-right">MRP</th>
            <th className="p-3 border-b text-right">Net Rate</th>
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
  );
}
