import React from 'react';

function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-[#0b7b7b]">Welcome to Fishman Healthcare Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Orders" value="1200" color="blue" />
        <StatCard title="Orders In-Transit" value="275" color="green" />
        <StatCard title="Pending Orders" value="85" color="yellow" />
        <StatCard title="Outstanding Payments" value="$10,000" color="red" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Summary Chart</h2>
        {/* Chart goes here */}
        <div className="text-center text-gray-400 italic">[Chart Placeholder]</div>
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
