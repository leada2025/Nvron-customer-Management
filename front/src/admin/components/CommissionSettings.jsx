import React, { useState, useEffect } from "react";
import axios from "../api/Axios";
import { Plus, Trash2 } from "lucide-react";

const CommissionSettings = () => {
  const [slabs, setSlabs] = useState([]);
  const [fixedPTR, setFixedPTR] = useState(10);
  const [fixedPTS, setFixedPTS] = useState(9);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const isGlobal = selectedPartner === "";

  useEffect(() => {
    fetchPartners();
    fetchConfig(); // Load global by default
  }, []);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/admin/users?onlyPosition=partners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartners(data);
    } catch (err) {
      console.error("Failed to load partners", err);
    }
  };

  const fetchConfig = async (partnerId = "") => {
  setLoading(true);
  setError("");
  try {
    const token = localStorage.getItem("token");
    const url = partnerId
      ? `/api/partner-commission/${partnerId}`
      : "/api/commission";
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSlabs(data.slabs || []);
    setFixedPTR(data.fixedPTRRate ?? 10);
    setFixedPTS(data.fixedPTSRate ?? 9);
  } catch (err) {
    if (partnerId && err.response?.status === 404) {
      // No partner config yet – fallback to global
      console.warn("No partner config found. Falling back to global.");
      fetchConfig(""); // Load global config
    } else {
      console.error("Failed to fetch config", err);
      setError("Failed to load commission config.");
    }
  } finally {
    setLoading(false);
  }
};


  const handleSlabChange = (index, field, value) => {
    setSlabs((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, [field]: Number(value) || 0 } : s
      )
    );
  };

  const handleAddSlab = () => {
    setSlabs((prev) => [...prev, { from: 0, to: 0, percent: 0 }]);
  };

  const handleDeleteSlab = (index) => {
    setSlabs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const url = isGlobal ? "/api/commission" : `/api/partner-commission/${selectedPartner}`;

      const payload = isGlobal
        ? { slabs, fixedPTRRate: fixedPTR, fixedPTSRate: fixedPTS }
        : { partnerId: selectedPartner, slabs, fixedPTSRate: fixedPTS };

      await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Commission settings updated.");
    } catch (err) {
      console.error("Save failed", err);
      setError("Failed to save. Make sure you're an admin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#0b7b7b] mb-4">Commission Settings</h2>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <div className="mb-6">
        <label className="block mb-1 font-medium">Select Partner</label>
        <select
          value={selectedPartner}
          onChange={(e) => {
            const partnerId = e.target.value;
            setSelectedPartner(partnerId);
            fetchConfig(partnerId);
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">🌐 Global Commission</option>
          {partners.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">PTR Commission Rate (%)</label>
        <input
          type="number"
          value={fixedPTR}
          onChange={(e) => setFixedPTR(Number(e.target.value))}
          disabled={!isGlobal}
          className={`border p-2 rounded w-32 ${!isGlobal ? "bg-gray-100 text-gray-500" : ""}`}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">PTS Commission Rate (%)</label>
        <input
          type="number"
          value={fixedPTS}
          onChange={(e) => setFixedPTS(Number(e.target.value))}
          className="border p-2 rounded w-32"
        />
      </div>

      <h3 className="text-lg font-semibold text-[#0b7b7b] mb-2">Slab-Based Commission</h3>

      <table className="w-full border mb-4">
        <thead className="bg-[#e6f7f7] text-sm text-[#0b7b7b]">
          <tr>
            <th className="p-2 border">From (₹)</th>
            <th className="p-2 border">To (₹)</th>
            <th className="p-2 border">Commission %</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {slabs.map((slab, index) => (
            <tr key={index}>
              <td className="p-2 border">
                <input
                  type="number"
                  value={slab.from}
                  onChange={(e) => handleSlabChange(index, "from", e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={slab.to}
                  onChange={(e) => handleSlabChange(index, "to", e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={slab.percent}
                  onChange={(e) => handleSlabChange(index, "percent", e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleDeleteSlab(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleAddSlab}
        className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 mb-4"
      >
        <Plus size={16} />
        Add New Slab
      </button>

      <div className="text-right">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0b7b7b] text-white px-6 py-2 rounded hover:bg-[#095e5e]"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default CommissionSettings;
