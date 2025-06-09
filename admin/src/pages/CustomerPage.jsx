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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Customer Management</h2>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            className="px-4 py-2 border rounded shadow-sm w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setEditingCustomer(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow whitespace-nowrap"
          >
            + Add Customer
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Permissions</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role?.name || u.role || "—"}</td>
                <td className="p-3">
                  <ul className="list-disc list-inside text-sm">
                    {(u.permissions || []).map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setEditingCustomer(u);
                      setModalOpen(true);
                    }}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggleStatus(u._id)}
                    className={`px-3 py-1 rounded ${
                      u.isActive ? "bg-red-600" : "bg-green-600"
                    } text-white`}
                  >
                    {u.isActive ? "Disable A/c" : "Enable A/c"}
                  </button>
                  <button
                    onClick={() => handleResetPassword(u._id)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    Reset Password
                  </button>
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
