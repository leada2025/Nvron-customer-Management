// models/PartnerCommission.js
const mongoose = require("mongoose");

const slabSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  percent: { type: Number, required: true },
});

const PartnerCommissionSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  slabs: [slabSchema],
  fixedPTRRate: { type: Number, default: 10 },
  fixedPTSRate: { type: Number, default: 9 },
}, { timestamps: true });

module.exports = mongoose.model("PartnerCommission", PartnerCommissionSchema);
