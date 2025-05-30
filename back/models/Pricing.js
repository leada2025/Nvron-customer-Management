const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  proposedRate: Number,
  approvedRate: Number,
  minRate: Number,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
   approvedAt: { type: Date },
  
},
 { timestamps: true },
);

module.exports = mongoose.model("Pricing", pricingSchema);
