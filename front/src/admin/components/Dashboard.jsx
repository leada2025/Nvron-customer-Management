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

  if (loading) return <p className="p-6 text-[#0b7b7b]">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#e6f7f7] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#0b7b7b]">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Customers" value="120" color="blue" />
        <StatCard title="Sales Executives" value="8" color="green" />
        <StatCard title="Billing Executives" value="5" color="yellow" />
        <StatCard title="Total Orders" value="350" color="red" />
      </div>

      {/* Tables */}
      <div className="grid gap-6">
        <DataTable
          title="Sales Executive Performance"
          headers={["Client Name", "Region", "Customers", "Values"]}
          data={[
            ["James", "North", 20, 20],
            ["James", "South", 15, 15],
            ["James", "East", 18, 18],
            ["James", "West", 17, 17],
          ]}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <DataTable
            title="Sales Executive"
            headers={["Name", "Email"]}
            data={[
              ["John Smith", "Johnsmith123@gmail.com"],
              ["John Smith", "Johnsmith123@gmail.com"],
              ["John Smith", "Johnsmith123@gmail.com"],
              ["John Smith", "Johnsmith123@gmail.com"],
            ]}
          />
          <DataTable
            title="Billing Executive"
            headers={["Name", "Email"]}
            data={[
              ["Emily", "emily123@gmail.com"],
              ["Emily", "emily123@gmail.com"],
              ["Emily", "emily123@gmail.com"],
              ["Emily", "emily123@gmail.com"],
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-[#d0ebff] text-blue-900",
    green: "bg-[#d3f9d8] text-green-900",
    yellow: "bg-[#fff3bf] text-yellow-900",
    red: "bg-[#ffc9c9] text-red-900",
  };

  return (
    <div
      className={`rounded-xl p-6 shadow border border-[#0b7b7b]/10 flex flex-col items-center justify-center ${colors[color]}`}
    >
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function DataTable({ title, headers, data }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 overflow-x-auto border border-[#0b7b7b]/10">
      <h2 className="text-xl font-semibold text-[#0b7b7b] mb-4">{title}</h2>
      <table className="min-w-full text-sm text-left border border-[#0b7b7b]/20">
        <thead className="bg-[#f0fdfa] text-[#0b7b7b]">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 border border-[#0b7b7b]/10">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-[#0b7b7b]/10 ${
                i % 2 === 0 ? "bg-[#f8ffff]" : "bg-white"
              }`}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 border border-[#0b7b7b]/10">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
