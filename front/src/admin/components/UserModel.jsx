import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const POSITION_OPTIONS = [
  { label: "Doctor", value: "Doctor" },
  { label: "Retailer", value: "Retailer" },
  { label: "Distributor", value: "Distributor" },
  { label: "Wholesaler", value: "Wholesaler" },
  { label: "Hospital", value: "Hospital" },
];

const Dropdown = ({ value, onChange, options, placeholder }) => (
  <Listbox value={value} onChange={onChange}>
    <div className="relative mt-1">
      <Listbox.Button className="relative w-full border border-[#0b7b7b] bg-white text-[#0b7b7b] rounded-md px-3 py-2 text-left cursor-pointer hover:bg-[#c2efef]">
        <span className="block truncate">{value?.label || placeholder}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon className="w-5 h-5 text-[#0b7b7b]" />
        </span>
      </Listbox.Button>
      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white text-[#0b7b7b] shadow-md rounded-md border border-[#0b7b7b] max-h-60 overflow-auto">
        {options.map((option) => (
          <Listbox.Option
            key={option.value}
            value={option}
            className={({ active }) =>
              `cursor-pointer select-none py-2 px-4 ${
                active ? "bg-[#c2efef]" : ""
              }`
            }
          >
            {({ selected }) => (
              <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                {option.label}
                {selected && <CheckIcon className="w-4 h-4 inline ml-2 text-[#0b7b7b]" />}
              </span>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
);

const UserModal = ({ user, onClose, onSave, allRoles, allPermissions, assignableUsers }) => {
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
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
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
      position: position?.value || null,
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

  const selectedRole = roleOptions.find((r) => r.value === role) || null;

  const nonCustomerExecutives = (assignableUsers || []).filter((user) =>
    (user.role?.name?.toLowerCase() || "").includes("sales")
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#e6f7f7] rounded-xl p-6 w-full max-w-xl border border-[#0b7b7b] text-[#0b7b7b]">
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Edit User" : "Add New User"}
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border border-[#0b7b7b] px-3 py-2 rounded mt-1 bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-[#0b7b7b] px-3 py-2 rounded mt-1 bg-white"
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
                className="w-full border border-[#0b7b7b] px-3 py-2 rounded mt-1 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <Dropdown
              value={selectedRole}
              onChange={(selected) => {
                if (!selected) {
                  setRole("");
                  setRoleName("");
                  setPermissions([]);
                } else {
                  setRole(selected.value);
                  setRoleName(selected.label);
                  setPermissions(selected.permissions || []);
                }
              }}
              options={roleOptions}
              placeholder="Select Role"
            />
          </div>

          {/* Assign To */}
          {roleName === "Customer" && (
            <div>
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border border-[#0b7b7b] px-3 py-2 rounded bg-white"
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

          {/* Permissions */}
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

          {/* Position */}
          <div>
            <label className="block text-sm font-medium">Position</label>
            <Dropdown
              value={position}
              onChange={setPosition}
              options={POSITION_OPTIONS}
              placeholder="Select Position"
            />
          </div>
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
            className="px-4 py-1.5 text-sm rounded bg-[#0b7b7b] text-white hover:bg-[#095f5f]"
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
