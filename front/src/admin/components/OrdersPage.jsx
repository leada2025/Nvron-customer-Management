import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadMenuOpenOrderId, setDownloadMenuOpenOrderId] = useState(null);


  const ORDERS_PER_PAGE = 10;

 const fetchOrders = async () => {
  try {
    setLoading(true);
    const res = await axios.get("/api/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Raw orders response:", res.data); // should be an array
    setOrders(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    setOrders([]); // fallback to empty array on error
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchOrders();
  }, []);



  const updateStatus = async (orderId, newStatus) => {
  try {
    await axios.patch(
      `/api/orders/${orderId}/status`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

const downloadOrder = (order) => {
  const header = [
    "Date",
    "Customer Name",
    "Product Name",
    "Quantity",
    "Rate",
    "Tax (%)",
    "description",
    "shippingCharge",
    "Item Total",
    "Order Total"
  ];

  const rows = order.items.map((item, index) => {
    const itemTotal = item.quantity * item.netRate * (1 + item.tax / 100);
    const isLast = index === order.items.length - 1;
    return [
      new Date(order.createdAt).toLocaleDateString(),
      order.customerId?.name || "Unknown",
      item.productName,
      item.quantity,
      item.netRate.toFixed(2),
      item.tax + "%",
      item.description,
      order.shippingCharge,
      itemTotal.toFixed(2),
      isLast ? order.totalAmount.toFixed(2) : ""
    ];
  });

  const csvContent = [header, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `order-${order._id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadPDF = (order) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Order Details", 14, 20);

  const rows = order.items.map((item) => [
    new Date(order.createdAt).toLocaleDateString(),
    order.customerId?.name || "Unknown",
    item.productName || "",
    (item.quantity || 0).toString(),
    (item.netRate || 0).toFixed(2),
    `${item.tax || 0}%`,
    item.description || "",
    (order.shippingCharge || 0).toFixed(2),
    ((item.quantity || 0) * (item.netRate || 0) * (1 + (item.tax || 0) / 100)).toFixed(2),
  ]);

  const headers = [
    [
      "Date",
      "Customer Name",
      "Product Name",
      "Qty",
      "Rate",
      "Tax (%)",
      "Description",
      "Shipping",
      "Item Total",
    ],
  ];

autoTable(doc, {
  head: headers,
  body: rows,
  startY: 30,
});


  doc.text(
    `Order Total: ₹${(order.totalAmount || 0).toFixed(2)}`,
    14,
    doc.lastAutoTable.finalY + 10
  );

  console.log("Saving PDF...");
  doc.save(`order-${order._id}.pdf`);
};

useEffect(() => {
  const handleClickOutside = () => setDownloadMenuOpenOrderId(null);
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);




const filteredOrders = Array.isArray(orders)
  ? orders.filter((order) => {
      const matchSearch =
        order.customerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "All" || order.status === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    })
  : [];

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  return (
 <div className="p-6 bg-[#f9f9fb] rounded-lg shadow-sm border border-gray-200 max-w-7xl mx-auto">
  <h2 className="text-3xl font-medium text-gray-800 mb-6">Sales Orders</h2>


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
          <option value="pending">Pending</option>
          <option value="Processed">Processed</option>
           <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-sm  bg-white rounded-md overflow-hidden">
  <thead className="bg-[#f1f3f6] text-gray-600">
            <tr>
              <th className="p-3 border-b border-gray-300 text-left">Order ID</th>
              <th className="p-3 border-b border-gray-300 text-left">Customer</th>
              <th className="p-3 border-b border-gray-300 text-left">Date</th>
              <th className="p-3 border-b border-gray-300 text-right">Total (₹)</th>
              <th className="p-3 border-b border-gray-300 text-center">Shipping</th>
              <th className="p-3 border-b border-gray-300 text-center">Status</th>
              <th className="p-3 border-b border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  Loading orders...
                </td>
              </tr>
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    className=" hover:bg-gray-50"
                    
                  >
                    <td className="p-3 border-b border-gray-300">{order._id}</td>
                    <td className="p-3 border-b border-gray-300">
                      {order.customerId?.name || "Unknown"}
                    </td>
                    <td className="p-3 border-b border-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 border-b border-gray-300 text-right">
                      {order.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3 border-b border-gray-300 text-center">
                      {order.shippingCharge > 0 ? "Yes" : "No"}
                    </td>
                    <td className="p-3 border-b border-gray-300 text-center">
                 <div className="flex flex-col items-center gap-1">
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
    ${
      order.status === "processing"
        ? "bg-blue-100 text-blue-700"
        : order.status === "delivered"
        ? "bg-green-100 text-green-700"
        : order.status === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}>
    {order.status}
  </span>
  <select
    value={order.status}
    onChange={(e) => updateStatus(order._id, e.target.value)}
    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
  >
    <option value="pending">Pending</option>
    <option value="processing">Processing</option>
    <option value="delivered">Delivered</option>
    <option value="cancelled">Cancelled</option>
  </select>
</div>

                    </td>
                   <td className="p-3 border-b border-gray-300 text-center space-x-2">
  <div className="relative inline-block text-left">
   <button
  onClick={(e) => {
    e.stopPropagation();
    setDownloadMenuOpenOrderId(
      downloadMenuOpenOrderId === order._id ? null : order._id
    );
  }}
  className="px-4 py-1.5 bg-gray-600 text-white rounded-md text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
>
  Download ▼
</button>

{downloadMenuOpenOrderId === order._id && (
  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-30">
    <button
      onClick={() => {
        downloadOrder(order);
        setDownloadMenuOpenOrderId(null);
      }}
      className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
    >
      Download CSV
    </button>
    <button
      onClick={() => {
        downloadPDF(order);
        setDownloadMenuOpenOrderId(null);
      }}
      className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
    >
      Download PDF
    </button>
  </div>
)}

  </div>
</td>

                  </tr>

                  {/* Expanded row */}
                  {expandedOrderId === order._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="p-4 text-sm text-gray-700">
                        <strong>Products Ordered:</strong>
                        <ul className="list-disc list-inside mt-1 mb-2">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.productName} — Qty: {item.quantity}, ₹
                              {item.unitPrice.toFixed(2)} each
                            </li>
                          ))}
                        </ul>
                        {order.note && (
                          <>
                            <strong>Note:</strong>
                            <p className="ml-2">{order.note}</p>
                          </>
                        )}
                        {order.feedback && (
                          <p className="text-red-600">
                            Cancellation Feedback: {order.feedback}
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                       {order.status.toLowerCase() === "cancelled" && order.feedback && (
  <tr>
    <td colSpan="7" className="px-4 py-2 bg-red-50 text-red-600 text-sm border-b">
      <strong>Feedback:</strong> {order.feedback}
    </td>
  </tr>
)}

                </React.Fragment>
              ))
            )}
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
