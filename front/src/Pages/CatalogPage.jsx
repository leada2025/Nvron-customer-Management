import React, { useState } from "react";

const categories = [
  "All",
  "Gyneron",
  "Limatcardio",
  "Care Well",
  "Diabetic care",
  "Gastro care",
  "Neuro care",
  "Pulmo care"
];

const CatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const catalog = [
    { _id: "1", name: "Calciron CCM", dosage: "Calcium Citrate Malate 500 mg + Vit‑D3 250 IU + Zn + Mg", category: "Gyneron", badge: "", description: "Supports bone health." },
    { _id: "2", name: "Calciron", dosage: "Calcium Carbonate 500 mg + Vitamin D3 250 IU", category: "Gyneron", badge: "", description: "Prevents calcium deficiency." },
    { _id: "3", name: "CalDiron Softgel", dosage: "Calcium Carbonate + Calcitriol + Zn + Mg", category: "Gyneron", badge: "Best Seller", description: "Enhanced mineral supplement." },
    { _id: "4", name: "Mefirgil‑T 500", dosage: "Tranexamic Acid 250 mg + Mefenamic Acid 500 mg", category: "Gyneron", badge: "", description: "For heavy menstrual bleeding." },
    { _id: "5", name: "MULTIVIRON‑F", dosage: "Ferrous Ascorbate + Folic Acid + Zinc", category: "Gyneron", badge: "Doctor Recommended", description: "Iron + folic acid supplement." },
    { _id: "6", name: "MULTIVIRON‑M", dosage: "Multivitamins + Multiminerals", category: "Gyneron", badge: "", description: "Daily health support." },
    { _id: "7", name: "Amloron", dosage: "Amlodipine 2.5/5 mg", category: "Limatcardio", badge: "Best Seller", description: "For hypertension and angina." },
    { _id: "8", name: "Bisoron", dosage: "Bisoprolol Fumarate 2.5/5 mg", category: "Limatcardio", badge: "Doctor Recommended", description: "Heart-related conditions." },
    { _id: "9", name: "Cliniron", dosage: "Cilnidipine 5/10 mg", category: "Limatcardio", badge: "", description: "Treats high blood pressure." },
    { _id: "10", name: "Cardizine MR", dosage: "Trimetazidine MR 35 mg", category: "Limatcardio", badge: "", description: "Improves heart function." },
    { _id: "11", name: "Rabiron‑C", dosage: "Ramipril 2.5/5/10 mg + Chlorthalidone 6.25 mg", category: "Limatcardio", badge: "", description: "HTN combination therapy." },
    { _id: "12", name: "Lipiviron", dosage: "Atorvastatin 10/20/40 mg", category: "Care Well", badge: "New", description: "Lowers cholesterol." },
    { _id: "13", name: "Aceviron‑P/SP", dosage: "Aceclofenac 100 mg + Paracetamol 325 mg + Serratiopeptidase 15 mg", category: "Care Well", badge: "", description: "Pain & anti‑inflammatory." },
    { _id: "14", name: "Calciviron‑Z", dosage: "Calcium + Vitamin D + Zinc + Vit K", category: "Care Well", badge: "", description: "Bone support formula." },
    { _id: "15", name: "GLYCIRON M1", dosage: "Metformin 500 mg + Glimepiride 1 mg", category: "Diabetic care", badge: "Doctor Recommended", description: "Controls blood sugar." },
    { _id: "16", name: "GLYCIRON M2", dosage: "Metformin 500 mg + Glimepiride 2 mg", category: "Diabetic care", badge: "", description: "Blood glucose regulation." },
    { _id: "17", name: "Glyciron Forte", dosage: "Metformin SR 1000 mg", category: "Diabetic care", badge: "", description: "Sustained sugar control." },
    { _id: "18", name: "AlphaBetic", dosage: "Alpha‑lipoic acid + Methylcobalamin + B1/B6", category: "Diabetic care", badge: "Best Seller", description: "Diabetic neuropathy." },
    { _id: "19", name: "DIRON M", dosage: "Metformin + Pioglitazone", category: "Diabetic care", badge: "", description: "Improves insulin sensitivity." },
    { _id: "20", name: "Rabiron‑D", dosage: "Rabeprazole EC 20 mg + Domperidone SR 30 mg", category: "Gastro care", badge: "Best Seller", description: "For reflux & motility." },
    { _id: "21", name: "Panon‑40", dosage: "Pantoprazole 40 mg", category: "Gastro care", badge: "", description: "PPI for ulcer & acidity." },
    { _id: "22", name: "Clovir‑Duo", dosage: "Domperidone 10 mg + Antacid", category: "Gastro care", badge: "", description: "Relieves dyspepsia." },
    { _id: "23", name: "Pregaron Plus", dosage: "Pregabalin 75 mg + Methylcobalamin 750 mcg", category: "Neuro care", badge: "", description: "For neuropathic pain." },
    { _id: "24", name: "Neurovit‑SR", dosage: "Methylcobalamin + Alpha Lipoic Acid SR", category: "Neuro care", badge: "", description: "Nerve health support." },
    { _id: "25", name: "Pulvit‑Plus", dosage: "Vitamin C + Zinc + Elderberry", category: "Pulmo care", badge: "", description: "Immune & respiratory support." },
    { _id: "26", name: "BronchoCare‑X", dosage: "Guaifenesin 200 mg + Menthol", category: "Pulmo care", badge: "", description: "Helps clear mucus." }
  ];

  const filteredCatalog = catalog.filter(item => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 bg-[#e6f7f7] min-h-screen">
      <h2 className="text-2xl font-bold text-[#0b7b7b] mb-4">Product Catalogue</h2>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-72 rounded-lg border border-[#0b7b7b] bg-white shadow-sm focus:ring-2 focus:ring-[#0b7b7b]/30"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                activeCategory === cat ? "bg-[#0b7b7b] text-white" : "bg-white border-[#0b7b7b] text-[#0b7b7b] hover:bg-[#d9f0f0]"
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
          {filteredCatalog.map(item => (
            <div key={item._id} className="bg-white border border-[#0b7b7b]/20 rounded-xl p-4 shadow hover:shadow-lg transition group relative">
              {item.badge && (
                <div className="absolute top-2 right-2 bg-[#0b7b7b] text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </div>
              )}
              <div className="w-full h-24 flex items-center justify-center bg-[#f0fefe] font-bold text-sm mb-4 text-center px-2">
                {item.name}
              </div>
              <p className="text-xs text-[#0b7b7b]/70 mb-2">{item.dosage}</p>
              <p className="text-xs text-[#0b7b7b]/60 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
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
