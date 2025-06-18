// PriceRequest.jsx

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
  CircularProgress
} from "@mui/material";

export default function PriceRequest() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [history, setHistory] = useState([]);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [pendRes, apprRes] = await Promise.all([
        axios.get("/api/negotiations", { headers }),
        axios.get("/api/negotiations/approved", { headers })
      ]);
      setPending(pendRes.data);
      setApproved(apprRes.data);

      // Build history array: combine approved + pending for admin historical view
      setHistory([...apprRes.data, ...pendRes.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRateChange = (id, v) => {
    setRates(prev => ({ ...prev, [id]: v }));
  };

  const doApprove = async id => {
    const rate = rates[id];
    if (!rate || isNaN(rate)) return alert("Enter a valid price");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(`/api/negotiations/${id}/propose`, { proposedRate: rate }, { headers });
      await axios.patch(`/api/negotiations/approve/${id}`, {}, { headers });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to approve");
    }
  };

  const doDeny = async id => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.patch(`/api/negotiations/reopen/${id}`, {}, { headers });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to deny");
    }
  };

  if (loading) return <Box p={4}><CircularProgress/></Box>;

  return (
    <Box p={4} maxWidth="900px" mx="auto">
      <Typography variant="h5">Pending Negotiations</Typography>
      <Paper variant="outlined" sx={{ mb: 4, mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Requested</TableCell>
              <TableCell>Proposed Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pending.map(req => (
              <TableRow key={req._id}>
                <TableCell>{req.customerId.name}</TableCell>
                <TableCell>{req.productId.name}</TableCell>
                <TableCell>₹{req.productId.mrp}</TableCell>
                <TableCell>₹{req.proposedPrice}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={rates[req._id] || ""}
                    onChange={e => handleRateChange(req._id, e.target.value)}
                    sx={{ width: 90 }}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="success" size="small" onClick={() => doApprove(req._id)} sx={{ mr: 1 }}>
                    Approve
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => doDeny(req._id)}>
                   Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pending.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No pending requests</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="h5" sx={{ mt: 4 }}>Negotiation History</Typography>
<Paper variant="outlined" sx={{ mt: 2 }}>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Customer</TableCell>
        <TableCell>Product</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Requested</TableCell>
        <TableCell>Proposed</TableCell>
        <TableCell>Approved</TableCell>
        <TableCell>Date</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {history.map(item => (
        <TableRow key={item._id}>
          <TableCell>{item.customerId?.name || "N/A"}</TableCell>
          <TableCell>{item.productId?.name || "N/A"}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>₹{item.proposedPrice}</TableCell>
          <TableCell>{item.salesProposedRate ? `₹${item.salesProposedRate}` : "-"}</TableCell>
          <TableCell>{item.approvedPrice ? `₹${item.approvedPrice}` : "-"}</TableCell>
          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
          <TableCell>
            {["approved", "rejected", "denied", "proposed"].includes(item.status) && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => doDeny(item._id)}
              >
                Reopen
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
      {history.length === 0 && (
        <TableRow>
          <TableCell colSpan={8} align="center">No history available</TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</Paper>

    </Box>
  );
}
