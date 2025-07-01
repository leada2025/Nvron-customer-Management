// models/Distributor.js
const mongoose = require("mongoose");

const distributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }, // Hash in production
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Distributor", distributorSchema);
