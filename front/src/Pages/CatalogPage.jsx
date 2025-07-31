import React, { useState, useEffect } from "react";
import axios from "../api/Axios"; // make sure this is configured
import { BASE_URL } from "../admin/api/config";

const CatalogPage = () => {
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await axios.get("/api/catalogue");
        setCatalog(res.data);

        // derive categories from the result
        const uniqueCategories = Array.from(
          new Set(res.data.map((item) => item.category?.name))
        ).filter(Boolean);
        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        console.error("Failed to load catalogue:", err);
      }
    };

    fetchCatalog();
  }, []);

  const filteredCatalog = catalog.filter((item) => {
    const matchCat =
      activeCategory === "All" || item.category?.name === activeCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 bg-[#e6f7f7] min-h-screen">
      <h2 className="text-2xl font-bold text-[#0b7b7b] mb-4">
        Product Catalogue
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-72 rounded-lg border border-[#0b7b7b] bg-white shadow-sm focus:ring-2 focus:ring-[#0b7b7b]/30"
        />

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                activeCategory === cat
                  ? "bg-[#0b7b7b] text-white"
                  : "bg-white border-[#0b7b7b] text-[#0b7b7b] hover:bg-[#d9f0f0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredCatalog.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredCatalog.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-[#0b7b7b]/20 rounded-xl p-4 shadow hover:shadow-lg transition group relative"
            >
              {item.badge && (
                <div className="absolute top-2 right-2 bg-[#0b7b7b] text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </div>
              )}

              <div className="w-full h-24 flex items-center justify-center mb-4">
                <img
                  src={
                    item.image
                      ? `${BASE_URL}${item.image}`
                      : "/assets/catalog/placeholder.png"
                  }
                  alt={item.name}
                  className="max-h-24 object-contain"
                />
              </div>

              <div className="text-sm font-bold text-center text-[#0b7b7b] mb-1">
                {item.name}
              </div>
              <p className="text-xs text-[#0b7b7b]/70 mb-1 text-center">
                {item.dosage}
              </p>
              <p className="text-xs text-[#0b7b7b]/60 text-center line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
