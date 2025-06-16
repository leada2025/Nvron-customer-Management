import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get("/admin/users/dashboard-stats", {
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
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Customers" value="120" color="blue" />
        <StatCard title="Sales Executives" value="8" color="green" />
        <StatCard title="Billing Executives" value="5" color="yellow" />
        <StatCard title="Total Orders" value="350" color="red" />
      </div>

      {/* Tables */}
      <div className="grid gap-6">
        <DataTable title="Sales Executive Performance" headers={["Client Name", "Region", "Customers", "Values"]} data={[
          ["James", "North", 20, 20],
          ["James", "South", 15, 15],
          ["James", "East", 18, 18],
          ["James", "West", 17, 17],
        ]} />

        <div className="grid md:grid-cols-2 gap-6">
          <DataTable title="Sales Executive" headers={["Name", "Email"]} data={[
            ["John Smith", "Johnsmith123@gmail.com"],
            ["John Smith", "Johnsmith123@gmail.com"],
            ["John Smith", "Johnsmith123@gmail.com"],
            ["John Smith", "Johnsmith123@gmail.com"],
          ]} />
          <DataTable title="Billing Executive" headers={["Name", "Email"]} data={[
            ["Emily", "emily123@gmail.com"],
            ["Emily", "emily123@gmail.com"],
            ["Emily", "emily123@gmail.com"],
            ["Emily", "emily123@gmail.com"],
          ]} />
        </div>
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
    <div className={`rounded p-6 flex flex-col items-center justify-center shadow ${colors[color]}`}>
      <p className="text-sm font-semibold mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function DataTable({ title, headers, data }) {
  return (
    <div className="bg-white shadow rounded p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 border">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 border">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
