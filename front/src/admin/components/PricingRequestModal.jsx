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
    customerId: "", // NEW
  });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.role || "");

    if (request) {
      setFormData({
        productId: request.productId || "",
        proposedPrice: request.proposedPrice || 0,
        customerId: request.customerId || user?.userId || "", // fallback for customer login
      });
    } else {
      setFormData({
        productId: "",
        proposedPrice: 0,
        customerId: user?.userId || "", // for customer role
      });
    }

    fetchProducts();
    if (user?.role?.toLowerCase() !== "customer") {
      fetchCustomers();
    }
  }, [request]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("/admin/users?onlyRole=Customer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.productId || !formData.proposedPrice || !formData.customerId) {
      alert("Please fill in all fields.");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-[#0b7b7b] font-bold">
        {request ? "Edit Pricing Request" : "New Pricing Request"}
      </DialogTitle>

      <DialogContent>
        {/* Select Product */}
        <TextField
          select
          label="Select Product"
          name="productId"
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

        {/* Select Customer (if not a customer) */}
        {userRole.toLowerCase() !== "customer" && (
          <TextField
            select
            label="Select Customer"
            name="customerId"
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

        {/* Proposed Price */}
        <TextField
          label="Proposed Price (₹)"
          name="proposedPrice"
          type="number"
          value={formData.proposedPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>

      <DialogActions className="px-6 pb-4">
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {request ? "Update" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
