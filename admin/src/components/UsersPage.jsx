import React, { useEffect, useState } from "react";
import UserModal from "./UserModel";



const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([
    "View Orders",
    "Manage Pricing",
    "Approve Pricing",
    "Download Orders",
    "Manage Users",
     "View Products",
  "Manage Products"
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setAllRoles(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load roles");
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/users${editingUser ? `/${editingUser._id}` : ""}`,
        {
          method: editingUser ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!res.ok) throw new Error("Failed to save user");
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
      const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
   
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
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
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role?.name || "—"}</td>
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
                      setEditingUser(u);
                      setModalOpen(true);
                    }}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        />
      )}
    </div>
   
  );
};

export default UserPage;
