import React, { useState, useEffect } from "react";
import axios from "../api/Axios";
import { PlusCircle, Trash2, Pencil } from "lucide-react";

export default function OffersPage() {
  const [editingOffer, setEditingOffer] = useState(null);
const [allUsers, setAllUsers] = useState([]); // for mapping _id → name/email

  const [offers, setOffers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "% Discount",
    value: "",
    minOrder: "",
    eligibleFor: "All",
    validityStart: "",
    validityEnd: "",
    stackable: "Yes"
  });

  useEffect(() => {
  fetchOffers();
  fetchAllUsers(); // NEW: map eligibleUsers → name
  if (formData.eligibleFor !== "All") {
    fetchCustomers(formData.eligibleFor);
  }
}, []);

const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllUsers(res.data); // store all users to map later
  } catch (err) {
    console.error("Failed to fetch all users", err);
  }
};

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/offers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data);
    } catch (err) {
      console.error("Failed to load offers", err);
    }
  };

  const fetchCustomers = async (eligibleType) => {
    try {
      const token = localStorage.getItem("token");
      let url = "/admin/users?onlyRole=Customer";
      if (eligibleType === "Specific DP") {
        url += "&onlyPosition=Partners";
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to load customers", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));

    if (name === "eligibleFor") {
      setSelectedUsers([]);
      if (value !== "All") {
        fetchCustomers(value);
      }
    }
  };

 const handleCreateOffer = async () => {
  try {
    const token = localStorage.getItem("token");
    const payload = {
      ...formData,
      eligibleUsers: formData.eligibleFor === "All" ? [] : selectedUsers,
    };

    if (editingOffer) {
      await axios.put(`/api/offers/${editingOffer._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post("/api/offers", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    await fetchOffers(); // refresh offers
    setFormData({
      name: "",
      type: "% Discount",
      value: "",
      minOrder: "",
      eligibleFor: "All",
      validityStart: "",
      validityEnd: "",
      stackable: "Yes",
    });
    setSelectedUsers([]);
    setEditingOffer(null);
  } catch (err) {
    console.error("Error saving offer", err);
  }
};


  const handleExpire = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/offers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Error expiring offer", err);
    }
  };

  const handleEditOffer = (offer) => {
  setEditingOffer(offer);
  setFormData({
    name: offer.name,
    type: offer.type,
    value: offer.value,
    minOrder: offer.minOrder,
    eligibleFor: offer.eligibleFor,
    validityStart: offer.validityStart?.substring(0, 10),
    validityEnd: offer.validityEnd?.substring(0, 10),
    stackable: offer.stackable,
  });
  setSelectedUsers(offer.eligibleUsers || []);
  if (offer.eligibleFor !== "All") {
    fetchCustomers(offer.eligibleFor);
  }
};

const handleCancel = () => {
  setFormData({
    name: "",
    type: "% Discount",
    value: "",
    minOrder: "",
    eligibleFor: "All",
    validityStart: "",
    validityEnd: "",
    stackable: "Yes",
  });
  setSelectedUsers([]);
  setEditingOffer(null);
};



  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#0b7b7b]">🎯 Create Offer</h2>

      <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#0b7b7b]/20">
        <div>
          <label className="block text-sm font-medium text-gray-700">Offer Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Offer Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded p-2">
            <option>% Discount</option>
            <option>Flat Amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Value</label>
          <input name="value" type="number" value={formData.value} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Order ₹</label>
          <input name="minOrder" type="number" value={formData.minOrder} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Eligible For</label>
          <select name="eligibleFor" value={formData.eligibleFor} onChange={handleChange} className="w-full border rounded p-2">
            <option>All</option>
            <option>Specific DP</option>
            <option>Specific Customer</option>
          </select>
        </div>

        {(formData.eligibleFor === "Specific DP" || formData.eligibleFor === "Specific Customer") && (
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Select Eligible Users</label>
            <select
              multiple
              className="w-full border rounded p-2 h-32"
              value={selectedUsers}
              onChange={(e) =>
                setSelectedUsers(Array.from(e.target.selectedOptions, (option) => option.value))
              }
            >
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Valid From</label>
            <input type="date" name="validityStart" value={formData.validityStart} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Valid To</label>
            <input type="date" name="validityEnd" value={formData.validityEnd} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stackable with Commission?</label>
          <select name="stackable" value={formData.stackable} onChange={handleChange} className="w-full border rounded p-2">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

  <div className="col-span-1 sm:col-span-2 flex justify-end gap-4">
  <button
    onClick={handleCancel}
    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
  >
    Cancel
  </button>
  <button
    onClick={handleCreateOffer}
    className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-4 py-2 rounded flex items-center gap-2"
  >
    <PlusCircle size={18} />
    {editingOffer ? "Update Offer" : "Create Offer"}
  </button>
</div>

      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-[#0b7b7b]">📋 Active Offers</h2>
      {offers.length === 0 ? (
        <p className="text-sm text-gray-600">No active offers yet.</p>
      ) : (
        <div className="overflow-auto rounded border border-[#0b7b7b]/30 shadow">
          <table className="w-full text-sm">
            <thead className="bg-[#0b7b7b] text-white">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Value</th>
                <th className="p-2">Min Order</th>
                <th className="p-2">Eligible</th>
                <th className="p-2">Validity</th>
                <th className="p-2">Stackable</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
           <tbody>
  {offers.map((o) => (
    <React.Fragment key={o._id}>
      <tr className="border-b">
        <td className="p-2">{o.name}</td>
        <td className="p-2">{o.type}</td>
        <td className="p-2">{o.value}</td>
        <td className="p-2">₹{o.minOrder}</td>
        <td className="p-2">{o.eligibleFor}</td>
        <td className="p-2">
          {o.validityStart?.substring(0, 10)} → {o.validityEnd?.substring(0, 10)}
        </td>
        <td className="p-2">{o.stackable}</td>
        <td className="p-2 flex gap-2">
          <button
            onClick={() => handleEditOffer(o)}
            className="text-blue-600 hover:underline"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleExpire(o._id)}
            className="text-red-600 hover:underline"
            title="Expire"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>

      {/* 🔽 Show eligible users if present */}
      {o.eligibleUsers?.length > 0 && (
        <tr>
          <td colSpan="8" className="p-2 text-sm text-gray-500 italic">
            Offered to:{" "}
            {o.eligibleUsers
              .map((uid) => {
                const user = allUsers.find((u) => u._id === uid);
                return user ? `${user.name} (${user.email})` : uid;
              })
              .join(", ")}
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>



          </table>
        </div>
      )}
    </div>
  );
}
