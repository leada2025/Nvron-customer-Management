import React, { useState, useEffect } from "react";
import axios from "../api/Axios";

export default function ProductForm({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    packing: "",
    dosageForm: "",
    description: "",
    tax: 12,
    mrp: "",
    netRate: "",
    ptr: "",
    pts: "",
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
        ptr: initialData.ptr || "",
        pts: initialData.pts || "",
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
        ptr: "",
        pts: "",
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
    if (loading) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    const token = localStorage.getItem("token");

    const cleanedForm = {
      ...form,
      tax: Number(form.tax),
      mrp: parseFloat(form.mrp),
      netRate: parseFloat(form.netRate),
      ptr: parseFloat(form.ptr),
      pts: parseFloat(form.pts),
    };

    if (initialData?.approved) {
      delete cleanedForm.mrp;
      delete cleanedForm.netRate;
    }

    try {
      if (initialData && initialData._id) {
        await axios.put(`/api/products/${initialData._id}`, cleanedForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSuccessMsg("Product updated successfully!");
      } else {
        await axios.post("/api/products", cleanedForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
          ptr: "",
          pts: "",
        });
      }

      onSubmit && onSubmit();
    } catch (err) {
      console.error("API error:", err);
      setError(err.response?.data?.message || "Failed to save product. Please try again.");
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 border border-[#0b7b7b]/20">
        <h3 className="text-xl font-bold text-[#0b7b7b] mb-4">
          {initialData ? "Edit Product" : "Add Product"}
        </h3>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md">{error}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded-md">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name", label: "Product Name", type: "text", placeholder: "Enter product name" },
            { name: "packing", label: "Packing", type: "text", placeholder: "Packing details" },
            { name: "dosageForm", label: "Dosage Form", type: "text", placeholder: "e.g. TABLET, CAPSULE" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block font-medium mb-1">{label}</label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                required
                placeholder={placeholder}
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]/30"
              />
            </div>
          ))}

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Description"
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]/30"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Tax</label>
            <select
              name="tax"
              value={form.tax}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]/30"
              disabled={loading}
            >
              {[5, 12, 18, 28].map((rate) => (
                <option key={rate} value={rate}>{rate}%</option>
              ))}
            </select>
          </div>

          {[
            { name: "mrp", label: "MRP" },
            { name: "netRate", label: "Net Rate" },
            { name: "ptr", label: "PTR" },
            { name: "pts", label: "PTS" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block font-medium mb-1">{label}</label>
              <input
                name={name}
                type="number"
                value={form[name]}
                onChange={handleChange}
                min="0"
                step="0.01"
                required={name === "mrp" || name === "netRate"}
                placeholder="₹"
                disabled={loading || (initialData?.approved && (name === "mrp" || name === "netRate"))}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]/30 ${
                  initialData?.approved && (name === "mrp" || name === "netRate")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#0b7b7b] text-white hover:bg-[#095d5d]"
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
