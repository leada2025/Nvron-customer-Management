import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "../components/UserModel";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Add this

  useEffect(() => {
    fetchCustomers();
    fetchRoles();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("/admin/users?onlyRole=Customer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get("/admin/roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const customerRoles = data.filter(
        (role) => role.name.toLowerCase() === "customer"
      );
      setAllRoles(customerRoles);
    } catch (err) {
      console.error(err);
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

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`/admin/users/toggle-status/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle user status");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete customer");
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt("Enter a new password (min 6 chars):");
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      await axios.patch(`/admin/users/reset-password/${id}`, { newPassword }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Password reset successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password.");
    }
  };

  // 🔍 Filtered customers
  const filteredCustomers = customers.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
   <div className="p-6 max-w-7xl mx-auto">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-semibold text-gray-800">Customer Management</h2>
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Search customers..."
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        onClick={() => {
          setEditingCustomer(null);
          setModalOpen(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
      >
        + Add Customer
      </button>
    </div>
  </div>

<div className="overflow-x-auto bg-white border border-gray-300 rounded-md shadow-sm">
  <table className="min-w-full divide-y divide-gray-100">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
       
      </tr>
    </thead>
   <tbody>

  {filteredCustomers.map((u) => (
    <tr
      key={u._id}
      className="border-t border-gray-300 hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        setEditingCustomer(u);
        setModalOpen(true);
      }}
    >
      <td className="text-sm p-3">{u.name}</td>
      <td className=" text-sm p-3">{u.email}</td>
      <td className=" text-sm  p-3">{u.role?.name || u.role || "—"}</td>
      <td className=" text-sm  p-3">
        <span
          className={`text-xs font-medium rounded-full ml-4 ${
            u.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {u.isActive ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  ))}

  {filteredCustomers.length === 0 && (
    <tr>
      <td colSpan="5" className="p-4 text-center text-gray-500">
        No customers found.
      </td>
    </tr>
  )}
</tbody>

  </table>
</div>


      {modalOpen && (
<UserModal
  user={editingCustomer}
  onClose={() => {
    setModalOpen(false);
    setEditingCustomer(null);
    fetchCustomers(); // Refresh data
  }}
  onSave={handleSaveCustomer}
  allRoles={allRoles}
  allPermissions={allPermissions}
/>

      )}
    </div>
  );
};

export default CustomerPage;
