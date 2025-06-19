import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import PricingRequestModal from "../components/PricingRequestModal";
import { jwtDecode } from "jwt-decode";

export default function RequestPricingPage() {
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [userRole, setUserRole] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);

      const [reqRes, productRes, customerRes] = await Promise.all([
        axios.get("/api/negotiations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/admin/users?onlyRole=Customer", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const visibleRequests =
        decoded.role === "sales" && decoded.id
          ? reqRes.data.filter((r) => r.createdBy === decoded.id)
          : reqRes.data;

      setRequests(visibleRequests);
      setProducts(productRes.data);
      setCustomers(customerRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data) => {
    try {
      const payload = {
        productId: data.productId,
        proposedPrice: data.proposedPrice,
        customerId: data.customerId,
      };

      if (editingRequest) {
        await axios.put(`/api/negotiations/${editingRequest._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/negotiations", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setModalOpen(false);
      setEditingRequest(null);
      fetchData();
    } catch (err) {
      console.error("Error saving negotiation:", err);
    }
  };

  const getProductName = (product) => {
    if (product && typeof product === "object") return product.name;
    const found = products.find((p) => p._id === product);
    return found ? found.name : "N/A";
  };

  const getCustomerName = (customer) => {
    if (customer && typeof customer === "object") return customer.name;
    const found = customers.find((c) => c._id === customer);
    return found ? found.name : "N/A";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "In Process";
      default:
        return status;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 bg-[#e1f4f6] p-4 rounded flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0b7b7b]">Pricing Requests</h2>
          <p className="text-sm text-gray-500">
            View request status for customer pricing
          </p>
        </div>
        {(userRole === "admin" || userRole === "sales") && (
          <button
            onClick={() => {
              setEditingRequest(null);
              setModalOpen(true);
            }}
            className="bg-[#0b7b7b] text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-[#095e5e] transition"
          >
            + New Request
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-[#e6f7f7] border border-[#0b7b7b]/20 rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left text-[#0b7b7b]">
          <thead className="bg-[#c2efef] text-[#0b7b7b] font-semibold uppercase">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bde8e8]">
            {requests.map((r) => (
              <tr
                key={r._id}
                className="hover:bg-[#d7f3f3] transition cursor-pointer"
                onClick={() => setViewingRequest(r)}
              >
                <td className="px-4 py-2">{getCustomerName(r.customerId)}</td>
                <td className="px-4 py-2">{getProductName(r.productId)}</td>
                <td className="px-4 py-2">
                  <div
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize shadow-sm ${getStatusStyle(
                      r.status
                    )}`}
                  >
                    {getStatusLabel(r.status)}
                  </div>
                </td>
                <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                  {(userRole === "sales" || userRole === "admin") && (
                    <button
                      onClick={() => {
                        setEditingRequest(r);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 text-sm bg-white border border-[#0b7b7b] text-[#0b7b7b] rounded hover:bg-[#c2efef] transition"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
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
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          customers={customers}
          products={products}
        />
      )}

      {/* 🔍 View-only Details Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-[#0b7b7b]">Negotiation Details</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Customer:</strong> {getCustomerName(viewingRequest.customerId)}</li>
              <li><strong>Product:</strong> {getProductName(viewingRequest.productId)}</li>
              <li><strong>Status:</strong> {getStatusLabel(viewingRequest.status)}</li>
              <li><strong>Proposed Price:</strong> ₹{viewingRequest.proposedPrice}</li>
              {viewingRequest.approvedPrice && (
                <li><strong>Approved Price:</strong> ₹{viewingRequest.approvedPrice}</li>
              )}
              {viewingRequest.adminMessage && (
                <li><strong>Admin Message:</strong> {viewingRequest.adminMessage}</li>
              )}
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setViewingRequest(null)}
                className="px-4 py-2 bg-[#0b7b7b] text-white rounded hover:bg-[#095e5e]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
