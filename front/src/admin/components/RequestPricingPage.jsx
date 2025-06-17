import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { FaEllipsisV } from "react-icons/fa";
import PricingRequestModal from "../components/PricingRequestModal";

const RequestPricingPage = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [negotiationRes, customerRes, productRes] = await Promise.all([
        axios.get("/api/negotiations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/admin/users?onlyRole=Customer", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRequests(negotiationRes.data);
      setCustomers(customerRes.data);
      setProducts(productRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load data.");
    }
  };

  const handleSaveRequest = async (formData) => {
    try {
      if (editingRequest) {
        await axios.put(`/api/negotiations/${editingRequest._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/negotiations", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setModalOpen(false);
      setEditingRequest(null);
      fetchInitialData();
    } catch (err) {
      console.error("Error saving request:", err);
      alert("Failed to save request");
    }
  };

  const getCustomerName = (id) =>
    customers.find((c) => String(c._id) === String(id))?.name || "N/A";

  const getProductName = (id) =>
    products.find((p) => String(p._id) === String(id))?.name || "N/A";

  const filteredRequests = requests.filter((r) =>
    getCustomerName(r.customerId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#f5faff] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0b7b7b]">Pricing Requests</h2>
        <button
          onClick={() => {
            setEditingRequest(null);
            setModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
        >
          + New Request
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-300 shadow-sm">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#0b7b7b]/30 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
          />
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#f0fdfa] text-[#0b7b7b]">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Proposed Price</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r) => (
              <tr
                key={r._id}
                className="border-t border-[#0b7b7b]/10 hover:bg-[#f8ffff] cursor-pointer"
                onClick={() => {
                  setEditingRequest({
                    ...r,
                    productId: r.productId,
                    customerId: r.customerId,
                  });
                  setModalOpen(true);
                }}
              >
                <td className="p-3 text-[#0b7b7b] font-medium">
                  {getCustomerName(r.customerId)}
                </td>
                <td className="p-3">{getProductName(r.productId)}</td>
                <td className="p-3">₹{r.proposedPrice}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      r.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : r.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <FaEllipsisV className="inline text-[#0b7b7b]/60" />
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No pricing requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <PricingRequestModal
          request={editingRequest}
          onClose={() => {
            setModalOpen(false);
            setEditingRequest(null);
            fetchInitialData();
          }}
          onSave={handleSaveRequest}
        />
      )}
    </div>
  );
};

export default RequestPricingPage;
