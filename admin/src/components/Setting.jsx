import React, { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    minRate: 10,
    orderShippingThreshold: 10000,
    notificationEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings saved (simulate backend save)");
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-lg">
      <h2 className="text-2xl font-semibold mb-4">Admin Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Minimum Rate (₹)</label>
          <input
            type="number"
            name="minRate"
            value={settings.minRate}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Free Shipping Threshold (₹)</label>
          <input
            type="number"
            name="orderShippingThreshold"
            value={settings.orderShippingThreshold}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Notification Email</label>
          <input
            type="email"
            name="notificationEmail"
            value={settings.notificationEmail}
            onChange={handleChange}
            placeholder="admin@example.com"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
