import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

const UserModal = ({ user, onClose, onSave, allRoles, allPermissions }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role?._id || "");
  const [permissions, setPermissions] = useState(user?.permissions || []);

  useEffect(() => {
    // Auto-fill permissions when role changes (unless editing)
    if (role && !user) {
      const selectedRole = allRoles.find((r) => r._id === role);
      if (selectedRole) {
        setPermissions(selectedRole.permissions || []);
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
      permissions,
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
    setPermissions([]);
    return;
  }

  setRole(selected.value || selected.label); // if custom, use label as fallback

  if (selected.permissions) {
    setPermissions(selected.permissions);
  } else {
    setPermissions([]); // for newly created roles
  }
};
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Edit User" : "Add New User"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {user ? "Update User" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
