// pages/RequestServicePage.jsx

import React, { useState } from "react";

const RequestServicePage = () => {
  const [requestText, setRequestText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    // For now, just log or alert; in Phase 2 you'd send to backend
    console.log("Service request submitted:", requestText);
    alert("Your request has been forwarded to the sales team!");
    setRequestText("");
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
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestServicePage;
