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
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Support Form</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-white p-6 rounded-xl shadow border"
      >
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Order No (If relevant)
          </label>
          <input
            type="text"
            name="orderNo"
            value={form.orderNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Attach File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-700 text-white px-6 py-2 rounded-md hover:bg-teal-800 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestServicePage;
