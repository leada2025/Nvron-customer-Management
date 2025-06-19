import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  useTheme,
} from "@mui/material";

export default function PricingRequestModal({
  request,
  onClose,
  onSave,
  customers,
  products,
}) {
  const [formData, setFormData] = useState({
    productId: "",
    proposedPrice: 0,
    customerId: "",
  });

  const theme = useTheme();

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
    <Dialog
  open
  onClose={onClose}
  fullWidth
  maxWidth="sm"
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
        {request ? "Edit" : "New"} Pricing Request
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          select
          name="productId"
          label="Product"
          value={formData.productId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "white", borderRadius: 2 }}
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
          sx={{ backgroundColor: "white", borderRadius: 2 }}
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
          sx={{ backgroundColor: "white", borderRadius: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
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
          onClick={handleSubmit}
          variant="contained"
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
          {request ? "Update" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
