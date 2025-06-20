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

  const history = Array.from(historyMap.values())
    .filter((r) => !["pending", "proposed"].includes(r.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading)
    return (
      <Box className="p-10 bg-[#f7f9fa] min-h-screen text-center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box className="bg-[#f7f9fa] min-h-screen p-6">
      <Box className="max-w-6xl mx-auto space-y-10">
        {/* Pending Section */}
        <Box>
          <Button
  variant="contained"
  color="primary"
  onClick={() => setNewRequestOpen(true)}
>
  + New Request
</Button>

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
                {pending.map((req) => (
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
                {pending.length === 0 && (
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
                {history.map((item) => (
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
                {history.length === 0 && (
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
      <Dialog open={newRequestOpen} onClose={() => setNewRequestOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Create & Approve New Request</DialogTitle>
  <DialogContent dividers className="space-y-4">
    <FormControl fullWidth size="small">
      <InputLabel>Customer</InputLabel>
      <Select
        value={newRequestData.customerId}
        onChange={(e) => setNewRequestData({ ...newRequestData, customerId: e.target.value })}
        label="Customer"
      >
        {customers.map((c) => (
          <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel>Product</InputLabel>
      <Select
        value={newRequestData.productId}
        onChange={(e) => setNewRequestData({ ...newRequestData, productId: e.target.value })}
        label="Product"
      >
        {products.map((p) => (
          <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      label="Approved Price"
      fullWidth
      size="small"
      type="number"
      value={newRequestData.approvedPrice}
      onChange={(e) => setNewRequestData({ ...newRequestData, approvedPrice: e.target.value })}
    />

    <TextField
      label="Comment"
      fullWidth
      size="small"
      multiline
      rows={2}
      value={newRequestData.comment}
      onChange={(e) => setNewRequestData({ ...newRequestData, comment: e.target.value })}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setNewRequestOpen(false)}>Cancel</Button>
    <Button
  variant="contained"
  disabled={
    !newRequestData.customerId ||
    !newRequestData.productId ||
    !newRequestData.approvedPrice
  }
  onClick={async () => {
    try {
      const res = await axios.post("/api/negotiations", {
        customerId: newRequestData.customerId,
        productId: newRequestData.productId,
        proposedPrice: newRequestData.approvedPrice
      }, { headers });

      await axios.put(`/api/negotiations/${res.data._id}/propose`, {
        proposedRate: newRequestData.approvedPrice
      }, { headers });

      await axios.patch(`/api/negotiations/approve/${res.data._id}`, {
        comment: newRequestData.comment
      }, { headers });

      alert("Request created and approved!");
      setNewRequestOpen(false);
      setNewRequestData({
        customerId: "", productId: "", approvedPrice: "", comment: ""
      });
      fetchAll();
    } catch (err) {
      console.error("Failed to create/approve:", err);
      alert("Failed to process request.");
    }
  }}
>
  Save & Approve
</Button>

  </DialogActions>
</Dialog>
    </Box>
    
  );
}
