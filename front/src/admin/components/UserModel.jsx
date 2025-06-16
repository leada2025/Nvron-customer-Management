import React, { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import axios from "../api/Axios";

// Predefined tag options
const TAG_OPTIONS = [
  { label: "Doctor", value: "Doctor" },
  { label: "Retailer", value: "Retailer" },
  { label: "Distributor", value: "Distributor" },
  { label: "Wholesaler", value: "Wholesaler" },
  { label: "Hospital", value: "Hospital" },
];

const UserModal = ({ user, onClose, onSave, allRoles, allPermissions, assignableUsers }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role?._id || "");
  const [roleName, setRoleName] = useState(user?.role?.name || "");
  const [permissions, setPermissions] = useState(user?.permissions || []);
  const [assignedTo, setAssignedTo] = useState(user?.assignedTo || "");
  const [tags, setTags] = useState(user?.tags?.map((tag) => ({ label: tag, value: tag })) || []);

  useEffect(() => {
    if (role && !user) {
      const selectedRole = allRoles.find((r) => r._id === role);
      if (selectedRole) {
        setPermissions(selectedRole.permissions || []);
        setRoleName(selectedRole.name);
      }
    }
  }, [role]);

  const handleCheckboxChange = (perm) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSubmit = () => {
    if (!name || !email || !role) {
      alert("Name, Email, and Role are required");
      return;
    }

    const userData = {
      name,
      email,
      role,
      assignedTo: roleName === "Customer" ? assignedTo || null : null,
      permissions: roleName === "Customer" ? [] : permissions,
      tags: tags.map((t) => t.value),
    };

    if (password) {
      userData.password = password;
    }

    onSave(userData);
  };

  const roleOptions = allRoles.map((r) => ({
    value: r._id,
    label: r.name,
    permissions: r.permissions,
  }));

  const handleRoleChange = (selected) => {
    if (!selected) {
      setRole("");
      setRoleName("");
      setPermissions([]);
      return;
    }

    setRole(selected.value);
    setRoleName(selected.label);
    if (selected.permissions) {
      setPermissions(selected.permissions);
    } else {
      setPermissions([]);
    }
  };

  const nonCustomerExecutives = (assignableUsers || []).filter((user) => {
    const roleName = user.role?.name?.toLowerCase() || "";
    return roleName !== "customer" && roleName.includes("sales");
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Edit User" : "Add New User"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Role</label>
            <CreatableSelect
              isClearable
              onChange={handleRoleChange}
              options={roleOptions}
              defaultValue={
                user && user.role
                  ? {
                      value: user.role._id,
                      label: user.role.name,
                      permissions: user.role.permissions,
                    }
                  : null
              }
              placeholder="Type to search or create role..."
            />
          </div>

          {/* Assign To dropdown only for Customer */}
          {roleName === "Customer" && (
            <div>
              <label className="block font-medium mb-1">Assign To (Sales Executive)</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">— None —</option>
                {nonCustomerExecutives.map((exec) => (
                  <option key={exec._id} value={exec._id}>
                    {exec.name} ({exec.role?.name || "No Role"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags Selection for All */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <Select
              isMulti
              options={TAG_OPTIONS}
              value={tags}
              onChange={setTags}
              placeholder="Select tags..."
              classNamePrefix="react-select"
            />
          </div>

          {/* Permissions for non-Customer */}
          {roleName !== "Customer" && (
            <div>
              <label className="block text-sm font-medium">Permissions</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {allPermissions.map((perm) => (
                  <label key={perm} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm)}
                      onChange={() => handleCheckboxChange(perm)}
                    />
                    <span>{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            {user ? "Update" : "Create"}
          </button>

          {user && (
            <>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this user?")) {
                    axios
                      .delete(`/admin/users/${user._id}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      })
                      .then(() => {
                        alert("User deleted.");
                        onClose();
                      })
                      .catch(() => alert("Failed to delete."));
                  }
                }}
                className="px-3 py-1 text-sm border border-gray-300 text-red-600 bg-white rounded hover:bg-red-50"
              >
                Delete
              </button>

              <button
                onClick={() => {
                  axios
                    .patch(`/admin/users/toggle-status/${user._id}`, null, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    })
                    .then(() => {
                      alert("User status toggled.");
                      onClose();
                    })
                    .catch(() => alert("Failed to toggle."));
                }}
                className="px-3 py-1 text-sm border border-gray-300 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                {user.isActive ? "Disable A/c" : "Enable A/c"}
              </button>

              <button
                onClick={() => {
                  const newPassword = prompt("Enter new password (min 6 chars):");
                  if (!newPassword || newPassword.length < 6) {
                    alert("Password must be at least 6 characters.");
                    return;
                  }

                  axios
                    .patch(
                      `/admin/users/reset-password/${user._id}`,
                      { newPassword },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    )
                    .then(() => alert("Password reset."))
                    .catch(() => alert("Failed to reset password."));
                }}
                className="px-3 py-1 text-sm border border-gray-300 bg-white text-indigo-600 rounded hover:bg-indigo-50"
              >
                Reset Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
