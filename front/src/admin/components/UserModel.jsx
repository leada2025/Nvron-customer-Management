import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import Select from "react-select";

const POSITION_OPTIONS = [
  { label: "Doctor", value: "Doctor" },
  { label: "Retailer", value: "Retailer" },
  { label: "Distributor", value: "Distributor" },
  { label: "Partners", value: "Partners" },
];

const STATE_OPTIONS = [
  { label: "Andhra Pradesh", value: "AP" },
  { label: "Arunachal Pradesh", value: "AR" },
  { label: "Assam", value: "AS" },
  { label: "Bihar", value: "BR" },
  { label: "Chhattisgarh", value: "CG" },
  { label: "Goa", value: "GA" },
  { label: "Gujarat", value: "GJ" },
  { label: "Haryana", value: "HR" },
  { label: "Himachal Pradesh", value: "HP" },
  { label: "Jharkhand", value: "JH" },
  { label: "Karnataka", value: "KA" },
  { label: "Kerala", value: "KL" },
  { label: "Madhya Pradesh", value: "MP" },
  { label: "Maharashtra", value: "MH" },
  { label: "Manipur", value: "MN" },
  { label: "Meghalaya", value: "ML" },
  { label: "Mizoram", value: "MZ" },
  { label: "Nagaland", value: "NL" },
  { label: "Odisha", value: "OD" },
  { label: "Punjab", value: "PB" },
  { label: "Rajasthan", value: "RJ" },
  { label: "Sikkim", value: "SK" },
  { label: "Tamil Nadu", value: "TN" },
  { label: "Telangana", value: "TS" },
  { label: "Tripura", value: "TR" },
  { label: "Uttar Pradesh", value: "UP" },
  { label: "Uttarakhand", value: "UK" },
  { label: "West Bengal", value: "WB" },
  { label: "Delhi", value: "DL" },
  { label: "Puducherry", value: "PY" },
  { label: "Jammu and Kashmir", value: "JK" },
  { label: "Ladakh", value: "LA" },
];

const UserModal = ({
  user,
  onClose,
  onSave,
  allRoles = [],
  allPermissions = [],
  assignableUsers = [],
    prefill = {},
    partners = [],
      addViaDistributor = false,
  partnerUserId = null,
}) => {
  const [name, setName] = useState(user?.name ||  prefill.name || "");
  const [email, setEmail] = useState(user?.email || prefill.email  ||  "");
const [password, setPassword] = useState(user?.password || prefill.password || "");

  const [role, setRole] = useState(user?.role?._id || prefill.role ||  "");
  const [roleName, setRoleName] = useState(user?.role?.name || "");
  const [permissions, setPermissions] = useState(user?.permissions || []);
  const [assignedTo, setAssignedTo] = useState(user?.assignedTo || "");
  const [position, setPosition] = useState(
 user?.position
    ? { label: user.position, value: user.position }
    : prefill.position
    ? { label: prefill.position, value: prefill.position }
    : null
);
  const [state, setState] = useState(
    user?.placeOfSupply
      ? STATE_OPTIONS.find((s) => s.value === user.placeOfSupply)
      : null
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
      placeOfSupply: roleName.toLowerCase() === "customer" ? state?.value || null : null,
    };

if (
  roleName.toLowerCase() === "customer" &&
  addViaDistributor &&
  position?.value !== "Partners" &&
  partnerUserId
) {
  userData.partnerRef = partnerUserId;
} else {
  userData.partnerRef = null;
}


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
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-[#0b7b7b]">
        <h2 className="text-2xl font-semibold text-[#0b7b7b] mb-6">
          {user ? "Edit User" : "Add New User"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 focus:ring-[#0b7b7b] focus:border-[#0b7b7b]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 focus:ring-[#0b7b7b] focus:border-[#0b7b7b]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 focus:ring-[#0b7b7b] focus:border-[#0b7b7b]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

       <div>
  <label className="block text-sm font-medium text-gray-700">Roles</label>
  <Select
    value={roleOptions.find((r) => r.value === role) || null}
    onChange={handleRoleChange}
    options={roleOptions}
    placeholder="Select role..."
    classNamePrefix="react-select"
    isClearable
    styles={{
      singleValue: (base) => ({
        ...base,
        textTransform: "capitalize",
      }),
      option: (base) => ({
        ...base,
        textTransform: "capitalize",
      }),
      placeholder: (base) => ({
        ...base,
        textTransform: "capitalize",
      }),
    }}
  />
</div>


          {roleName.toLowerCase() === "customer" && !["sales", "sale", "sales executive"].includes(localStorage.getItem("role")?.toLowerCase()) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white focus:ring-[#0b7b7b] focus:border-[#0b7b7b]"
              >
                <option value="">— None —</option>
                {salesExecutives.map((exec) => (
                  <option key={exec._id} value={exec._id}>
                    {exec.name} ({exec.role?.name || "No Role"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {roleName.toLowerCase() === "customer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <Select
                  isClearable
                  options={POSITION_OPTIONS}
                  value={position}
                  onChange={setPosition}
                  placeholder="Select position..."
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">State (Place of Supply)</label>
                <Select
                  isClearable
                  options={STATE_OPTIONS}
                  value={state}
                  onChange={setState}
                  placeholder="Select state..."
                  classNamePrefix="react-select"
                />
              </div>
            </>
          )}

        {roleName.toLowerCase() === "customer" &&
  addViaDistributor &&
  position?.value !== "Partners" && (
    <div>
      <label className="block text-sm font-medium text-gray-700">Partner Reference</label>
     <select
  value={partnerUserId || ""}
  disabled
  className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 text-gray-700"
>
  {partners
    .filter((p) => p.userId === partnerUserId)
    .map((partner) => (
      <option key={partner.userId} value={partner.userId}>
        {partner.name} ({partner.email})
      </option>
    ))}
</select>

    </div>
)}




          {roleName.toLowerCase() !== "customer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Permissions</label>
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

        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-[#0b7b7b] text-[#0b7b7b] bg-white hover:bg-[#e6f7f7]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-[#0b7b7b] text-white rounded-lg hover:bg-[#095f5f] disabled:opacity-50"
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
                className="px-4 py-2 text-sm rounded-lg border border-red-500 text-red-600 bg-white hover:bg-red-50"
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
                className="px-4 py-2 text-sm rounded-lg border bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                className="px-4 py-2 text-sm rounded-lg border border-[#0b7b7b] bg-white text-[#0b7b7b] hover:bg-[#e6f7f7]"
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
