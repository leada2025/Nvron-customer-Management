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

export default function PriceRequest() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [rates, setRates] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes, allRes] = await Promise.all([
        axios.get("/api/negotiations/pending", { headers }),
        axios.get("/api/negotiations/approved", { headers }),
        axios.get("/api/negotiations", { headers }),
      ]);
      setPending(pendingRes.data);
      setApproved(approvedRes.data);
      setAllRequests(allRes.data);
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
    </Box>
  );
}
