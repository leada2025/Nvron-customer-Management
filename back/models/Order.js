const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: String,
  quantity: Number,
  netRate: Number,
  tax: Number,
  description: String,
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [orderItemSchema],
  note: String,
  status: {
    type: String,
    enum: ["pending", "delivered", "cancelled","processed"],
    default: "pending",
  },
  feedback: String,
  shippingCharge: Number,
  subtotal: Number,
  taxAmount: Number,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
