// models/Offer.js
const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    value: Number,
    minOrder: Number,
    validityStart: Date,
    validityEnd: Date,
    stackable: String,
    eligibleFor: { type: String, enum: ["All", "Specific Customer", "Specific DP"], default: "All" },
    eligibleUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
