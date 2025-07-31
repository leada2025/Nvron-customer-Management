import React, { useEffect, useState, useRef } from "react";
import axios from "../api/Axios";
import {BASE_URL} from "../api/config"

export default function AdminCatalogueTab() {
  const [catalogue, setCatalogue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    badge: "",
    description: "",
    category: "",
    image: null,
  });

  const fetchCatalogue = async () => {
    try {
      const res = await axios.get("/api/catalogue");
      setCatalogue(res.data);
    } catch (err) {
      console.error("Error fetching catalogue:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/catalogue/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCatalogue();
    fetchCategories();
  }, []);

const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "image" && files && files[0]) {
    setImagePreview(URL.createObjectURL(files[0]));
    setFormData((prev) => ({ ...prev, image: files[0] }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));

    if (editingId) {
      await axios.put(`/api/catalogue/${editingId}`, data);
    } else {
      await axios.post("/api/catalogue", data);
    }

    fetchCatalogue();
    setFormData({ name: "", dosage: "", badge: "", description: "", category: "", image: null });
    setImagePreview(null);
    setEditingId(null);
  } catch (err) {
    console.error("Error submitting catalogue item:", err);
  }
};

const handleEdit = (item) => {
  setEditingId(item._id);
  setFormData({
    name: item.name,
    dosage: item.dosage,
    badge: item.badge || "",
    description: item.description || "",
    category: item.category?._id || "",
    image: null, // This ensures new file can be uploaded optionally
  });

  // 👇 Fix: Prefix image path with BASE_URL for preview
  if (item.image) {
    setImagePreview(`${BASE_URL}${item.image}`);
  } else {
    setImagePreview(null);
  }

  formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const handleCancelEdit = () => {
  setEditingId(null);
  setFormData({
    name: "",
    dosage: "",
    badge: "",
    description: "",
    category: "",
    image: null,
  });
  setImagePreview(null);
};



  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/catalogue/${id}`);
      fetchCatalogue();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#e6f7f7] min-h-screen">
      <h2 className="text-2xl font-bold text-[#0b7b7b]">Add Catalogue Item</h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow"
      >
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          name="dosage"
          placeholder="Dosage"
          value={formData.dosage}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          
        />
        <input
          name="badge"
          placeholder="Badge (optional)"
          value={formData.badge}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded md:col-span-2"
        />
     <input
  type="file"
  name="image"
  onChange={handleChange}
  accept="image/*"
  className="md:col-span-2"
  required
/>

{imagePreview && (
  <img
    src={imagePreview}
    alt="Preview"
    className="rounded border"
    style={{ maxWidth: "100%", height: "auto" }}
  />
)}


<div className="flex gap-4 col-span-1 md:col-span-2">
  <button
    type="submit"
    className="bg-[#0b7b7b] hover:bg-[#095f5f] text-white px-6 py-2 rounded"
  >
    {editingId ? "Update Item" : "Add Item"}
  </button>

  {editingId && (
    <button
      type="button"
      onClick={handleCancelEdit}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded"
    >
      Cancel
    </button>
  )}
</div>


      </form>

      <div className="pt-8">
        <h3 className="text-xl font-semibold mb-4 text-[#0b7b7b]">Catalogue Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogue.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg shadow p-4 space-y-2 bg-white"
            >
              <img
                src={`${BASE_URL}${item.image}`}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />
              <h4 className="text-lg font-bold text-[#0b7b7b]">
                {item.name}
              </h4>
              <p className="text-sm text-gray-600">{item.dosage}</p>
              {item.badge && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                  {item.badge}
                </span>
              )}
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="text-xs text-gray-500 italic">
                Category: {item.category?.name || "N/A"}
              </p>
             <div className="flex justify-between items-center pt-2">
  <button
    onClick={() => handleEdit(item)}
    className="text-blue-600 text-sm hover:underline"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(item._id)}
    className="text-red-600 text-sm hover:underline"
  >
    Delete
  </button>
</div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}