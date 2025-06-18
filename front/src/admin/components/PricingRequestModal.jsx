import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

export default function PricingRequestModal({ request, onClose, onSave, customers, products }) {
  const [formData, setFormData] = useState({
    productId: "",
    proposedPrice: 0,
    customerId: "",
  });

  useEffect(() => {
    if (request) {
      setFormData({
        productId: request.productId || "",
        proposedPrice: request.proposedPrice || 0,
        customerId: request.customerId || "",
      });
    } else {
      setFormData({
        productId: "",
        proposedPrice: 0,
        customerId: "",
      });
    }
  }, [request]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.productId || !formData.proposedPrice || !formData.customerId) {
      alert("Please fill in all fields");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{request ? "Edit" : "New"} Pricing Request</DialogTitle>
      <DialogContent>
        <TextField
          select
          name="productId"
          label="Product"
          value={formData.productId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {products.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          name="customerId"
          label="Customer"
          value={formData.customerId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {customers.map((cust) => (
            <MenuItem key={cust._id} value={cust._id}>
              {cust.name} ({cust.email})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          name="proposedPrice"
          label="Proposed Price (₹)"
          type="number"
          value={formData.proposedPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {request ? "Update" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
