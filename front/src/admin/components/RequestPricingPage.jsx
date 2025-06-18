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
        decoded.role === "sales"
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

 return (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="mb-6 bg-[#e1f4f6] p-4 rounded flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-[#0b7b7b]">Pricing Requests</h2>
        <p className="text-sm text-gray-500">Manage and review proposed prices</p>
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
            <th className="px-4 py-3">Proposed Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#bde8e8]">
          {requests.map((r) => (
            <tr key={r._id} className="hover:bg-[#d7f3f3] transition">
              <td className="px-4 py-2">{getCustomerName(r.customerId)}</td>
              <td className="px-4 py-2">{getProductName(r.productId)}</td>
              <td className="px-4 py-2">₹{r.proposedPrice}</td>
              <td className="px-4 py-2 capitalize">{r.status}</td>
              <td className="px-4 py-2">
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
              <td colSpan={5} className="text-center py-4 text-gray-500">
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
  </div>
);
}