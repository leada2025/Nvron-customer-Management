import React from "react";
import { Bar } from "react-chartjs-2";
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

const dummyStats = {
  users: 134,
  products: 89,
  pendingOrders: 17,
  approvedPricing: 42,
};

const barData = {
  labels: ["Users", "Products", "Pending Orders", "Approved Pricing"],
  datasets: [
    {
      label: "Count",
      data: [
        dummyStats.users,
        dummyStats.products,
        dummyStats.pendingOrders,
        dummyStats.approvedPricing,
      ],
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
      borderRadius: 5,
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={dummyStats.users} color="blue" />
        <StatCard title="Products" value={dummyStats.products} color="green" />
        <StatCard
          title="Pending Orders"
          value={dummyStats.pendingOrders}
          color="yellow"
        />
        <StatCard
          title="Approved Pricing"
          value={dummyStats.approvedPricing}
          color="red"
        />
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Summary Chart</h2>
        <Bar
          data={barData}
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
    <div
      className={`rounded p-6 flex flex-col items-center justify-center shadow ${colors[color]}`}
    >
      <p className="text-sm font-semibold mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
