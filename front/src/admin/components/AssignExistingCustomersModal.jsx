import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const AssignExistingCustomersModal = ({ distributor, onClose, onAssigned }) => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data } = await axios.get("/admin/users?onlyRole=Customer", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const unassigned = data.filter(c => !c.partnerRef);
      setAllCustomers(unassigned);
    };
    fetchCustomers();
  }, []);

  const handleAssign = async () => {
    try {
      await axios.patch(
        "/admin/users/assign-partner",
        {
          customerIds: selectedCustomers,
          partnerUserId: distributor.userId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Customers assigned successfully.");
      onAssigned();
      onClose();
    } catch (err) {
      alert("Error assigning customers.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-[#0b7b7b]">
          Assign Existing Customers to {distributor.name}
        </h3>

        <div className="space-y-2 max-h-[300px] overflow-y-auto border p-2 rounded">
          {allCustomers.map((cust) => (
            <label key={cust._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={cust._id}
                checked={selectedCustomers.includes(cust._id)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSelectedCustomers((prev) =>
                    checked
                      ? [...prev, cust._id]
                      : prev.filter((id) => id !== cust._id)
                  );
                }}
              />
              <span>{cust.name} ({cust.email})</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={selectedCustomers.length === 0}
            className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-4 py-1 rounded"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignExistingCustomersModal;
