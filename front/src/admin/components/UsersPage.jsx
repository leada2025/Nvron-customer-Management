import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "./UserModel";
import { Menu } from "@headlessui/react";
import { MoreHorizontal } from "lucide-react";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [allPermissions] = useState([
    "Manage Pricing",
    "Approve Pricing",
    "Manage Orders",
    "Manage Users",
    "View Products",
    "Manage Products",
    "View All Users",
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchAssignableUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/admin/users?excludeRole=Customer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(data);
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
      setAllRoles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignableUsers = async () => {
    try {
      const { data } = await axios.get("/admin/users/assignable", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

      await fetchUsers();
      setModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt("Enter a new password (min 6 characters):");
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      await axios.patch(
        `/admin/users/reset-password/${userId}`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Password reset successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#f9fafb]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium"
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left uppercase text-xs">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{u.name}</td>
                  <td className="p-4 text-gray-700">{u.email}</td>
                  <td className="p-4 text-gray-700">{u.role?.name || "—"}</td>
                  <td className="p-4">
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
                  <td className="p-4 text-center">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                        <div className="py-1 text-sm">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setModalOpen(true);
                                }}
                                className={`w-full text-left px-4 py-2 ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleResetPassword(u._id)}
                                className={`w-full text-left px-4 py-2 ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                Reset Password
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className={`w-full text-left px-4 py-2 text-red-600 ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
