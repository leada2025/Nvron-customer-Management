import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "../components/UserModel";
import { FaEllipsisV } from "react-icons/fa";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
    fetchRoles();
    fetchAssignableUsers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("/admin/users?onlyRole=Customer", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get("/admin/roles", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const customerRoles = data.filter(
        (role) => role.name.toLowerCase() === "customer"
      );
      setAllRoles(customerRoles);
    } catch (err) {
      console.error(err);
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

  const filteredCustomers = customers.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

<<<<<<< HEAD
=======
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((u) => u.isActive).length;
  const totalDue = "$8,000";

>>>>>>> refs/remotes/origin/main
  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#e6f7f7] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0b7b7b]">Customer</h2>
        <button
<<<<<<< HEAD
          onClick={() => {
            setEditingCustomer(null);
            setModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
        >
          + Add Customer
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-300 shadow-sm">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
=======
  onClick={() => {
    setEditingCustomer(null);
    setModalOpen(true);
  }}
  className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-4 py-2 rounded-md"
>
  + Add Customers
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
>>>>>>> refs/remotes/origin/main
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#0b7b7b]/30 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
          />
<<<<<<< HEAD
=======
          <span className="text-sm text-[#0b7b7b]/70">{`1–${filteredCustomers.length}/${customers.length}`}</span>
>>>>>>> refs/remotes/origin/main
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#f0fdfa] text-[#0b7b7b]">
            <tr>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Sales Executive</th>
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
                <td className="p-3">
<<<<<<< HEAD
                  {u.assignedExecutive?.name || "N/A"}
                  <div className="text-xs text-gray-500">
                    {u.assignedExecutive?.email || ""}
                  </div>
=======
                  Alice Williams
                  <div className="text-xs text-[#0b7b7b]/60">alicewilliams123@gmail.com</div>
>>>>>>> refs/remotes/origin/main
                </td>
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
<<<<<<< HEAD
                <td colSpan="4" className="p-4 text-center text-gray-500">
=======
                <td colSpan="6" className="p-4 text-center text-[#0b7b7b]/60">
>>>>>>> refs/remotes/origin/main
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
          assignableUsers={assignableUsers}
        />
      )}
    </div>
  );
};

export default CustomerPage;
<<<<<<< HEAD
=======

const SummaryCard = ({ title, value }) => (
  <div className="bg-white border border-[#0b7b7b]/20 rounded-xl p-4 text-center shadow">
    <div className="text-sm text-[#0b7b7b]/80 mb-1">{title}</div>
    <div className="text-2xl font-bold text-[#0b7b7b]">{value}</div>
  </div>
);
>>>>>>> refs/remotes/origin/main
