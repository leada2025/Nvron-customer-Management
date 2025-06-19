import React, { useState } from "react";
import { Star } from "lucide-react";

const categories = [
  "All",
  "Gyneron",
  "Diabetic care",
  "Limatcardio",
  "Pulmo care",
  "Care well",
  "Gastro care",
  "Neuro care",
];

const CatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const catalog = [
    {
      _id: "1",
      name: "Amloron",
      dosage: "Amlodipine 2.5 / 5 mg",
      price: 22.0,
      category: "Limatcardio",
      rating: 4.5,
      badge: "Best Seller",
      description: "Used for treating high blood pressure and chest pain.",
      image: "/images/amloron.png",
    },
    {
      _id: "2",
      name: "Bisoron",
      dosage: "Bisoprolol Fumarate 2.5 / 5 mg",
      price: 18.0,
      category: "Limatcardio",
      rating: 4.0,
      badge: "Doctor Recommended",
      description: "Commonly used for heart-related conditions and BP.",
      image: "/images/bisoron.png",
    },
    {
      _id: "3",
      name: "Lipiviron",
      dosage: "Atorvastatin 10 / 20 / 40 mg",
      price: 28.5,
      category: "Care well",
      rating: 3.8,
      badge: "New",
      description: "Used to lower cholesterol and triglyceride levels.",
      image: "/images/lipiviron.png",
    },
    {
      _id: "4",
      name: "Cliniron",
      dosage: "Cilnidipine 5 / 10 mg",
      price: 19.99,
      category: "Limatcardio",
      rating: 4.2,
      badge: "",
      description: "Treats high blood pressure, reducing heart attack risk.",
      image: "/images/cliniron.png",
    },
  ];

  const filteredCatalog = catalog.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 bg-[#e6f7f7] min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0b7b7b] mb-4">Product Catalogue</h2>

        {/* Search and Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-72 rounded-lg border border-[#0b7b7b] bg-white text-[#0b7b7b] placeholder:text-[#0b7b7b]/50 shadow-sm focus:ring-2 focus:ring-[#0b7b7b]/30"
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
      </div>

      {filteredCatalog.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredCatalog.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-[#0b7b7b]/20 rounded-xl p-4 shadow hover:shadow-lg transition duration-200 group relative"
            >
              {item.badge && (
                <div className="absolute top-2 right-2 bg-[#0b7b7b] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </div>
              )}

              <img
                src={item.image}
                alt={item.name}
                className="w-full h-24 object-contain mb-4"
                onError={(e) => (e.target.src = "/placeholder-product.png")}
              />

              <h3 className="text-[#0b7b7b] font-semibold text-sm">{item.name}</h3>
              <p className="text-xs text-[#0b7b7b]/70 mb-1">{item.dosage}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill={i < item.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              {/* Hover reveal */}
              <p className="text-xs text-[#0b7b7b]/60 group-hover:line-clamp-none line-clamp-2 transition-all duration-300">
                {item.description}
              </p>

              <p className="mt-2 font-bold text-[#0b7b7b]">₹{item.price.toFixed(2)}</p>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-[#0b7b7b] text-white text-sm py-1.5 rounded hover:bg-[#095e5e] transition">
                  Order
                </button>
                <button className="flex-1 border border-[#0b7b7b] text-[#0b7b7b] text-sm py-1.5 rounded hover:bg-[#def8f8] transition">
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
