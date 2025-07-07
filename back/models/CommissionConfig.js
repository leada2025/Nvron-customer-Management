const mongoose = require("mongoose");

const slabSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  percent: { type: Number, required: true },
});

const CommissionConfigSchema = new mongoose.Schema({
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // ⬅️ new
  slabs: [slabSchema],
  fixedPTRRate: { type: Number, default: 10 },
  fixedPTSRate: { type: Number, default: 9 },
});

module.exports = mongoose.model("CommissionConfig", CommissionConfigSchema);
