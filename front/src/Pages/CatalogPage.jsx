import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const CatalogPage = () => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/catalog", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCatalog(response.data);
      } catch (error) {
        console.error("Failed to load catalog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading catalog...</div>;
  }

  if (catalog.length === 0) {
    return <div className="p-6 text-center text-gray-500">No items found in catalog.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Catalog</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {catalog.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="mt-2 text-purple-700 font-medium">₹{item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
