import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "../components/UserModel";
import { FaEllipsisV } from "react-icons/fa";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCustomers = customers.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((u) => u.isActive).length;
  const totalDue = "$8,000";

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#e6f7f7] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0b7b7b]">Customer</h2>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
        >
          + Add Executives
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Customers" value={totalCustomers} />
        <SummaryCard title="Active Customers" value={activeCustomers} />
        <SummaryCard title="On Due Balance" value={totalDue} />
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-xl border border-[#0b7b7b]/20 shadow">
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#0b7b7b]/10">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#0b7b7b]/30 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
          />
          <span className="text-sm text-[#0b7b7b]/70">{`1–${filteredCustomers.length}/${customers.length}`}</span>
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#f0fdfa] text-[#0b7b7b]">
            <tr>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Customer Code</th>
              <th className="p-3">Sales Executive Name</th>
              <th className="p-3">Positions</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((u) => (
              <tr
                key={u._id}
                className="border-t border-[#0b7b7b]/10 hover:bg-[#f8ffff] cursor-pointer"
                onClick={() => {
                  setEditingCustomer(u);
                  setModalOpen(true);
                }}
              >
                <td className="p-3 font-medium text-[#0b7b7b]">
                  {u.name}
                  <div className="text-xs text-[#0b7b7b]/60">{u.email}</div>
                </td>
                <td className="p-3">CUST001</td>
                <td className="p-3">
                  Alice Williams
                  <div className="text-xs text-[#0b7b7b]/60">alicewilliams123@gmail.com</div>
                </td>
                <td className="p-3">{u.position}</td>
                <td className="p-3">
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
                <td className="p-3 text-center">
                  <FaEllipsisV className="inline text-[#0b7b7b]/60" />
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-[#0b7b7b]/60">
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
            fetchCustomers();
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

const SummaryCard = ({ title, value }) => (
  <div className="bg-white border border-[#0b7b7b]/20 rounded-xl p-4 text-center shadow">
    <div className="text-sm text-[#0b7b7b]/80 mb-1">{title}</div>
    <div className="text-2xl font-bold text-[#0b7b7b]">{value}</div>
  </div>
);
