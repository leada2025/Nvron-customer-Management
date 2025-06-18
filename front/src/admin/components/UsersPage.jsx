import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "./UserModel";
import { Menu } from "@headlessui/react";
import { MoreHorizontal } from "lucide-react";

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-[#e1f4f6] p-5 rounded-lg border border-[#0b7b7b]/20 shadow">
        <div>
          <h2 className="text-2xl font-bold text-[#0b7b7b]">User Management</h2>
          <p className="text-sm text-gray-600">Manage roles, permissions, and user details</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-[#0b7b7b]/30 rounded w-64 text-sm"
          />
          <button
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
            className="bg-[#0b7b7b] text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-[#095e5e] transition"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#e6f7f7] border border-[#0b7b7b]/20 rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left text-[#0b7b7b]">
          <thead className="bg-[#c2efef] text-[#0b7b7b] font-semibold uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bde8e8]">
            {filteredUsers.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-[#d7f3f3] transition cursor-pointer"
                onClick={() => {
                  setEditingUser(u);
                  setModalOpen(true);
                }}
              >
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role?.name || u.role || "—"}</td>
                <td className="px-4 py-2">
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
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
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
            fetchUsers();
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
