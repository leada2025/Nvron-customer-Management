import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userPosition = localStorage.getItem("position"); // ✅ FIX

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/admin/users/referred-customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to load referred customers", err);
      } finally {
        setLoading(false); // ✅ loading stop
      }
    };

    if (userPosition === "Partners") {
      fetchCustomers();
    } else {
      setLoading(false); // fallback if not Partner
    }
  }, [userPosition]);

  if (loading) return <div className="p-6 text-center text-[#0b7b7b]">Loading customers...</div>;

  if (customers.length === 0) {
    return <div className="p-6 text-center text-gray-600">No customers found.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-[#0b7b7b]">Your Customers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {customers.map((cust) => (
          <div
            key={cust._id}
            className="bg-white rounded-lg shadow p-4 border border-[#0b7b7b]/20"
          >
            <h3 className="text-lg font-semibold text-[#0b7b7b]">{cust.name}</h3>
            <p className="text-sm text-gray-600">{cust.email}</p>
            <p className="text-sm text-gray-500 capitalize">Position: {cust.position || "Customer"}</p>
            <p className="text-sm text-gray-500">Place of Supply: {cust.placeOfSupply || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerPage;
