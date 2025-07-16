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
    name: "Pregaron",
    dosage: "Gabapentin USP 300 mg",
    category: "Neuro care",
    badge: "",
    image: "/assets/catalog/pregaron.png",
    description: "For neuropathic pain management."
  },
  {
    _id: "2",
    name: "BAGARON NT",
    dosage: "Gabapentin 400 mg + Nortriptyline 10 mg",
    category: "Neuro care",
    badge: "",
    image: "/assets/catalog/Bagaron NT.jpg",
    description: "Combination therapy for neuropathic pain."
  },
  {
    _id: "3",
    name: "Betagril",
    dosage: "Betahistine 16 mg",
    category: "Neuro care",
    badge: "",
    image: "/assets/catalog/BETAGRIL.jpg",
    description: "For vertigo and balance disorders."
  },
  {
    _id: "4",
    name: "Citalron Plus",
    dosage: "Escitalopram Oxalate 10 mg + Clonazepam 0.5 mg",
    category: "Neuro care",
    badge: "",
    image: "/assets/catalog/Citalron Plus.jpg",
    description: "Antidepressant and anxiolytic combination."
  },
  {
    _id: "5",
    name: "FIBERNERV",
    dosage: "Methylcobalamin 1500 mcg + Alpha Lipoic Acid 100 mg + Folic Acid 1.5 mg & Vitamin B6",
    category: "Neuro care",
    badge: "",
    image: "/assets/catalog/Fibernerv.webp",
    description: "Complete nerve support formula."
  },
  {
    _id: "6",
    name: "MAQ PLUS",
    dosage: "Chromium Picolinate, Benfotiamine, Alpha Lipoic Acid, Inositol and Mecobalamin Soft Gelatin Capsules",
    category: "Neuro care",
    badge: "",
    image: "/assets/catalog/maqplus-3.jpg",
    description: "Advanced neuro supplement."
  },
  {
    _id: "7",
    name: "Pregaron Plus",
    dosage: "Pregabalin 75 mg + Methylcobalamine 750 mcg",
    category: "Neuro care",
    badge: "",
    image: "/assets/catalog/Pregaron Plus 3D Box.jpg",
    description: "For neuropathic pain and nerve regeneration."
  },
  {
    _id: "8",
    name: "Pregaron NT",
    dosage: "Pregabalin 75 mg + Nortriptyline 10 mg",
    category: "Neuro care",
    badge: "",
    image: "/assets/catalog/pregaron-nt75.png",
    description: "Relief from nerve pain and depression."
  },

  {
  _id: "76",
  name: "AIRSING",
  dosage: "Fexofenadine Hydrochloride 120 mg",
  category: "Pulmo care",
  badge: "",
  image: "/assets/catalog/AIRSING.webp",
  description: "Relieves seasonal allergy symptoms."
},
{
  _id: "77",
  name: "Agcort-6",
  dosage: "Deflazacort Tablets 6 mg",
  category: "Pulmo care",
  badge: "",
  image: "/assets/catalog/Agcort.avif",
  description: "Anti-inflammatory corticosteroid for respiratory conditions."
},
{
  _id: "78",
  name: "Montiron LC",
  dosage: "Montelukast 10 mg + Levocetirizine Hydrochloride 5 mg",
  category: "Pulmo care",
  badge: "",
  image: "/assets/catalog/Montiron LC.jpg",
  description: "Combination therapy for allergic rhinitis and asthma."
},
{
  _id: "79",
  name: "Montiron-FX",
  dosage: "Montelukast Sodium 10 mg + Fexofenadine Hydrochloride 120 mg",
  category: "Pulmo care",
  badge: "",
  image: "/assets/catalog/montiron-fx.png",
  description: "Dual-action allergy and asthma relief."
}
,

{
  _id: "80",
  name: "Calciron CCM",
  dosage: "Calcium Citrate Malate 1000 mg, Magnesium Hydroxide 100 mg, Vitamin D3, Zinc Sulphate Monohydrate 4 mg",
  category: "Gyneron",
  badge: "",
  image: "/assets/catalog/Calciron CCM 3D Box.jpg",
  description: "Helps in maintaining strong bones and supports calcium absorption."
},
{
  _id: "81",
  name: "Calciron",
  dosage: "Calcium Carbonate 500 mg with Vitamin D3 250 IU",
  category: "Gyneron",
  badge: "",
  image: "/assets/catalog/Calciron.jpg",
  description: "Daily calcium and vitamin D3 supplement for bone health."
},
{
  _id: "82",
  name: "CalDiron",
  dosage: "Calcitriol 0.25 mcg, Calcium Carbonate 500 mg, Zinc Sulphate Monohydrate 7.5 mg",
  category: "Gyneron",
  badge: "",
  image: "/assets/catalog/caldiron.avif",
  description: "Supports bone density and mineral absorption."
},
{
  _id: "83",
  name: "Mefigril T 500",
  dosage: "Tranexamic Acid 250 mg + Mefenamic Acid 500 mg",
  category: "Gyneron",
  badge: "",
  image: "/assets/catalog/Mefigril T.jpeg",
  description: "Effective treatment for heavy menstrual bleeding and pain relief."
},
{
  _id: "84",
  name: "MULTIVICON Plus",
  dosage: "Ferrosulfonate 100 mg, Folic Acid 1.5 mg, Zinc 22.5 mg, Vitamin B1 2.5 mcg",
  category: "Gyneron",
  badge: "",
  image: "/assets/catalog/Multyviron Plus.jpg",
  description: "Iron and vitamin supplement to support women's health."
}
,{
  _id: "85",
  name: "Aceviron-P",
  dosage: "Aceclofenac 100 mg + Paracetamol 325 mg",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/Aceviron P  3D Box.jpg",
  description: "Pain relief for musculoskeletal conditions."
},
{
  _id: "86",
  name: "Aceviron-SP",
  dosage: "Aceclofenac 100 mg + Paracetamol 325 mg + Serratiopeptidase 15 mg",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/Aceviron SP.jpeg",
  description: "Anti-inflammatory and pain relief combination."
},
{
  _id: "87",
  name: "BROXIRON",
  dosage: "Ambroxol HCL 15 mg + Guaiphenesin 50 mg + Terbutaline 1.25 mg",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/Broxiron 3D Box.jpg",
  description: "Cough syrup to relieve chest congestion."
},

{
  _id: "89",
  name: "DICLOVIRON",
  dosage: "Diclofenac 1.16% W/W (30 g Pain Relieving Gel)",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/dicloviron.jpg",
  description: "Topical gel for relief from joint and muscle pain."
},
{
  _id: "90",
  name: "Multyviron Syrup",
  dosage: "Multivitamin, Minerals, Antioxidants, Amino Acids, Trace Elements with Lysine",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/multyvironsyrup.jpeg",
  description: "Comprehensive syrup for daily nutrition."
},
{
  _id: "91",
  name: "MULTIVIRON",
  dosage: "Multivitamin, Mecobalamin, Betacarotene, Antioxidants, Minerals",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/Multyviron_Tab_3D_Box.webp",
  description: "Daily multivitamin for immunity and energy."
},
{
  _id: "92",
  name: "MOXIRON CV25",
  dosage: "Amoxicillin 500 mg / Clavulanic acid 125 mg",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/Moxiron CV.jpg",
  description: "Broad-spectrum antibiotic."
},
{
  _id: "93",
  name: "MULTIVIRON PRO HP",
  dosage: "100% Whey Protein Concentrate",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/multyviron.webp",
  description: "High-performance protein for strength and recovery."
},
{
  _id: "94",
  name: "Nepricef",
  dosage: "Cefoperazone & Sulbactam for Injection",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/nepricef.webp",
  description: "For bacterial infections requiring injection therapy."
},
{
  _id: "95",
  name: "N-SETRON",
  dosage: "Ondansetron 4 mg",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/N Setron.jpg",
  description: "Prevents nausea and vomiting."
},
{
  _id: "96",
  name: "N-Cypherol D3",
  dosage: "Cholecalciferol 60,000 IU Granules Sachet",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/N-Ciferol.jpg",
  description: "Vitamin D3 granules for bone and immune health."
},
{
  _id: "97",
  name: "Tissue-Rx",
  dosage: "Bromelain, Calcium, Copper, Manganese, Zinc, Glucosamine, Niacinamide, Phosphorus, Vitamin A & C",
  category: "Care Well",
  badge: "",
  image: "/assets/catalog/Tissue.webp",
  description: "Supports tissue repair and joint health."
},
{
  _id: "98",
  name: "GLYEXER 1",
  dosage: "Glimepiride 1 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Glyexer.jpg",
  description: "Sulfonylurea for effective blood sugar control."
},
{
  _id: "99",
  name: "GLYEXER 2",
  dosage: "Glimepiride 2 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Glyexer2.jpg",
  description: "Second-generation sulfonylurea for type 2 diabetes."
},
{
  _id: "100",
  name: "MAQ-P2",
  dosage: "Metformin 500 mg + Glimepiride 2 mg + Pioglitazone 15 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/MAQ-P2.webp",
  description: "Triple-action glucose-lowering combination."
},
{
  _id: "101",
  name: "Metviron G2-750",
  dosage: "Metformin Hydrochloride PR 750 mg + Glimepiride 2 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/metviron-g2-750.png",
  description: "Extended-release metformin combo for glycemic control."
},
{
  _id: "102",
  name: "Mirdermcol Gel",
  dosage: "Gentamycin in Collagen Gel 0.1% w/w",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/midermcol.avif",
  description: "Wound healing gel for diabetic foot ulcers."
},
{
  _id: "103",
  name: "TeneDot",
  dosage: "Teneligliptin 20 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Tenedot.jpg",
  description: "DPP-4 inhibitor for improved glucose control."
},
{
  _id: "104",
  name: "Linaxtra-M",
  dosage: "Linagliptin 2.5 mg + Metformin 500 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/linaxtra.webp",
  description: "Combination therapy for type 2 diabetes."
},
{
  _id: "105",
  name: "Metviron",
  dosage: "Metformin Hydrochloride IP 500 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Metviron.webp",
  description: "First-line treatment for type 2 diabetes."
},
{
  _id: "106",
  name: "Metviron GP 1",
  dosage: "Metformin 500 mg + Glimepiride 1 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/metivrongp1.jpg",
  description: "Combination oral therapy for diabetes."
},
{
  _id: "107",
  name: "Metviron GP 2",
  dosage: "Metformin 500 mg + Glimepiride 2 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Metviron_GP_2.webp",
  description: "Improved glycemic control with dual therapy."
},
{
  _id: "108",
  name: "Sitaviron D 10",
  dosage: "Sitagliptin Phosphate 100 mg + Dapagliflozin 10 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Sitaviron.jpg",
  description: "Dual inhibitor combo for advanced glucose control."
},
{
  _id: "109",
  name: "VOGLIRON 0.2",
  dosage: "Voglibose 0.2 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Vogliron 0.2.jpg",
  description: "Alpha-glucosidase inhibitor to control postprandial glucose."
},
{
  _id: "110",
  name: "VOGLIRON 0.3",
  dosage: "Voglibose 0.3 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Vogliron 0.3.jpeg",
  description: "Controls blood sugar spikes after meals."
},
{
  _id: "111",
  name: "VOGLIRON M",
  dosage: "Voglibose + Metformin (varied strengths)",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/voglivron-m.png",
  description: "Post-meal glucose control with metformin support."
},
{
  _id: "112",
  name: "MAQ-P1",
  dosage: "Metformin 500 mg + Glimepiride 1 mg + Pioglitazone 15 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/MAQP13D.webp",
  description: "Comprehensive diabetic treatment combo."
},
{
  _id: "113",
  name: "Metviron GZ",
  dosage: "Metformin Hydrochloride 500 mg + Gliclazide 80 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Metviron GZ.jpeg",
  description: "For stable blood sugar management."
},
{
  _id: "114",
  name: "Metviron TRIO 1",
  dosage: "Voglibose 0.2 mg + Metformin 500 mg (ER) + Glimepiride 1 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/metvirontrio1.avif",
  description: "Triple fixed dose combination for diabetes."
},
{
  _id: "115",
  name: "Metviron TRIO 2",
  dosage: "Voglibose 0.2 mg + Metformin 500 mg (ER) + Glimepiride 2 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/metvirontrio2.jpg",
  description: "Extended-release triple therapy combo."
},
{
  _id: "116",
  name: "Sitaviron DM 500",
  dosage: "Dapagliflozin 10 mg + Sitagliptin 100 mg + Metformin 500 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Sitaviron_DM_5003D.webp",
  description: "Triple mechanism diabetes control."
},
{
  _id: "117",
  name: "VildaDot M 500",
  dosage: "Vildagliptin 50 mg + Metformin 500 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Vildadot M 500.jpg",
  description: "DPP-4 inhibitor combo therapy."
},
{
  _id: "118",
  name: "Vogliron M 0.2",
  dosage: "Metformin 500 mg + Voglibose 0.2 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Vogliron M 0.2.jpg",
  description: "Combination to manage both fasting and postprandial glucose."
}
,
{
  _id: "1118",
  name: "Vogliron M 0.3",
  dosage: "Metformin 500 mg + Voglibose 0.3 mg",
  category: "Diabetic care",
  badge: "",
  image: "/assets/catalog/Vogliron M 0.3.jpg",
  description: "Combination to manage both fasting and postprandial glucose."
}
,



{
  _id: "119",
  name: "Amloron",
  dosage: "Amlodipine 2.5/5 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Amloron 2.5mg.jpg",
  description: "Calcium channel blocker for hypertension and angina."
},
{
  _id: "120",
  name: "Cliniron",
  dosage: "Cilnidipine 5mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Cilniron 5mg.jpeg",
  description: "Dual L/N-type calcium channel blocker for BP control."
},
{
  _id: "1000",
  name: "Cliniron",
  dosage: "Cilnidipine 10mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Cilniron 10mg.jpg",
  description: "Dual L/N-type calcium channel blocker for BP control."
},
{
  _id: "121",
  name: "Lipiviron",
  dosage: "Atorvastatin 10mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Lipiviron 10mg.jpg",
  description: "Statin therapy for cholesterol management."
},
{
  _id: "1001",
  name: "Lipiviron",
  dosage: "Atorvastatin 20mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Lipiviron 20mg.jpg",
  description: "Statin therapy for cholesterol management."
},
{
  _id: "1002",
  name: "Lipiviron",
  dosage: "Atorvastatin 40mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Lipiviron 40mg (1).jpg",
  description: "Statin therapy for cholesterol management."
},
{
  _id: "122",
  name: "Nevostril",
  dosage: "Sacubitril 24 mg + Valsartan 26 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Nevostril 50.jpg",
  description: "For heart failure management."
},
{
  _id: "123",
  name: "Ramiron",
  dosage: "Ramipril 2.5 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Ramiron 2.5 mg.jpg",
  description: "ACE inhibitor for hypertension and heart protection."
},
{
  _id: "124",
  name: "Rosuviron Gold",
  dosage: "Aspirin 75 mg + Rosuvastatin 10 mg + Clopidogrel 75 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Rosuviron Gold 10mg.jpeg",
  description: "Triple therapy for cardiovascular protection."
},
{
  _id: "125",
  name: "Telviron-AM 40",
  dosage: "Telmisartan 40 mg + Amlodipine 5 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/TEVLRION AM.jpg",
  description: "Combination therapy for BP control."
},
{
  _id: "126",
  name: "Bisoron",
  dosage: "Bisoprolol Fumarate 2.5/5 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Bisoron 2.5mg.jpeg",
  description: "Beta-blocker for cardiovascular support."
},
{
  _id: "127",
  name: "Clopiron",
  dosage: "Clopidogrel 75 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Clopiron .jpeg",
  description: "Antiplatelet agent to prevent blood clots."
},
{
  _id: "128",
  name: "Mexcroin",
  dosage: "Mexiletine Hydrochloride 150 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Mexcorin.webp",
  description: "Used for ventricular arrhythmias."
},
{
  _id: "129",
  name: "One on AM",
  dosage: "Metoprolol Succinate 25/50 mg + Amlodipine 5 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/One on AM 25mg.jpg",
  description: "Dual-action antihypertensive therapy."
},
{
  _id: "130",
  name: "Rosuviron",
  dosage: "Rosuvastatin 5/10/20/40 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Rosuviron 5mg (1).jpg",
  description: "Statin to reduce cholesterol and prevent strokes."
},
{
  _id: "131",
  name: "Telviron-40",
  dosage: "Telmisartan 40 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Telvirom 40-Current.jpg",
  description: "ARB for high blood pressure control."
},
{
  _id: "132",
  name: "Ticastril",
  dosage: "Ticagrelor Tablets IP 90 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Ticastril.jpg",
  description: "Antiplatelet for acute coronary syndrome."
},
{
  _id: "133",
  name: "Cardizine MR",
  dosage: "Trimetazidine (MR) 35 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Cardizine 3D Box.jpg",
  description: "Improves heart function and energy metabolism."
},
{
  _id: "134",
  name: "FLECROIN-50",
  dosage: "Flecainide Tablets 50 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/FLECRON 50mg_2.jpg",
  description: "Used to treat and prevent arrhythmias."
},
{
  _id: "135",
  name: "FLECROIN-100",
  dosage: "Flecainide Tablets 100 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/FLECRON 100mg_3.jpg",
  description: "For serious irregular heartbeats."
},
{
  _id: "136",
  name: "Metarzane T",
  dosage: "Telmisartan 40 mg + Metoprolol 50 mg ER",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/metarzane.avif",
  description: "BP control via ARB and beta-blocker."
},
{
  _id: "137",
  name: "One on XL 50",
  dosage: "Metoprolol Succinate 25/50 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/NVRONRABI.jpg",
  description: "Beta-blocker for BP and heart rate regulation."
},
{
  _id: "138",
  name: "Rosuviron-T",
  dosage: "Rosuvastatin 10 mg + Telmisartan 40 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Rosuviron T 3D Box.jpg",
  description: "Dual action lipid and BP lowering therapy."
},
{
  _id: "139",
  name: "Telviron-H40",
  dosage: "Telmisartan 40 mg + Hydrochlorothiazide 12 mg",
  category: "Limatcardio",
  badge: "",
  image: "/assets/catalog/Telvirom H 40.jpg",
  description: "ARB + diuretic combo for hypertension."
}
,

{
  _id: "140",
  name: "ESORON-D",
  dosage: "Esomeprazole (EC) 40 mg + Domeperidone (SR) 30 mg",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/Esoron D.jpg",
  description: "Effective for acid reflux and gastric motility disorders."
},
{
  _id: "141",
  name: "GELURON-S",
  dosage: "Dried Aluminum Hydroxide Gel, Magnesium Hydroxide + Simethicone Suspension",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/Geluron 3D Box (1).jpg",
  description: "Antacid suspension to relieve acidity and bloating."
},
{
  _id: "142",
  name: "NVRONRABI",
  dosage: "Rabeprazole 20 mg",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/Nvron Rabi.jpg",
  description: "Proton pump inhibitor for gastric acid reduction."
},
{
  _id: "143",
  name: "NVRONESO-40",
  dosage: "Esomeprazole 40 mg",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/NVRONESO 40.jpg",
  description: "PPI used in the treatment of acid-related disorders."
},
{
  _id: "144",
  name: "NVpanon-D",
  dosage: "Pantoprazole (EC) 40 mg + Domperidone (SR) 30 mg",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/Nvopanon-D.avif",
  description: "Dual-action therapy for GERD and nausea."
},
{
  _id: "145",
  name: "NGEL-O",
  dosage: "Sucralfate 1 gm + Oxetacaine 20 mg",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/NGELO .jpg",
  description: "Mucosal protectant with local anesthetic action."
},
{
  _id: "146",
  name: "Panon-40",
  dosage: "Pantoprazole 40 mg",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/Panon 40 (1).jpg",
  description: "PPI for gastric ulcers and acid suppression."
},
{
  _id: "147",
  name: "Rabeprazole-D",
  dosage: "Rabeprazole Sodium (EC) 20 mg + Domperidone (SR) 30 mg",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/Rabeprazole 20 3D Box.jpg",
  description: "Treats acid reflux and improves gastric emptying."
},
{
  _id: "148",
  name: "Ursoshift-300",
  dosage: "Ursodeoxycholic Acid 300 mg",
  category: "Gastro care",
  badge: "",
  image: "/assets/catalog/Ursoshift .jpeg",
  description: "Used for liver support and bile regulation."
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
  <div className="w-full h-24 flex items-center justify-center mb-4">
    <img
      src={item.image || "/assets/catalog/placeholder.png"}
      alt={item.name}
      className="max-h-24 object-contain"
    />
  </div>
  <div className="text-sm font-bold text-center text-[#0b7b7b] mb-1">{item.name}</div>
  <p className="text-xs text-[#0b7b7b]/70 mb-1 text-center">{item.dosage}</p>
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
