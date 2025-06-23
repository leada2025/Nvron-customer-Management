import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "../components/UserModel";
import { FaPencilAlt } from "react-icons/fa";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchRoles();
    fetchAssignableUsers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/admin/users?onlyRole=Customer", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCustomers(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get("/admin/roles", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const customerRoles = data.filter(
        (role) => role.name.toLowerCase() === "customer"
      );
      setAllRoles(customerRoles);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignableUsers = async () => {
    try {
      const { data } = await axios.get("/admin/users/assignable", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignableUsers(data);
    } catch (err) {
      console.error("Failed to fetch assignable users", err);
    }
  };

  const handleSaveCustomer = async (userData) => {
    try {
      if (editingCustomer) {
        await axios.put(`/admin/users/${editingCustomer._id}`, userData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.post("/admin/users", userData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      await fetchCustomers();
      setModalOpen(false);
      setEditingCustomer(null);
    } catch (err) {
      console.error(err);
      alert("Error saving customer");
    }
  };

  const fetchCustomerOrders = async (customerId) => {
    setLoadingOrders(true);
    setSelectedCustomer(null);
    try {
      const res = await axios.get(`/api/orders?customerId=${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(res.data);
      const customer = customers.find((c) => c._id === customerId);
      setSelectedCustomer(customer);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredCustomers = customers.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const execA = a.assignedTo?.name || a.assignedBy?.name || "";
    const execB = b.assignedTo?.name || b.assignedBy?.name || "";
    return execA.localeCompare(execB);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#e6f7f7] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0b7b7b]">Customers</h2>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setModalOpen(true);
          }}
          className="bg-[#0b7b7b] text-white px-4 py-2 rounded-md"

        >
          + Add Customer
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-300 shadow-sm">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#0b7b7b]/30 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
          />
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#f0fdfa] text-[#0b7b7b]">
            <tr>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Sales Executive</th>
              <th className="p-3">Position</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((u) => (
              <tr
                key={u._id}
                className="border-t border-[#0b7b7b]/10 hover:bg-[#f8ffff] cursor-pointer"
                onClick={() => fetchCustomerOrders(u._id)}
              >
                <td className="p-3 font-medium text-[#0b7b7b]">
                  {u.name}
                  <div className="text-xs text-[#0b7b7b]/60">{u.email}</div>
                </td>
                <td className="p-3">
                  {u.assignedTo ? (
                    <>
                      {u.assignedTo.name}
                      <div className="text-xs text-gray-500">{u.assignedTo.email}</div>
                    </>
                  ) : u.assignedBy ? (
                    <>
                      {u.assignedBy.name}
                      <div className="text-xs text-gray-500">{u.assignedBy.email}</div>
                      <div className="text-[10px] italic text-gray-400">(Assigned By)</div>
                    </>
                  ) : (
                    <span className="text-red-500 italic">Not Assigned</span>
                  )}
                </td>
                <td className="p-3">{u.position || "N/A"}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      u.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCustomer(u);
                      setModalOpen(true);
                    }}
                    className="text-[#0b7b7b] hover:text-[#095e5e] cursor-pointer"
                    title="Edit"
                  >
                    <FaPencilAlt />
                  </button>
                </td>
              </tr>
            ))}
            {sortedCustomers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <UserModal
          user={editingCustomer}
          onClose={() => {
            setModalOpen(false);
            setEditingCustomer(null);
            fetchCustomers();
          }}
          onSave={handleSaveCustomer}
          allRoles={allRoles}
          assignableUsers={assignableUsers}
        />
      )}

      {/* Orders Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold mb-4 text-[#0b7b7b]">
              Orders for {selectedCustomer.name}
            </h3>
            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order._id} className="py-2">
                    <div className="text-sm text-gray-700">
                      <strong>Order ID:</strong> {order._id}
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-[#0b7b7b] text-white rounded hover:bg-[#095e5e]"
                onClick={() => {
                  setSelectedCustomer(null);
                  setOrders([]);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
