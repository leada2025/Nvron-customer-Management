import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "../api/Axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role?.toLowerCase();
  const isSales = ["sales", "sale", "sales executive"].includes(role);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const endpoint = isSales
          ? "/admin/users/sales-dashboard-stats"
          : "/admin/users/dashboard-stats";

        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [isSales]);

  const adminBarData = {
    labels: ["Users", "Products", "Pending Orders", "Approved Pricing"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.users || 0,
          stats.products || 0,
          stats.pendingOrders || 0,
          stats.approvedPricing || 0,
        ],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
        borderRadius: 5,
      },
    ],
  };

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {isSales ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard title="Assigned Customers" value={stats.assignedCustomers} color="blue" />
          <StatCard title="Orders" value={stats.orders} color="green" />
          <StatCard
            title="Total Sales (₹)"
            value={stats.totalSales?.toFixed(2) || "0.00"}
            color="red"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.users} color="blue" />
            <StatCard title="Products" value={stats.products} color="green" />
            <StatCard title="Pending Orders" value={stats.pendingOrders} color="yellow" />
            <StatCard title="Approved Pricing" value={stats.approvedPricing} color="red" />
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Summary Chart</h2>
            <Bar
              data={adminBarData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, precision: 0 },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };
  return (
    <div className={`rounded p-6 flex flex-col items-center justify-center shadow ${colors[color]}`}>
      <p className="text-sm font-semibold mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
