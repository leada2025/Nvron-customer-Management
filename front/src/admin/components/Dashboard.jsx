import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/admin/users/dashboard-stats", {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-[#0b7b7b]">
          Welcome to Fishman Healthcare Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.users} color="blue" />
          <StatCard title="Products" value={stats.products} color="green" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} color="yellow" />
          <StatCard title="Approved Pricings" value={stats.approvedPricing} color="red" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Summary Chart
          </h2>
          <div className="text-center text-gray-400 italic">[Chart Placeholder]</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-800 border-blue-300",
    green: "bg-green-50 text-green-800 border-green-300",
    yellow: "bg-yellow-50 text-yellow-800 border-yellow-300",
    red: "bg-red-50 text-red-800 border-red-300",
  };

  return (
    <div className={`rounded-xl p-5 flex flex-col items-center justify-center border shadow-sm ${colors[color]}`}>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default Dashboard;
