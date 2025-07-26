import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Select, InputLabel, FormControl
} from "@mui/material";

export default function PriceRequest() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [rates, setRates] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
const [pendingPage, setPendingPage] = useState(0);
const itemsPerPage = 50;

const [historyPage, setHistoryPage] = useState(0);
const [historySearchTerm, setHistorySearchTerm] = useState("");


const [searchTerm, setSearchTerm] = useState("");

  const [newRequestOpen, setNewRequestOpen] = useState(false);
const [customers, setCustomers] = useState([]);
const [products, setProducts] = useState([]);
const [newRequestData, setNewRequestData] = useState({
  customerId: "",
  productId: "",
  approvedPrice: "",
  comment: ""
});


const fetchAll = async () => {
  setLoading(true);
  try {
    const [pendingRes, approvedRes, allRes, customersRes, productsRes] = await Promise.all([
      axios.get("/api/negotiations/pending", { headers }),
      axios.get("/api/negotiations/approved", { headers }),
      axios.get("/api/negotiations", { headers }),
      axios.get("/admin/users?onlyRole=Customer", { headers }),
      axios.get("/api/products", { headers })
    ]);
    setPending(pendingRes.data);
    setApproved(approvedRes.data);
    setAllRequests(allRes.data);
    setCustomers(customersRes.data);
    setProducts(productsRes.data);
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAll();
}, []);




  const handleRateChange = (id, value) => {
    setRates((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  const doApprove = async (id) => {
    const rate = rates[id];
    const comment = comments[id] || "";

    if (!rate || isNaN(rate)) return alert("Enter a valid proposed rate");

    try {
      await axios.put(
        `/api/negotiations/${id}/propose`,
        { proposedRate: rate },
        { headers }
      );
      await axios.patch(
        `/api/negotiations/approve/${id}`,
        { comment },
        { headers }
      );
      alert("Approved successfully");
      fetchAll();
    } catch (err) {
      console.error("Approve error:", err);
      alert("Failed to approve");
    }
  };

  const doReject = async (id) => {
    const comment = comments[id];
    try {
      await axios.patch(
        `/api/negotiations/reject/${id}`, // 🔥 endpoint must set status to "rejected"
        { comment },
        { headers }
      );
      alert("Rejected successfully");
      fetchAll();
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject");
    }
  };

  const doReopen = async (id) => {
    try {
      await axios.patch(`/api/negotiations/reopen/${id}`, {}, { headers });
      alert("Reopened successfully");
      fetchAll();
    } catch (err) {
      console.error("Reopen error:", err);
      alert("Failed to reopen");
    }
  };

  const historyMap = new Map();
  [...approved, ...allRequests].forEach((item) => {
    historyMap.set(item._id, item);
  });

const fullHistory = Array.from(historyMap.values())
  .filter((r) => !["pending", "proposed"].includes(r.status))
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const filteredHistory = fullHistory.filter((item) => {
  const customer = item.customerId?.name?.toLowerCase() || "";
  const product = item.productId?.name?.toLowerCase() || "";
  return (
    customer.includes(historySearchTerm.toLowerCase()) ||
    product.includes(historySearchTerm.toLowerCase())
  );
});

const historyItemsPerPage = 10;
const paginatedHistory = filteredHistory.slice(
  historyPage * historyItemsPerPage,
  (historyPage + 1) * historyItemsPerPage
);
const historyTotalPages = Math.ceil(filteredHistory.length / historyItemsPerPage);


  if (loading)
    return (
      <Box className="p-10 bg-[#f7f9fa] min-h-screen text-center">
        <CircularProgress />
      </Box>
    );

    const filteredPending = pending.filter((req) => {
  const customer = req.customerId?.name?.toLowerCase() || "";
  const product = req.productId?.name?.toLowerCase() || "";
  return (
    customer.includes(searchTerm.toLowerCase()) ||
    product.includes(searchTerm.toLowerCase())
  );
});

const paginatedPending = filteredPending.slice(
  pendingPage * itemsPerPage,
  (pendingPage + 1) * itemsPerPage
);

const totalPages = Math.ceil(filteredPending.length / itemsPerPage);


  return (
    <Box className="bg-[#f7f9fa] min-h-screen p-6">
      <Box className="max-w-6xl mx-auto space-y-10">
        {/* Pending Section */}
        <Box>
      <div className="flex justify-end mb-4">
  <button
    onClick={() => setNewRequestOpen(true)}
    className="bg-[#0b7b7b] text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-[#095e5e] transition"
  >
    + Special rate
  </button>
</div>


<Box className="flex justify-between items-center mb-4">
  <TextField
    size="small"
    label="Search Customer/Product"
    variant="outlined"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setPendingPage(0); // reset to first page on search
    }}
    sx={{
      backgroundColor: "white",
      borderRadius: 2,
      width: 300,
      "& label.Mui-focused": {
        color: "#095e5e",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#095e5e",
        },
        "&:hover fieldset": {
          borderColor: "#095e5e",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#095e5e",
        },
      },
    }}
  />

  <div className="flex items-center space-x-2">
    <Button
      size="small"
      disabled={pendingPage === 0}
      onClick={() => setPendingPage((p) => Math.max(p - 1, 0))}
      sx={{
        color: "#095e5e",
        border: "1px solid #095e5e",
        borderRadius: "6px",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#e0f5f5",
        },
      }}
    >
      Prev
    </Button>
    <span style={{ color: "#095e5e" }}>
      Page {pendingPage + 1} of {totalPages}
    </span>
    <Button
      size="small"
      disabled={pendingPage + 1 >= totalPages}
      onClick={() => setPendingPage((p) => p + 1)}
      sx={{
        color: "#095e5e",
        border: "1px solid #095e5e",
        borderRadius: "6px",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#e0f5f5",
        },
      }}
    >
      Next
    </Button>
  </div>
</Box>



          <Typography variant="h5" className="text-[#0b7b7b] font-semibold">
            Pending Negotiations
          </Typography>
          <Paper className="overflow-x-auto mt-4 rounded-xl shadow bg-white">
            <Table size="small">
              <TableHead>
                <TableRow className="bg-[#e0f7f7] text-[#0b7b7b]">
                  <TableCell>Customer</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>MRP</TableCell>
                  <TableCell>Requested</TableCell>
                  <TableCell>Proposed Rate</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
               {paginatedPending.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>{req.customerId?.name}</TableCell>
                    <TableCell>{req.productId?.name}</TableCell>
                    <TableCell>₹{req.productId?.mrp}</TableCell>
                    <TableCell>₹{req.proposedPrice}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={rates[req._id] || ""}
                        onChange={(e) =>
                          handleRateChange(req._id, e.target.value)
                        }
                        sx={{ width: 90 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="Comment"
                        value={comments[req._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(req._id, e.target.value)
                        }
                        sx={{ width: 150 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => doApprove(req._id)}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => doReject(req._id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedPending.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No pending requests
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>

       {/* History Section */}
<Box className="flex justify-between items-center mb-4 mt-10">
  <TextField
    size="small"
    label="Search Customer/Product"
    variant="outlined"
    value={historySearchTerm}
    onChange={(e) => {
      setHistorySearchTerm(e.target.value);
      setHistoryPage(0); // reset to first page on search
    }}
    sx={{
      backgroundColor: "white",
      borderRadius: 2,
      width: 300,
      "& label.Mui-focused": {
        color: "#095e5e",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#095e5e",
        },
        "&:hover fieldset": {
          borderColor: "#095e5e",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#095e5e",
        },
      },
    }}
  />

  <div className="flex items-center space-x-2">
    <Button
      size="small"
      disabled={historyPage === 0}
      onClick={() => setHistoryPage((p) => Math.max(p - 1, 0))}
      sx={{
        color: "#095e5e",
        border: "1px solid #095e5e",
        borderRadius: "6px",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#e0f5f5",
        },
      }}
    >
      Prev
    </Button>
    <span style={{ color: "#095e5e" }}>
      Page {historyPage + 1} of {historyTotalPages}
    </span>
    <Button
      size="small"
      disabled={historyPage + 1 >= historyTotalPages}
      onClick={() => setHistoryPage((p) => p + 1)}
      sx={{
        color: "#095e5e",
        border: "1px solid #095e5e",
        borderRadius: "6px",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#e0f5f5",
        },
      }}
    >
      Next
    </Button>
  </div>
</Box>


        <Box>
          <Typography variant="h5" className="text-[#0b7b7b] font-semibold">
            Negotiation History
          </Typography>
          <Paper className="overflow-x-auto mt-4 rounded-xl shadow bg-white">
            <Table size="small">
              <TableHead>
                <TableRow className="bg-[#e0f7f7] text-[#0b7b7b]">
                  <TableCell>Customer</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Requested</TableCell>
                  <TableCell>Proposed</TableCell>
                  <TableCell>Approved</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHistory.map((item) => (

                  <TableRow key={item._id}>
                    <TableCell>{item.customerId?.name || "-"}</TableCell>
                    <TableCell>{item.productId?.name || "-"}</TableCell>
                    <TableCell className="capitalize">{item.status}</TableCell>
                    <TableCell>₹{item.proposedPrice}</TableCell>
                    <TableCell>
                      {item.salesProposedRate
                        ? `₹${item.salesProposedRate}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.approvedPrice ? `₹${item.approvedPrice}` : "-"}
                    </TableCell>
                    <TableCell>{item.comment || "-"}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {["approved", "rejected"].includes(item.status) && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => doReopen(item._id)}
                        >
                          Reopen
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedHistory.length === 0 && (

                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No history available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
      <Dialog
  open={newRequestOpen}
  onClose={() => setNewRequestOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      backgroundColor: "white",
      border: "1px solid #0b7b7b33",
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: "white",
      color: "#0b7b7b",
      fontWeight: "bold",
      fontSize: "1.2rem",
      pb: 1.5,
    }}
  >
    Create & Approve New Request
  </DialogTitle>

  <DialogContent sx={{ pt: 2 }}>
    <FormControl fullWidth size="small" margin="normal" sx={{ backgroundColor: "white", borderRadius: 2 }}>
      <InputLabel>Customer</InputLabel>
      <Select
        value={newRequestData.customerId}
        onChange={(e) => setNewRequestData({ ...newRequestData, customerId: e.target.value })}
        label="Customer"
      >
        {customers.map((c) => (
          <MenuItem key={c._id} value={c._id}>
            {c.name} ({c.email})
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small" margin="normal" sx={{ backgroundColor: "white", borderRadius: 2 }}>
      <InputLabel>Product</InputLabel>
      <Select
        value={newRequestData.productId}
        onChange={(e) => setNewRequestData({ ...newRequestData, productId: e.target.value })}
        label="Product"
      >
        {products.map((p) => (
          <MenuItem key={p._id} value={p._id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      label="Approved Price (₹)"
      fullWidth
      size="small"
      type="number"
      value={newRequestData.approvedPrice}
      onChange={(e) => setNewRequestData({ ...newRequestData, approvedPrice: e.target.value })}
      margin="normal"
      sx={{ backgroundColor: "white", borderRadius: 2 }}
    />

   
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setNewRequestOpen(false)}
      sx={{
        color: "#0b7b7b",
        borderColor: "#0b7b7b",
        border: "1px solid",
        textTransform: "none",
        borderRadius: 2,
        px: 2.5,
      }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={async () => {
        try {
          await axios.post("/api/negotiations/direct-approve", {
            customerId: newRequestData.customerId,
            productId: newRequestData.productId,
            approvedPrice: newRequestData.approvedPrice,
            comment: newRequestData.comment,
          }, { headers });

          alert("Request approved directly!");
          setNewRequestOpen(false);
          setNewRequestData({
            customerId: "", productId: "", approvedPrice: "", comment: ""
          });
          fetchAll();
        } catch (err) {
          console.error("Failed to approve directly:", err);
          alert("Failed to process request.");
        }
      }}
      disabled={
        !newRequestData.customerId ||
        !newRequestData.productId ||
        !newRequestData.approvedPrice
      }
      sx={{
        backgroundColor: "#0b7b7b",
        textTransform: "none",
        borderRadius: 2,
        px: 3,
        "&:hover": {
          backgroundColor: "#095e5e",
        },
      }}
    >
      Save & Approve
    </Button>
  </DialogActions>
</Dialog>

    </Box>
    
  );
}
