// Updated CatalogPage.jsx with all products in flat filtered view (previous style)
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

const catalog = [
  {
    _id: "1",
    name: "MAQ PLUS",
    dosage: "Methylcobalamin 1500mcg + Alpha Lipoic Acid 100mg + Folic Acid 1.5mg & Vitamin B6",
    category: "Neuro care",
    badge: "",
    description: "Advanced neuro supplement."
  },
  {
    _id: "2",
    name: "MAQ-P1",
    dosage: "Metformin 500mg + Glimepiride 1mg + Pioglitazone 15mg",
    category: "Diabetic care",
    badge: "",
    description: "Triple-action diabetic management."
  },
  {
    _id: "3",
    name: "CARDIZINE",
    dosage: "Trimetazidine MR 35mg",
    category: "Limatcardio",
    badge: "",
    description: "Improves heart metabolism."
  },
  {
    _id: "4",
    name: "Tissue-Rx",
    dosage: "Glucosamine, Calcium, Zinc, Vitamins, Bromelain, etc.",
    category: "Care Well",
    badge: "",
    description: "Joint and tissue support formula."
  },
  {
    _id: "5",
    name: "Sitaviron DM 500",
    dosage: "Dapagliflozin 10mg + Sitagliptin 100mg + Metformin 500mg",
    category: "Diabetic care",
    badge: "",
    description: "Triple combination diabetes care."
  },
  {
    _id: "6",
    name: "Linaxtra-M",
    dosage: "Linagliptin 2.5mg + Metformin 500mg",
    category: "Diabetic care",
    badge: "",
    description: "DPP4 inhibitor combo."
  },
  {
    _id: "7",
    name: "MAQ-P2",
    dosage: "Metformin 500mg + Glimepiride 2mg + Pioglitazone 15mg",
    category: "Diabetic care",
    badge: "",
    description: "Improved glucose control."
  },
  {
    _id: "8",
    name: "Nevostril-50",
    dosage: "Sacubitril 24mg + Valsartan 26mg",
    category: "Limatcardio",
    badge: "",
    description: "For heart failure."
  },
  {
    _id: "9",
    name: "AIRSING",
    dosage: "Fexofenadine Hydrochloride 120mg",
    category: "Pulmo care",
    badge: "",
    description: "Allergy relief."
  },
  {
    _id: "10",
    name: "Montelukast + Fexofenadine",
    dosage: "Montelukast Sodium 10mg + Fexofenadine Hydrochloride 120mg",
    category: "Pulmo care",
    badge: "",
    description: "Respiratory allergy control."
  },
  {
    _id: "11",
    name: "Rabeprazole-D",
    dosage: "Rabeprazole 20mg + Domperidone 30mg",
    category: "Gastro care",
    badge: "",
    description: "Acidity & reflux management."
  },
  {
    _id: "12",
    name: "Esomeprazole-D",
    dosage: "Esomeprazole (EC) 40mg + Domperidone (SR) 30mg",
    category: "Gastro care",
    badge: "",
    description: "Gastro-resistant PPI combo."
  },
  {
    _id: "13",
    name: "Ursodeoxycholic Acid",
    dosage: "Ursodeoxycholic Acid 300mg",
    category: "Gastro care",
    badge: "",
    description: "Liver and bile support."
  },
  {
    _id: "14",
    name: "Multivitamin Syrup",
    dosage: "Multivitamin, Minerals, Amino Acids, Trace Elements with Lysine",
    category: "Care Well",
    badge: "",
    description: "Nutritional support."
  },
    {
    _id: "15",
    name: "Amoxicillin & Clavulanic Acid",
    dosage: "Amoxicillin 500mg / Clavulanic acid 125mg",
    category: "Care Well",
    badge: "",
    description: "Broad-spectrum antibiotic."
  },
  {
    _id: "16",
    name: "Rabeprazole",
    dosage: "Rabeprazole Sodium (EC) 20mg",
    category: "Gastro care",
    badge: "",
    description: "For acid reflux and ulcers."
  },
  {
    _id: "17",
    name: "Esomeprazole",
    dosage: "Esomeprazole 40mg",
    category: "Gastro care",
    badge: "",
    description: "PPI for stomach acid reduction."
  },
  {
    _id: "18",
    name: "Nepricef",
    dosage: "Cefoperazone & Sulbactam for Injection",
    category: "Care Well",
    badge: "",
    description: "Antibiotic injection for severe infections."
  },
  {
    _id: "19",
    name: "FLECROIN-50",
    dosage: "Flecainide Tablets 50mg",
    category: "Limatcardio",
    badge: "",
    description: "Antiarrhythmic medication."
  },
  {
    _id: "20",
    name: "FLECROIN-100",
    dosage: "Flecainide Tablets 100mg",
    category: "Limatcardio",
    badge: "",
    description: "For treating irregular heartbeat."
  },
  {
    _id: "21",
    name: "Ticastril",
    dosage: "Ticagrelor Tablets",
    category: "Limatcardio",
    badge: "",
    description: "Antiplatelet therapy."
  },
  {
    _id: "22",
    name: "Protein Powder",
    dosage: "Protein powder with vitamins and minerals",
    category: "Care Well",
    badge: "",
    description: "Nutritional supplement for daily health."
  },
  {
    _id: "23",
    name: "Mirdermcol Gel",
    dosage: "Gentamycin in Collagen Gel 0.1% w/w",
    category: "Care Well",
    badge: "",
    description: "Topical antibiotic wound healing gel."
  },
  {
    _id: "24",
    name: "DIRON M",
    dosage: "Metformin + Pioglitazone",
    category: "Diabetic care",
    badge: "",
    description: "Improves insulin sensitivity."
  },
  {
    _id: "25",
    name: "Glyciron Forte",
    dosage: "Metformin SR 1000mg",
    category: "Diabetic care",
    badge: "",
    description: "Sustained release for better control."
  },
  {
    _id: "26",
    name: "GLYCIRON M2",
    dosage: "Metformin 500mg + Glimepiride 2mg",
    category: "Diabetic care",
    badge: "",
    description: "Combination diabetic therapy."
  },
  {
    _id: "27",
    name: "GLYCIRON M1",
    dosage: "Metformin 500mg + Glimepiride 1mg",
    category: "Diabetic care",
    badge: "",
    description: "Controls blood sugar effectively."
  },
  {
    _id: "28",
    name: "AlphaBetic",
    dosage: "Alpha-lipoic acid + Methylcobalamin + B1/B6",
    category: "Diabetic care",
    badge: "Best Seller",
    description: "Neuropathy support supplement."
  },
  {
    _id: "29",
    name: "Pulvit-Plus",
    dosage: "Vitamin C + Zinc + Elderberry",
    category: "Pulmo care",
    badge: "",
    description: "Immune and respiratory support."
  },
    {
    _id: "30",
    name: "BronchoCare-X",
    dosage: "Guaifenesin 200mg + Menthol",
    category: "Pulmo care",
    badge: "",
    description: "Helps clear mucus."
  },
  {
    _id: "31",
    name: "Neurovit-SR",
    dosage: "Methylcobalamin + Alpha Lipoic Acid SR",
    category: "Neuro care",
    badge: "",
    description: "Nerve health support."
  },
  {
    _id: "32",
    name: "Pregaron Plus",
    dosage: "Pregabalin 75mg + Methylcobalamin 750mcg",
    category: "Neuro care",
    badge: "",
    description: "For neuropathic pain."
  },
  {
    _id: "33",
    name: "Clovir-Duo",
    dosage: "Domperidone 10mg + Antacid",
    category: "Gastro care",
    badge: "",
    description: "Relieves dyspepsia."
  },
  {
    _id: "34",
    name: "Panon-40",
    dosage: "Pantoprazole 40mg",
    category: "Gastro care",
    badge: "",
    description: "PPI for ulcer & acidity."
  },
  {
    _id: "35",
    name: "Rabiron-D",
    dosage: "Rabeprazole EC 20mg + Domperidone SR 30mg",
    category: "Gastro care",
    badge: "Best Seller",
    description: "For reflux & motility."
  },
  {
    _id: "36",
    name: "DIRON-M",
    dosage: "Metformin + Pioglitazone",
    category: "Diabetic care",
    badge: "",
    description: "Improves insulin sensitivity."
  },
  {
    _id: "37",
    name: "AlphaBetic Plus",
    dosage: "Mecobalamin, Benfotiamine, Alpha Lipoic Acid, Chromium Picolinate",
    category: "Diabetic care",
    badge: "",
    description: "Support for diabetic neuropathy."
  },
  {
    _id: "38",
    name: "Aceviron-P",
    dosage: "Aceclofenac 100mg + Paracetamol 325mg",
    category: "Care Well",
    badge: "",
    description: "Pain relief combo."
  },
  {
    _id: "39",
    name: "Aceviron-SP",
    dosage: "Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg",
    category: "Care Well",
    badge: "",
    description: "Anti-inflammatory and analgesic."
  },
  {
    _id: "40",
    name: "Calciviron-Z",
    dosage: "Calcium + Vitamin D + Zinc + Vitamin K",
    category: "Care Well",
    badge: "",
    description: "Bone support formula."
  },
  {
    _id: "41",
    name: "Lipiviron",
    dosage: "Atorvastatin 10/20/40mg",
    category: "Care Well",
    badge: "New",
    description: "Lowers cholesterol."
  },
  {
    _id: "42",
    name: "Rabiron-C",
    dosage: "Ramipril 2.5/5/10mg + Chlorthalidone 6.25mg",
    category: "Limatcardio",
    badge: "",
    description: "HTN combination therapy."
  },
  {
    _id: "43",
    name: "Cardizine MR",
    dosage: "Trimetazidine MR 35mg",
    category: "Limatcardio",
    badge: "",
    description: "Improves heart function."
  },
  {
    _id: "44",
    name: "Cliniron",
    dosage: "Cilnidipine 5/10mg",
    category: "Limatcardio",
    badge: "",
    description: "Treats high blood pressure."
  },
  {
    _id: "45",
    name: "Bisoron",
    dosage: "Bisoprolol Fumarate 2.5/5mg",
    category: "Limatcardio",
    badge: "Doctor Recommended",
    description: "Heart-related conditions."
  },
  {
    _id: "46",
    name: "Amloron",
    dosage: "Amlodipine 2.5/5mg",
    category: "Limatcardio",
    badge: "Best Seller",
    description: "For hypertension and angina."
  },
  {
    _id: "47",
    name: "MULTIVIRON-M",
    dosage: "Multivitamins + Multiminerals",
    category: "Gyneron",
    badge: "",
    description: "Daily health support."
  },
  {
    _id: "48",
    name: "MULTIVIRON-F",
    dosage: "Ferrous Ascorbate + Folic Acid + Zinc",
    category: "Gyneron",
    badge: "Doctor Recommended",
    description: "Iron + folic acid supplement."
  },
  {
    _id: "49",
    name: "Mefirgil-T 500",
    dosage: "Tranexamic Acid 250mg + Mefenamic Acid 500mg",
    category: "Gyneron",
    badge: "",
    description: "For heavy menstrual bleeding."
  },
    {
    _id: "50",
    name: "CalDiron Softgel",
    dosage: "Calcium Carbonate + Calcitriol + Zn + Mg",
    category: "Gyneron",
    badge: "Best Seller",
    description: "Enhanced mineral supplement."
  },
  {
    _id: "51",
    name: "Calciron",
    dosage: "Calcium Carbonate 500mg + Vitamin D3 250 IU",
    category: "Gyneron",
    badge: "",
    description: "Prevents calcium deficiency."
  },
  {
    _id: "52",
    name: "Calciron CCM",
    dosage: "Calcium Citrate Malate 500mg + Vit‑D3 250 IU + Zn + Mg",
    category: "Gyneron",
    badge: "",
    description: "Supports bone health."
  },
  {
    _id: "53",
    name: "Nvpan-Don",
    dosage: "Pantoprazole + Domperidone",
    category: "Gastro care",
    badge: "",
    description: "Relieves acidity and nausea."
  },
  {
    _id: "54",
    name: "Sitagliptin-Dapa",
    dosage: "Sitagliptin 100mg + Dapagliflozin 10mg",
    category: "Diabetic care",
    badge: "",
    description: "DPP4 & SGLT2 inhibitor combo."
  },
  {
    _id: "55",
    name: "Metviron G2-750",
    dosage: "Metformin Prolonged Release 750mg + Glimepiride 2mg",
    category: "Diabetic care",
    badge: "",
    description: "Extended control for diabetes."
  },
  {
    _id: "56",
    name: "Linaxtra-M",
    dosage: "Linagliptin 2.5mg + Metformin 500mg",
    category: "Diabetic care",
    badge: "",
    description: "DPP4 inhibitor + metformin."
  },
  {
    _id: "57",
    name: "Tissue-Rx Sachet",
    dosage: "Calcium, copper, manganese, glucosamine, phosphorus, Vitamin A, C, etc.",
    category: "Care Well",
    badge: "",
    description: "Bone & joint formula."
  },
  {
    _id: "58",
    name: "Nevron D3",
    dosage: "Vitamin D3 60,000 IU",
    category: "Care Well",
    badge: "",
    description: "Weekly Vitamin D support."
  },
  {
    _id: "59",
    name: "D3 Softgel",
    dosage: "Cholecalciferol 60,000 IU",
    category: "Care Well",
    badge: "",
    description: "Bone health and immunity."
  },
  {
    _id: "60",
    name: "Cefixime-O",
    dosage: "Cefixime 200mg + Ofloxacin 200mg",
    category: "Care Well",
    badge: "",
    description: "Broad-spectrum antibiotic."
  },
  {
    _id: "61",
    name: "Cefixime-DT",
    dosage: "Cefixime Dispersible Tablets 200mg",
    category: "Care Well",
    badge: "",
    description: "Antibiotic for infections."
  },
  {
    _id: "62",
    name: "Fexoron",
    dosage: "Fexofenadine 120mg",
    category: "Pulmo care",
    badge: "",
    description: "Relieves seasonal allergies."
  },
  {
    _id: "63",
    name: "Montelukast",
    dosage: "Montelukast 10mg",
    category: "Pulmo care",
    badge: "",
    description: "Asthma & allergy relief."
  },
  {
    _id: "64",
    name: "Loratiron",
    dosage: "Loratadine 10mg",
    category: "Pulmo care",
    badge: "",
    description: "Allergic rhinitis treatment."
  },
  {
    _id: "65",
    name: "Zincovitron",
    dosage: "Zinc + Multivitamins",
    category: "Care Well",
    badge: "",
    description: "Daily immunity booster."
  },
  {
    _id: "66",
    name: "Nevronzyme",
    dosage: "Digestive enzymes + B-Complex",
    category: "Gastro care",
    badge: "",
    description: "Supports digestion."
  },
  {
    _id: "67",
    name: "Nevronzyme Syrup",
    dosage: "Digestive enzymes syrup",
    category: "Gastro care",
    badge: "",
    description: "Improves gut health."
  },
  {
    _id: "68",
    name: "Calciviron-K2",
    dosage: "Calcium + Vit D3 + Vit K2-7",
    category: "Care Well",
    badge: "",
    description: "Calcium absorption formula."
  },
  {
    _id: "69",
    name: "Zincovitron Drops",
    dosage: "Zinc + Vitamins (Pediatric Drops)",
    category: "Care Well",
    badge: "",
    description: "Kids' immunity and growth."
  },
  {
    _id: "70",
    name: "D3 Nano Shot",
    dosage: "Cholecalciferol Nano 60,000 IU",
    category: "Care Well",
    badge: "",
    description: "Nano Vitamin D3 solution."
  },
  {
    _id: "71",
    name: "Nevronzyme Plus",
    dosage: "Digestive enzymes + probiotics",
    category: "Gastro care",
    badge: "",
    description: "Gut flora and enzyme support."
  },
  {
    _id: "72",
    name: "Multivitron Junior",
    dosage: "Multivitamins syrup for kids",
    category: "Care Well",
    badge: "",
    description: "Growth and development."
  },
  {
    _id: "73",
    name: "Liveron-Forte",
    dosage: "Liver tonic with silymarin",
    category: "Care Well",
    badge: "",
    description: "Liver detox support."
  },
  {
    _id: "74",
    name: "Liveron Syrup",
    dosage: "Liver tonic syrup",
    category: "Care Well",
    badge: "",
    description: "Liver health maintenance."
  },
  {
    _id: "75",
    name: "Ferrovitron",
    dosage: "Iron + Folic Acid + Zinc Syrup",
    category: "Care Well",
    badge: "",
    description: "Iron supplement syrup."
  }
];

const CatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
