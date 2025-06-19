import React, { useState } from "react";
import axios from "../api/Axios";

const RequestServicePage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderNo: "",
    description: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.description) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("orderNo", form.orderNo);
      formData.append("description", form.description);
      if (form.file) {
        formData.append("file", form.file);
      }

      await axios.post("/api/requests", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Support request submitted successfully.");
      setForm({
        name: "",
        email: "",
        orderNo: "",
        description: "",
        file: null,
      });
    } catch (error) {
      console.error("Request failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f7f7] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white border border-gray-200 shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-[#0b7b7b]">Support Request</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0b7b7b] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0b7b7b] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order No (Optional)
          </label>
          <input
            type="text"
            name="orderNo"
            value={form.orderNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0b7b7b] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0b7b7b] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach File (Optional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#e6f7f7] file:text-[#0b7b7b] hover:file:bg-[#d0efef]"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0b7b7b] hover:bg-[#095e5e]"
            }`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestServicePage;
