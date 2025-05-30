import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    packing: "",
    dosageForm: "",
    description: "",
    tax: 12,
    mrp: "",
    netRate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        packing: initialData.packing || "",
        dosageForm: initialData.dosageForm || "",
        description: initialData.description || "",
        tax: initialData.tax || 12,
        mrp: initialData.mrp || "",
        netRate: initialData.netRate || "",
      });
    } else {
      setForm({
        name: "",
        packing: "",
        dosageForm: "",
        description: "",
        tax: 12,
        mrp: "",
        netRate: "",
      });
    }
    setError("");
    setSuccessMsg("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccessMsg("");

  const token = localStorage.getItem("token");

  // Convert string inputs to numbers explicitly
  const cleanedForm = {
    ...form,
    tax: Number(form.tax),
    mrp: parseFloat(form.mrp),
    netRate: parseFloat(form.netRate),
  };
  if (initialData?.approved) {
  delete cleanedForm.mrp;
  delete cleanedForm.netRate;
}

 try {
  if (initialData && initialData._id) {
    await axios.put(
      `http://localhost:5000/api/products/${initialData._id}`,
      cleanedForm,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    );
    setSuccessMsg("Product updated successfully!");
  } else {
    await axios.post("http://localhost:5000/api/products", cleanedForm, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    setSuccessMsg("Product added successfully!");
    setForm({
      name: "",
      packing: "",
      dosageForm: "",
      description: "",
      tax: 12,
      mrp: "",
      netRate: "",
    });
  }

  if (onSubmit) {
    onSubmit(cleanedForm); // ✅ Notify parent of the updated/created product
  }

  setLoading(false);

} catch (err) {
  console.error("API error:", err);
  setError(
    err.response?.data?.message || "Failed to save product. Please try again."
  );
  setSuccessMsg("");
  setLoading(false);
}
}




  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Product" : "Add Product"}
        </h3>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="">
          {/* Form fields here (same as your original) */}
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter product name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Packing</label>
            <input
              name="packing"
              value={form.packing}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Packing details"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Dosage Form</label>
            <input
              name="dosageForm"
              value={form.dosageForm}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="e.g. TABLET, CAPSULE"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Description"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Tax</label>
            <select
              name="tax"
              value={form.tax}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            >
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>

         <div>
  <label className="block font-medium mb-1">MRP</label>
  <input
    name="mrp"
    type="number"
    value={form.mrp}
    onChange={handleChange}
    required
    min="0"
    step="0.01"
    className={`w-full border border-gray-300 rounded px-3 py-2 ${
      initialData?.approved ? "bg-gray-100 cursor-not-allowed" : ""
    }`}
    placeholder="₹"
    disabled={loading || initialData?.approved}
  />
</div>

<div>
  <label className="block font-medium mb-1">Net Rate</label>
  <input
    name="netRate"
    type="number"
    value={form.netRate}
    onChange={handleChange}
    required
    min="0"
    step="0.01"
    className={`w-full border border-gray-300 rounded px-3 py-2 ${
      initialData?.approved ? "bg-gray-100 cursor-not-allowed" : ""
    }`}
    placeholder="₹"
    disabled={loading || initialData?.approved}
  />
</div>


          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading
                ? initialData
                  ? "Saving..."
                  : "Adding..."
                : initialData
                ? "Save Changes"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
