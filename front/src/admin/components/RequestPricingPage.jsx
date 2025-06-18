// RequestPricingPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { Button } from "@mui/material";
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Pricing Requests</h2>
        {(userRole === "admin" || userRole === "sales") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditingRequest(null);
              setModalOpen(true);
            }}
          >
            + New Request
          </Button>
        )}
      </div>

      <div className="overflow-x-auto bg-white border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Proposed Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700">
            {requests.map((r) => (
              <tr key={r._id}>
                <td className="px-4 py-2">{getCustomerName(r.customerId)}</td>
                <td className="px-4 py-2">{getProductName(r.productId)}</td>
                <td className="px-4 py-2">₹{r.proposedPrice}</td>
                <td className="px-4 py-2 capitalize">{r.status}</td>
                <td className="px-4 py-2">
                  {(userRole === "sales" || userRole === "admin") && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setEditingRequest(r);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
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
