import React, { useState, useEffect } from "react";

// Mock orders data
const mockOrders = [
  {
    id: "ORD001",
    customerName: "ABC Corp",
    date: "2025-05-25",
    total: 12345.67,
    status: "Pending",
  },
  {
    id: "ORD002",
    customerName: "XYZ Ltd",
    date: "2025-05-24",
    total: 9876.54,
    status: "Processed",
  },
  {
    id: "ORD003",
    customerName: "Foo Bar Inc",
    date: "2025-05-23",
    total: 15000,
    status: "Pending",
  },
];

const STATUS_OPTIONS = ["All", "Pending", "Processed", "Cancelled"];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    // Replace with API call to fetch orders
    setOrders(mockOrders);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // TODO: Call backend API to update status in DB
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const downloadCSV = () => {
    // Convert filtered orders to CSV format for Zoho-compatible upload
    const headers = ["Order ID", "Customer Name", "Date", "Total", "Status"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.customerName,
      o.date,
      o.total.toFixed(2),
      o.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `orders_${filterStatus.toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Billing Team Dashboard</h1>

      <div className="mb-4 flex items-center space-x-4">
        <label htmlFor="statusFilter" className="font-medium">
          Filter by status:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          onClick={downloadCSV}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download CSV
        </button>
      </div>

      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 border-b">Order ID</th>
            <th className="px-4 py-3 border-b">Customer</th>
            <th className="px-4 py-3 border-b">Date</th>
            <th className="px-4 py-3 border-b text-right">Total (₹)</th>
            <th className="px-4 py-3 border-b">Status</th>
            <th className="px-4 py-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">{order.id}</td>
                <td className="px-4 py-3 border-b">{order.customerName}</td>
                <td className="px-4 py-3 border-b">{order.date}</td>
                <td className="px-4 py-3 border-b text-right">
                  ₹{order.total.toFixed(2)}
                </td>
                <td className="px-4 py-3 border-b">{order.status}</td>
                <td className="px-4 py-3 border-b space-x-2">
                  {order.status !== "Processed" && order.status !== "Cancelled" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "Processed")}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Mark Processed
                    </button>
                  )}
                  {order.status !== "Cancelled" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "Cancelled")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
