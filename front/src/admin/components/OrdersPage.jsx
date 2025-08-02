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
  const [shippingInputs, setShippingInputs] = useState({});



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
const downloadZohoCompatibleOrder = async (order) => {
  const headers = [
    "SalesOrder Number", "Order Date", "Expected Shipment Date", "Status", "Notes",
    "Terms & Conditions", "GST Treatment", "GST Identification Number (GSTIN)",
    "Currency Code", "Exchange Rate", "Reference#", "Template Name", "Sales person",
    "Adjustment", "Adjustment Description", "Delivery Method", "Discount Type",
    "Is Discount Before Tax", "Entity Discount Percent", "Attachment IDs",
    "Entity Discount Amount", "Total", "Payment Terms", "Payment Terms Label",
    "Place of Supply", "Customer Name", "Is Inclusive Tax",
    "Reverse Charge Tax Name", "Reverse Charge Tax Rate", "Reverse Charge Tax Type",
    "TDS Name", "TDS Percentage", "TDS Section Code", "TDS Amount",
    "Item TDS Name", "Item TDS Percentage", "Item TDS Section Code",
    "TCS Tax Name", "TCS Percentage", "Nature Of Collection", "TCS Amount",
    "Shipping Charge", "Shipping Charge Tax Name", "Shipping Charge Tax Type",
    "Shipping Charge Tax %", "Shipping Charge Tax Exemption Code", "Shipping Charge SAC Code",
    "MRP", "PTR", "PTS", "Net Rate", "Item Price",
    "Usage unit", "Item Desc", "Item Name", "HSN/SAC", "Quantity",
    "Kit Combo Item Name", "Discount", "Discount Amount",
    "Item Tax", "Item Tax Type", "Item Tax %", "Item Tax Exemption Reason",
    "Item Type", "Supply Type", "Project Name"
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  // ✅ Round UP to 2 decimals like Zoho (e.g., 43.8842 => 43.89)
  const safe = (val) => {
    if (typeof val !== "number") return "0.00";
    return (Math.ceil(val * 100) / 100).toFixed(2);
  };

  const taxNameMap = (tax, isIGST) => {
    if (isIGST) {
      if (tax === 5) return "IGST5";
      if (tax === 12) return "IGST12";
      if (tax === 18) return "IGST18";
      if (tax === 28) return "IGST28";
    } else {
      if (tax === 5) return "GST5";
      if (tax === 12) return "GST12";
      if (tax === 18) return "GST18";
      if (tax === 28) return "GST28";
    }
    return "GST0";
  };

  // Fetch latest product data
  let latestProducts = [];
  try {
    const res = await axios.get("/api/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    latestProducts = res.data;
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return alert("Failed to fetch latest product pricing.");
  }

  const productMap = {};
  latestProducts.forEach(p => {
    productMap[p._id] = p;
  });

  const orderDate = formatDate(order.createdAt);
  const expectedShipmentDate = formatDate(new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000);
  const customer = order.customerId || {};
  const customerName = customer.name || "Unnamed";
  const gstin = customer.gstin || "";
  const placeOfSupply = customer.placeOfSupply || "TN";
  const isIGST = placeOfSupply !== "TN";
  const position = customer.position?.toLowerCase() || "doctor";
  const currencyCode = "INR";

  const getItemPrice = (item) =>
    position === "retailer" ? safe(item.ptr ?? item.netRate) :
    position === "distributor" ? safe(item.pts ?? item.netRate) :
    safe(item.netRate);

  const rows = order.items.map((item, index) => {
    const latest = productMap[item.productId] || {};
    const tax = item.tax ?? 0;
    const itemTaxName = taxNameMap(tax, isIGST);

    const isTaxGroup = itemTaxName.startsWith("GST");
    const taxType = isTaxGroup ? "Tax Group" : "ItemAmount";
    const taxPercent = tax.toString();

    return [
      order._id, orderDate, expectedShipmentDate, "draft",
      order.note || "Looking forward to your business.",
      "100% ADVANCE PAYMENT",
      gstin ? "business_gst" : "consumer", gstin, currencyCode,
      "1", "", "Standard Template", order.salesPerson || "", "0", "",
      "TRANSPORT TO PAY", "item_level", "TRUE", "0", "", "0",
      safe(order.totalAmount), "0", "Standard Terms", placeOfSupply,
      customerName, "FALSE", "", "", "", "", "", "", "", "", "", "", "", "", "", "",

      // Shipping fields
      index === 0 ? safe(order.shippingCharge) : "",
      index === 0 ? "" : "",
      index === 0 ? "" : "",
      index === 0 ? "" : "",
      index === 0 ? "" : "",
      index === 0 ? "996511" : "",

      // MRP, PTR, PTS, Net Rate, Final Price
      safe(latest.mrp), safe(latest.ptr), safe(latest.pts), safe(latest.netRate),
      safe(item.netRate),

      item.unit || "St", item.description || "", item.productName || "Unnamed Product",
      "30049066", item.quantity || 1,

      "", "0", "0",

      itemTaxName, taxType, taxPercent,
      "", "goods", "Taxable", ""
    ];
  });

  const csv = [headers, ...rows]
    .map(row =>
      row
        .map(val => `"${(val || "").toString().replace(/"/g, '""')}"`)
        .join(",")
    )
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

const handleShippingChange = (orderId, value) => {
  setShippingInputs((prev) => ({
    ...prev,
    [orderId]: value,
  }));
};

const updateShippingCharge = async (orderId) => {
  const shippingCharge = parseFloat(shippingInputs[orderId]);

  if (isNaN(shippingCharge)) {
    alert("Please enter a valid shipping amount.");
    return;
  }

  try {
    const response = await axios.put(
      `/api/orders/${orderId}/shipping`,
      { shippingCharge }, // Body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // or 'token' if that’s what you use
        },
      }
    );

    // Update local state with updated order
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? response.data.order : order
      )
    );

    alert("Shipping charge updated!");
  } catch (error) {
    console.error("Failed to update shipping:", error);
    alert("Failed to update shipping charge.");
  }
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
const userId = localStorage.getItem("userId")?.toString();

const filteredOrders = Array.isArray(orders)
  ? orders
      .filter((order) => {
        if (userRole === "admin" || userRole === "billing") return true;

        if (userRole === "sales") {
          const assignedTo = order.customerId?.assignedTo?._id?.toString();
          const assignedBy = order.customerId?.assignedBy?._id?.toString();

          return (
            assignedTo === userId ||
            (!assignedTo && assignedBy === userId)
          );
        }

        return false;
      })
      .filter((order) => {
        const matchSearch =
          order.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus =
          statusFilter === "All" ||
          order.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchSearch && matchStatus;
      })
  : [];

const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

const paginatedOrders = filteredOrders.slice(
  (currentPage - 1) * ORDERS_PER_PAGE,
  currentPage * ORDERS_PER_PAGE
);
  return (
 <div className="p-6 bg-[#e6f7f7] z-1  rounded-lg shadow-sm border border-gray-200 max-w-7xl mx-auto">
  <h2 className="text-3xl z-1 font-medium text-[#0b7b7b] mb-6">Sales Orders</h2>


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
      <table className="w-full border  border-gray-300 text-sm  bg-white rounded-md ">
  <thead className="bg-[#e6f7f7] text-gray-600">
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
  <div className="flex flex-col items-center gap-1">
    <input
      type="number"
      value={shippingInputs[order._id] ?? order.shippingCharge ?? ""}
      onChange={(e) => handleShippingChange(order._id, e.target.value)}
      className="border px-2 py-1 w-20 rounded text-sm"
      placeholder="₹"
    />
    <button
      onClick={() => updateShippingCharge(order._id)}
      className="text-xs mt-1 px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Save
    </button>
  </div>
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
<div className="relative inline-block text-left z-30">


   <button
  onClick={(e) => {
    e.stopPropagation();
    setDownloadMenuOpenOrderId(
      downloadMenuOpenOrderId === order._id ? null : order._id
    );
  }}
  className="px-4 py-1.5 z-10 bg-gray-600 text-white rounded-md text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
>
  Download ▼
</button>

{downloadMenuOpenOrderId === order._id && (
 <div className="absolute z-9999 right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-50">


<button
  onClick={() => {
    downloadZohoCompatibleOrder(order);
    setDownloadMenuOpenOrderId(null);
  }}
  className="block w-full px-4 py-2 text-left z-999 hover:bg-gray-100 text-sm"
>
  Download Zoho CSV
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
