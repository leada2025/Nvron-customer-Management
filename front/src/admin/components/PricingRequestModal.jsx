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
import axios from "../api/Axios";

export default function PricingRequestModal({ request, onClose, onSave }) {
  const [formData, setFormData] = useState({
    productId: "",
    proposedPrice: 0,
    customerId: "", 
  });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.role || "");

    fetchProducts();
    if (user?.role?.toLowerCase() !== "customer") {
      fetchCustomers();
    }

    if (request) {
      setFormData({
        productId: request.productId || "",
        proposedPrice: request.proposedPrice || 0,
        customerId: request.customerId || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        customerId: user?.role?.toLowerCase() === "customer" ? user?.userId : "",
      }));
    }
  }, [request]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/admin/users?onlyRole=Customer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

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
        {/* Product Dropdown */}
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

        {/* Customer Dropdown (Admin Only) */}
        {userRole.toLowerCase() !== "customer" && (
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
        )}

        {/* Price Field */}
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
