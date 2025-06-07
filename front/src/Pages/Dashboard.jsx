import React from 'react'

function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Orders"
     color="blue" />
            <StatCard title=" Orders In-Transit"  color="green" />
            <StatCard title="Pending Orders"  color="yellow" />
            <StatCard title="Outstanding Payments"  color="red" />
          </div>
    
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Summary Chart</h2>
            {/* <Bar
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
            /> */}
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
    
  

export default Dashboard