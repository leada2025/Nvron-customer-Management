const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending"
  }
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
