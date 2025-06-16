const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dosageForm: { type: String, default: "" },
    packing: { type: String, default: "" },
    mrp: { type: Number, required: true, min: 0 },
    netRate: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 12, enum: [5, 12, 18, 28] },
    approved: { type: Boolean, default: false },
    ptr: { type: Number, default: 0 },
    pts: { type: Number, default: 0 },
    specialPricing: {
      type: Map,
      of: {
        type: Number,
        min: 0,
      },
      default: {},
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);