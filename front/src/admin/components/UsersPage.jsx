import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "./UserModel";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const allPermissions = [
    "Manage Pricing",
    "Approve Pricing",
    "Manage Orders",
    "Manage Users",
    "View Products",
    "Manage Products",
    "View All Users",
  ];

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchAssignableUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/admin/users?excludeRole=Customer", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get("/admin/roles", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  const fetchAssignableUsers = async () => {
    try {
      const { data } = await axios.get("/admin/users/assignable", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignableUsers(data);
      console.log("setAssignableUsers(data)");
      
    } catch (err) {
      console.error("Failed to fetch assignable users", err);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await axios.put(`/admin/users/${editingUser._id}`, userData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post("/admin/users", userData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      await fetchUsers();
      setModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.role?.name || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded w-64"
          />
          <button
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr
                key={u._id}
                className="border-t border-gray-300 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setEditingUser(u);
                  setModalOpen(true);
                }}
              >
                <td className="text-sm p-3">{u.name}</td>
                <td className="text-sm p-3">{u.email}</td>
                <td className="text-sm p-3">{u.role?.name || u.role || "—"}</td>
                <td className="text-sm p-3">
                  <span
                    className={`text-xs font-medium rounded-full px-2 py-1 ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      {modalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
          allRoles={allRoles}
          allPermissions={allPermissions}
          assignableUsers={assignableUsers}
        />
      )}
    </div>
  );
};

export default UserPage;
