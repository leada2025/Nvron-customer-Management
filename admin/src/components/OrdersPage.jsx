import React, { useState } from "react";

const sampleOrders = [
  {
    id: "ORD001",
    customer: "Acme Corp",
    date: "2025-05-25",
    totalValue: 12500,
    shippingCharged: false,
    status: "Pending",
    products: [
      { name: "ACEVIRON - P", qty: 10, price: 10.98 },
      { name: "AMLORON - 5 MG", qty: 5, price: 7.55 },
    ],
    notes: "Urgent delivery",
  },
  {
    id: "ORD002",
    customer: "Beta Ltd",
    date: "2025-05-24",
    totalValue: 9500,
    shippingCharged: true,
    status: "Processed",
    products: [
      { name: "BISORON - 2.5 MG", qty: 15, price: 9.00 },
    ],
    notes: "",
  },
  // Add more sample orders here...
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const ORDERS_PER_PAGE = 5;

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  // Paginate orders
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const markProcessed = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Processed" } : order
      )
    );
  };

  const downloadOrder = (order) => {
    // For now, just alert the order ID
    alert(`Download order ${order.id} in Zoho format`);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by customer or order ID"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-72"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processed">Processed</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-left">Order ID</th>
              <th className="p-3 border-b text-left">Customer</th>
              <th className="p-3 border-b text-left">Date</th>
              <th className="p-3 border-b text-right">Total (₹)</th>
              <th className="p-3 border-b text-center">Shipping Charged</th>
              <th className="p-3 border-b text-center">Status</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}

            {paginatedOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(order.id)}
                >
                  <td className="p-3 border-b">{order.id}</td>
                  <td className="p-3 border-b">{order.customer}</td>
                  <td className="p-3 border-b">{order.date}</td>
                  <td className="p-3 border-b text-right">{order.totalValue.toFixed(2)}</td>
                  <td className="p-3 border-b text-center">
                    {order.shippingCharged ? "Yes" : "No"}
                  </td>
                  <td className="p-3 border-b text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "Processed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 border-b text-center space-x-2">
                    {order.status === "Pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markProcessed(order.id);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Mark Processed
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadOrder(order);
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Download
                    </button>
                  </td>
                </tr>

                {/* Expanded detail row */}
                {expandedOrderId === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="p-4 text-sm text-gray-700">
                      <strong>Products Ordered:</strong>
                      <ul className="list-disc list-inside mt-1 mb-2">
                        {order.products.map((p, i) => (
                          <li key={i}>
                            {p.name} — Qty: {p.qty}, ₹{p.price.toFixed(2)} each
                          </li>
                        ))}
                      </ul>
                      {order.notes && (
                        <>
                          <strong>Notes:</strong>
                          <p className="ml-2">{order.notes}</p>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>

        <p>
          Page {currentPage} of {totalPages || 1}
        </p>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
