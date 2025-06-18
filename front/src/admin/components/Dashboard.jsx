import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import {
  User,
  PackageCheck,
  Hourglass,
  BadgeDollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const role = localStorage.getItem("role")?.toLowerCase();
      const token = localStorage.getItem("token");

      try {
        const endpoint =
          role === "sales" || role === "sales executive" || role === "sale"
            ? "/admin/users/sales-dashboard-stats"
            : "/admin/users/dashboard-stats";

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (role === "sales" || role === "sales executive" || role === "sale") {
          const { assignedCustomers, orders, totalSales } = res.data;
          setStats({ assignedCustomers, orders, totalSales });
          setChartData([
            { name: "Customers", value: assignedCustomers },
            { name: "Orders", value: orders },
            { name: "Sales ₹", value: parseFloat(totalSales.toFixed(2)) },
          ]);
        } else {
          const { users, products, pendingOrders, approvedPricing } = res.data;
          setStats({ users, products, pendingOrders, approvedPricing });
          setChartData([
            { name: "Users", value: users },
            { name: "Products", value: products },
            { name: "Pending", value: pendingOrders },
            { name: "Pricings", value: approvedPricing },
          ]);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const role = localStorage.getItem("role")?.toLowerCase();

  if (loading) return <div className="p-6 text-center text-[#0b7b7b]">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-[#0b7b7b]">Dashboard</h1>
          <p className="text-sm text-[#0b7b7b]/80">Fishman Healthcare Overview</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {role === "sales" || role === "sales executive" || role === "sale" ? (
            <>
              <DashboardCard label="Assigned Customers" value={stats.assignedCustomers} icon={<User size={20} />} />
              <DashboardCard label="Orders" value={stats.orders} icon={<Hourglass size={20} />} />
              <DashboardCard
                label="Total Sales ₹"
                value={`₹${stats.totalSales.toFixed(2)}`}
                icon={<BadgeDollarSign size={20} />}
              />
            </>
          ) : (
            <>
              <DashboardCard label="Total Users" value={stats.users} icon={<User size={20} />} />
              <DashboardCard label="Products" value={stats.products} icon={<PackageCheck size={20} />} />
              <DashboardCard label="Pending Orders" value={stats.pendingOrders} icon={<Hourglass size={20} />} />
              <DashboardCard label="Approved Pricings" value={stats.approvedPricing} icon={<BadgeDollarSign size={20} />} />
            </>
          )}
        </section>

        <section className="bg-white border border-[#0b7b7b]/20 rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-[#0b7b7b] mb-4">Summary Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0b7b7b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}

function DashboardCard({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-[#0b7b7b]/20 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="p-2 rounded-full bg-[#c2efef] text-[#0b7b7b]">{icon}</div>
      <div>
        <div className="text-sm text-[#0b7b7b]/80 font-medium">{label}</div>
        <div className="text-xl font-bold text-[#0b7b7b]">{value}</div>
      </div>
    </div>
  );
}
