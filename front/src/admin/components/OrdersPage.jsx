import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import base64Image from "../../../public/baseImage";


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
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
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


const downloadZohoCompatibleOrder = (order) => {
  const headers = [
    "Expected Shipment Date",
    "SalesOrder Number",
    "Order Date", // ✅ Added missing Order Date
    "Status",
    "Customer Name",
    "PurchaseOrder",
    "Template Name",
    "Currency Code",
    "Place of Supply",
    "GST Treatment",
    "GST Identification Number (GSTIN)",
    "Exchange Rate",
    "Discount Type",
    "Is Discount Before Tax",
    "Entity Discount Percent",
    "Item Name",
    "HSN/SAC",
    "SKU",
    "Item Desc",
    "Quantity",
    "Usage unit",
    "Warehouse Name",
    "Item Price",
    "Is Inclusive Tax",
    "Discount",
    "Item Tax",
    "Item Tax %",
    "Item Tax Type",
    "Item Tax Exemption Reason",
    "Item Type",
    "Project Name",
    "Shipping Charge Tax Name",
    "Shipping Charge Tax Type",
    "Shipping Charge Tax %",
    "Shipping Charge",
    "Shipping Charge Tax Exemption Code",
    "Shipping Charge SAC Code",
    "Adjustment",
    "Adjustment Description",
    "Reverse Charge Tax Name",
    "Reverse Charge Tax Rate",
    "Reverse Charge Tax Type",
    "Supply Type",
    "Sales person",
    "Notes",
    "Terms & Conditions",
    "Delivery Method"
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const taxNameMap = (tax) => {
    if (tax === 18) return "IGST18";
    if (tax === 12) return "IGST12";
    if (tax === 5) return "IGST5";
    return "";
  };

  const expectedShipmentDate = formatDate(new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000);
  const orderDate = formatDate(order.createdAt);
  const customerName = order.customerId?.name || "Unnamed";
  const gstin = order.customerId?.gstin || "";
  const placeOfSupply = order.customerId?.placeOfSupply || "TN";

  const rows = order.items.map((item, index) => {
    const taxName = taxNameMap(item.tax);
    return [
      expectedShipmentDate,                      // Expected Shipment Date
      order._id,                                 // SalesOrder Number
      orderDate,                                 // ✅ Order Date
      order.status || "draft",                   // Status
      customerName,                              // Customer Name
      "",                                        // PurchaseOrder
      "Standard Template",                       // Template Name
      "INR",                                     // Currency Code
      placeOfSupply,                             // Place of Supply
      gstin ? "business_gst" : "consumer",       // GST Treatment
      gstin,                                     // GSTIN
      "1",                                       // Exchange Rate
      "item_level",                              // Discount Type
      "TRUE",                                    // Is Discount Before Tax
      "0",                                       // Entity Discount Percent
      item.productName || "Unnamed Product",     // Item Name
      item.hsn || "",                            // HSN/SAC
      "",                                        // SKU
      item.description || "",                    // Item Desc
      item.quantity || 1,                        // Quantity
      item.unit || "St",                         // Usage unit (default St)
      "Main",                                    // Warehouse Name
      item.netRate?.toFixed(2) || "0",           // Item Price
      "FALSE",                                   // Is Inclusive Tax
      "0",                                       // Discount
      taxName,                                   // Item Tax Name
      item.tax || "",                            // Item Tax %
      "ItemAmount",                              // Item Tax Type
      "",                                        // Item Tax Exemption Reason
      "goods",                                   // Item Type
      "",                                        // Project Name
      taxName,                                   // Shipping Charge Tax Name
      "IGST",                                    // Shipping Charge Tax Type
      item.tax || "",                            // Shipping Charge Tax %
      index === 0 ? (order.shippingCharge?.toFixed(2) || "0") : "", // Shipping Charge (only on 1st row)
      "",                                        // Shipping Tax Exemption
      "996812",                                  // Shipping SAC
      "0",                                       // Adjustment
      "",                                        // Adjustment Description
      "", "", "",                                // Reverse Charge Tax Details
      "Taxable",                                 // Supply Type
      order.salesPerson || "",                   // Sales Person
      order.note || "Looking forward to your business.", // Notes
      "100% ADVANCE PAYMENT",                    // Terms & Conditions
      "TRANSPORT TO PAY"                         // Delivery Method
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map((val) => `"${val}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `zoho-sales-order-${order._id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



const downloadPDF = async (order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const logoWidth = 70;
  const logoHeight = 25;
  let y = 14;

  const position = order.customerId?.position?.toLowerCase();
  const rateLabel =
    position === "retailer"
      ? "PTR"
      : position === "distributor"
      ? "PTS"
      : "Net Rate";
  const rateField =
    position === "retailer"
      ? "ptr"
      : position === "distributor"
      ? "pts"
      : "netRate";

  // 🔄 1. Fetch latest MRP from server for each item
  const updatedItems = await Promise.all(
    order.items.map(async (item) => {
      try {
        const { data } = await axios.get(`/api/products/${item.productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return {
          ...item,
          latestMrp: data.mrp ?? 0, // fallback if undefined
        };
      } catch (err) {
        console.error(`Failed to fetch product ${item.productId}:`, err);
        return {
          ...item,
          latestMrp: 0,
        };
      }
    })
  );

  // Header with Logo and Title
  doc.addImage(base64Image, "PNG", 14, y, logoWidth, logoHeight);
  doc.setFontSize(26).setFont(undefined, "normal");
  doc.text("SALES ORDER", pageWidth - 14, y + 10, { align: "right" });
  doc.setFontSize(10);
  doc.text(`Sales Order# ${order._id}`, pageWidth - 14, y + 18, { align: "right" });

  // Company Info
  y += logoHeight + 6;
  doc.setFontSize(10).setFont(undefined, "bold").text("Fishman Healthcare", 14, y);
  doc.setFontSize(9).setFont(undefined, "normal");
  const address = [
    "B2 VM TOWER SELVAKUMARASAMY GARDEN, DEIVANAYAGI NAGAR",
    "DEIVANAYAGI NAGAR, GANAPATHY PO",
    "COIMBATORE, Tamil Nadu - 641006, India",
    "Phone: 7904389003",
    "E-mail: fishmancbe@gmail.com",
    "GSTIN: 33BYXPS5432E2Z0",
    "TN-10-20-00684 / TN-10-20B-00386 / TN-10-21-00684 / TN-10-21B-00386",
    "PAN: BYXPS5432E | FSSAI No: 22420558000267",
  ];
  address.forEach((line) => doc.text(line, 14, (y += 6)));

// Billing Info
y += 10;
doc.setFont(undefined, "bold").text("Bill To", 14, (y += 5));
doc.setFont(undefined, "normal");
const billTo = [
  order.customerId?.name || "",
  order.customerId?.address || "",
  "India",
  order.customerId?.gstin ? `GSTIN: ${order.customerId.gstin}` : "",
];
billTo.forEach((line) => doc.text(line, 14, (y += 5)));

// ✅ Order Date and Delivery Method
doc.setFont(undefined, "bold").text("Order Date:", 160, y-4, { align: "right" });
doc.setFont(undefined, "normal").text(new Date(order.createdAt).toLocaleDateString(), 195, y-4, { align: "right" });

doc.setFont(undefined, "bold").text("Delivery Method:", 160, y+=2, { align: "right" });
doc.setFont(undefined, "normal").text("TRANSPORT TO PAY", 195, y, { align: "right" });

  // Table Setup
  y += 5;
  const head = [["#", "Product", "MRP", rateLabel, "HSN", "Qty", "Rate", "Amount"]];
  const itemRows = updatedItems.map((item, idx) => {
    const rate = item[rateField] ?? 0;
    const amount = item.quantity * rate;
    return [
      idx + 1,
      item.productName || "-",
      `₹${item.latestMrp.toFixed(2)}`,
      `₹${rate.toFixed(2)}`,
      item.hsn || "-",
      item.quantity,
      `₹${rate.toFixed(2)}`,
      `₹${amount.toFixed(2)}`,
    ];
  });

 autoTable(doc, {
  startY: y,
  head: [["#", "Product", "MRP", rateLabel, "HSN", "Qty", "Rate", "Amount"]],
  body: itemRows,
foot: [
  [
    { content: "", colSpan: 5 ,styles: { halign: "right", fontStyle: "bold",fillColor:255,textColor:0}}, // Skip columns 1-5
    { content: "Sub Total", colSpan: 2, styles: { halign: "right", fontStyle: "bold",fillColor:255,textColor:0 } },
    { content: `₹${order.subtotal.toFixed(2)}`, styles: { halign: "left",fillColor:255,textColor:0 } },
  ],
],
  styles: {
    fontSize: 9,
    cellPadding: { top: 4, bottom: 4, left: 2, right: 2 },
    lineWidth: 0.1,
    lineColor: [200, 200, 200],
  },
  headStyles: {
    fillColor: [49, 52, 51],
    textColor: 255,
  },
  theme: "grid",
  didParseCell: (data) => {
    data.cell.styles.lineWidth = { top: 0, right: 0, bottom: 0.1, left: 0 };
  },
});


  // Summary Section (same as before)
  let summaryY = doc.lastAutoTable.finalY + 10;
  if (summaryY + 40 > pageHeight) {
    doc.addPage();
    summaryY = 20;
  }

  order.taxBreakup?.forEach((tax) => {
    doc.text(tax.label, pageWidth - 60, summaryY);
    doc.text(`&#8377;${tax.amount.toFixed(2)}`, pageWidth - 20, summaryY, { align: "right" });
    summaryY += 6;
  });

  doc.text("Shipping charge", pageWidth - 70, summaryY+=5);
  doc.text(`₹${order.shippingCharge.toFixed(2)}`, pageWidth - 30, summaryY, { align: "right" });
  summaryY += 6;

  if (order.roundOff) {
    doc.text("ROUND OFF", pageWidth - 70, summaryY+=5);
    doc.text(`₹${order.roundOff.toFixed(2)}`, pageWidth - 30, summaryY, { align: "right" });
    summaryY += 6;
  }

  doc.text("Total", pageWidth - 70, summaryY+=5);
  doc.text('\u20B9'+`${order.totalAmount.toFixed(2)}`, pageWidth - 30, summaryY, { align: "right" });

  summaryY += 15;
  if (summaryY + 40 > pageHeight) {
    doc.addPage();
    summaryY = 20;
  }

  doc.setFontSize(9).setFont(undefined, "normal");
  doc.text("Notes:", 14, summaryY);
  doc.text("STOCKS DISPATCH VIA TRANSPORT. TO PAY BASIS", 14, summaryY + 5);
  doc.text("Terms & Conditions:", 14, summaryY + 15);
  doc.text("100% ADVANCE PAYMENT", 14, summaryY + 20);
  doc.text("Authorized Signature ____________________________", 14, summaryY + 30);

  doc.save(`sales-order-${order._id}.pdf`);
};


useEffect(() => {
  const handleClickOutside = () => setDownloadMenuOpenOrderId(null);
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);





  const userRole = localStorage.getItem("role")?.toLowerCase();
  const userId = localStorage.getItem("userId");

  const filteredOrders = Array.isArray(orders)
    ? orders
        .filter((order) => {
          if (userRole === "admin" || userRole === "billing") return true;
          if (userRole === "sales") {
            const assignedTo = order.customerId?.assignedTo?._id;
            const assignedBy = order.customerId?.assignedBy?._id;
            return assignedTo === userId || (!assignedTo && assignedBy === userId);
          }
          return false;
        })
        .filter((order) => {
          const matchSearch =
            order.customerId?.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
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
 <div className="p-6 bg-[#e6f7f7] rounded-lg shadow-sm border border-gray-200 max-w-7xl mx-auto">
      <h2 className="text-3xl font-medium text-gray-800 mb-6">Sales Orders</h2>

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

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm bg-white rounded-md overflow-hidden">
          <thead className="bg-[#e6f7f7] text-gray-600">
            <tr>
              <th className="p-3 border-b border-gray-300 text-left">Order ID</th>
              <th className="p-3 border-b border-gray-300 text-left">Customer</th>
              <th className="p-3 border-b border-gray-300 text-left">Assigned To / By</th>
              <th className="p-3 border-b border-gray-300 text-left">Date</th>
              <th className="p-3 border-b border-gray-300 text-right">Total (₹)</th>
              <th className="p-3 border-b border-gray-300 text-center">Shipping</th>
              <th className="p-3 border-b border-gray-300 text-center">Status</th>
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
                <tr key={order._id}>
                  <td className="p-3 border-b border-gray-300">{order._id}</td>
                  <td className="p-3 border-b border-gray-300">{order.customerId?.name}</td>
                  <td className="p-3 border-b border-gray-300">
                    {
                      order.customerId?.assignedTo?.name ||
                      order.customerId?.assignedBy?.name ||
                      "Unassigned"
                    }
                  </td>
                  <td className="p-3 border-b border-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-right">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-center">
                    {order.shippingCharge > 0 ? "Yes" : "No"}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-center">
                    <span className="capitalize text-xs px-2 py-1 rounded bg-gray-200">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
