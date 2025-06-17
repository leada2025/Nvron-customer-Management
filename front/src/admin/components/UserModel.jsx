import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import Select from "react-select";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const POSITION_OPTIONS = [
  { label: "Doctor", value: "Doctor" },
  { label: "Retailer", value: "Retailer" },
  { label: "Distributor", value: "Distributor" },
  { label: "Wholesaler", value: "Wholesaler" },
  { label: "Hospital", value: "Hospital" },
];

const UserModal = ({ user, onClose, onSave, allRoles = [], allPermissions = [], assignableUsers = [] }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role?._id || "");
  const [roleName, setRoleName] = useState(user?.role?.name || "");
  const [permissions, setPermissions] = useState(user?.permissions || []);
  const [assignedTo, setAssignedTo] = useState(user?.assignedTo || "");
  const [position, setPosition] = useState(
    user?.position ? { label: user.position, value: user.position } : null
  );
  const [loading, setLoading] = useState(false);

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
    setPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const handleSubmit = async () => {
    if (!name || !email || !role) {
      alert("Name, Email, and Role are required");
      return;
    }

    const userData = {
      name,
      email,
      role,
      assignedTo: roleName.toLowerCase() === "customer" ? assignedTo || null : null,
      permissions: roleName.toLowerCase() === "customer" ? [] : permissions,
      position: position?.value || null,
    };

    if (password) userData.password = password;

    setLoading(true);
    try {
      await onSave(userData);
    } finally {
      setLoading(false);
    }
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
    } else {
      setRole(selected.value);
      setRoleName(selected.label);
      setPermissions(selected.permissions || []);
    }
  };

  const salesExecutives = (assignableUsers || []).filter((exec) => {
    const execRole = exec?.role?.name?.toLowerCase() || "";
    return execRole !== "customer" && execRole.includes("sales");
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">{user ? "Edit User" : "Add New User"}</h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password (Only on create) */}
          {!user && (
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <Select
              value={roleOptions.find((r) => r.value === role) || null}
              onChange={handleRoleChange}
              options={roleOptions}
              placeholder="Type to search or select role..."
              classNamePrefix="react-select"
              isClearable
            />
          </div>

          {roleName.toLowerCase() === "customer" && (
            <div>
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border px-3 py-2 rounded bg-white"
              >
                <option value="">— None —</option>
                {(salesExecutives || []).map((exec) => (
                  <option key={exec._id} value={exec._id}>
                    {exec.name} ({exec.role?.name || "No Role"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Position */}
          <div>
            <label className="block text-sm font-medium">Position</label>
            <Select
              isClearable
              options={POSITION_OPTIONS}
              value={position}
              onChange={setPosition}
              placeholder="Select position..."
              classNamePrefix="react-select"
            />
          </div>

          {/* Permissions */}
          {roleName.toLowerCase() !== "customer" && (
            <div>
              <label className="block text-sm font-medium">Permissions</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {(allPermissions || []).map((perm) => (
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

        {/* Footer Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm rounded border border-[#0b7b7b] text-[#0b7b7b] bg-white hover:bg-[#c2efef]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            {loading ? "Saving..." : user ? "Update" : "Create"}
          </button>

          {user && (
            <>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this user?")) {
                    axios
                      .delete(`/admin/users/${user._id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                      })
                      .then(() => {
                        alert("User deleted.");
                        onClose();
                      })
                      .catch(() => alert("Failed to delete."));
                  }
                }}
                className="px-4 py-1.5 text-sm rounded border border-red-500 text-red-600 bg-white hover:bg-red-50"
              >
                Delete
              </button>

              <button
                onClick={() => {
                  axios
                    .patch(`/admin/users/toggle-status/${user._id}`, null, {
                      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    })
                    .then(() => {
                      alert("User status toggled.");
                      onClose();
                    })
                    .catch(() => alert("Failed to toggle."));
                }}
                className="px-4 py-1.5 text-sm rounded border bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                className="px-4 py-1.5 text-sm rounded border border-[#0b7b7b] bg-white text-[#0b7b7b] hover:bg-[#c2efef]"
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
