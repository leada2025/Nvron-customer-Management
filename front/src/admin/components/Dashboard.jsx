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

function Dashboard() {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  const role = localStorage.getItem("role")?.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-[#0b7b7b] text-center">
          Welcome to Fishman Healthcare Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {role === "sales" || role === "sales executive" || role === "sale" ? (
            <>
              <StatCard
                title="Assigned Customers"
                value={stats.assignedCustomers}
                color="blue"
                icon={<User className="w-6 h-6" />}
              />
              <StatCard
                title="Orders"
                value={stats.orders}
                color="yellow"
                icon={<Hourglass className="w-6 h-6" />}
              />
              <StatCard
                title="Total Sales ₹"
                value={`₹${stats.totalSales.toFixed(2)}`}
                color="green"
                icon={<BadgeDollarSign className="w-6 h-6" />}
              />
            </>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={stats.users}
                color="blue"
                icon={<User className="w-6 h-6" />}
              />
              <StatCard
                title="Products"
                value={stats.products}
                color="green"
                icon={<PackageCheck className="w-6 h-6" />}
              />
              <StatCard
                title="Pending Orders"
                value={stats.pendingOrders}
                color="yellow"
                icon={<Hourglass className="w-6 h-6" />}
              />
              <StatCard
                title="Approved Pricings"
                value={stats.approvedPricing}
                color="red"
                icon={<BadgeDollarSign className="w-6 h-6" />}
              />
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Summary Chart
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, bottom: 10, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0b7b7b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  const styles = {
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    green: "bg-green-50 text-green-800 border-green-200",
    yellow: "bg-yellow-50 text-yellow-800 border-yellow-200",
    red: "bg-red-50 text-red-800 border-red-200",
  };

  return (
    <div
      className={`rounded-2xl p-5 border shadow-sm flex items-center space-x-4 ${styles[color]}`}
    >
      <div className="p-3 rounded-full bg-white shadow-inner">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default Dashboard;
