const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  dosageForm: String,
  packing: String,
  mrp: { type: Number, required: true },
  netRate: { type: Number, required: true },
  tax: { type: Number, default: 12 }, // store as number, e.g. 12 instead of '12%'
  approved: { type: Boolean, default: false },
  specialPricing: {
  type: Map,
  of: Number,
  default: {},
}

});

module.exports = mongoose.model("Product", productSchema);
