const mongoose = require("mongoose");

const salesTargetSchema = new mongoose.Schema({
  salesUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // Format: "2025-06"
  targetOrders: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

salesTargetSchema.index({ salesUserId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("SalesTarget", salesTargetSchema);
