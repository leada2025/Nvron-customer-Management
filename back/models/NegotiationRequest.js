const mongoose = require("mongoose");

const negotiationRequestSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ✅ Requested by Customer
  proposedPrice: {
    type: Number,
    required: true,
  },

  // ✅ Proposed by Sales
  salesProposedRate: {
    type: Number,
    default: null,
  },

  // ✅ Approved by Billing
  approvedPrice: {
    type: Number,
    default: null,
  },

  status: {
    type: String,
    enum: ["pending", "proposed", "reviewed", "rejected", "approved"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("NegotiationRequest", negotiationRequestSchema);
