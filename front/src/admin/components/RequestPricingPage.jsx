import React, { useState, useEffect } from "react";
import axios from "../api/Axios";

const RequestPricingPage = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [requestedRate, setRequestedRate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInitialData = async () => {
    try {
      const [customersRes, productsRes, requestRes] = await Promise.all([
        axios.get("/api/customers"),
        axios.get("/api/products"),
        axios.get("/api/negotiations"),
      ]);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
      setRequests(requestRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedProduct || !requestedRate) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/negotiations", {
        customerId: selectedCustomer,
        productId: selectedProduct,
        requestedRate: Number(requestedRate),
      });

      setRequestedRate("");
      fetchInitialData(); // Refresh list
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Rate Approvals</h1>

      <div className="bg-white p-4 shadow rounded mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="p-2 border rounded"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Customer Name</option>
          {customers.map((cust) => (
            <option key={cust._id} value={cust._id}>
              {cust.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map((prod) => (
            <option key={prod._id} value={prod._id}>
              {prod.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter Rate"
          className="p-2 border rounded"
          value={requestedRate}
          onChange={(e) => setRequestedRate(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <button
          className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">MRP</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Requested Rate</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-t">
                <td className="p-2 border">{req.customer?.name || "-"}</td>
                <td className="p-2 border">{req.product?.name || "-"}</td>
                <td className="p-2 border">{req.product?.mrp || "-"}</td>
                <td className="p-2 border">{req.product?.ptr || "-"}</td>
                <td className="p-2 border">{req.requestedRate}</td>
                <td className="p-2 border">
                  {req.status === "approved" && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                      Approved
                    </span>
                  )}
                  {req.status === "rejected" && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                      Rejected
                    </span>
                  )}
                  {!req.status && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestPricingPage;
