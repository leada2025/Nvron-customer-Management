import React, { useState } from "react";
import axios from "../api/Axios";

const RequestServicePage = () => {
  const [requestText, setRequestText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    try {
      setLoading(true);
      await axios.post(
        "/api/requests",
        {
          title: "New Request", // Optional: make it customizable
          description: requestText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Your request has been forwarded to the sales team!");
      setRequestText("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Request New Service or Product</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-4 border rounded-xl mb-4"
          placeholder="Describe the product or service you are looking for..."
          rows={6}
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestServicePage;
