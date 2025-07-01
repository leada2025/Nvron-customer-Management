const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  permissions: {
    type: [String],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // 👇 Updated field: position with enum
  position: {
    type: String,
    enum: ["Doctor", "Retailer","Distributor","Partners"],
    default: null,
  },
  placeOfSupply: {
    type: String,
    default: null,
  },

    partnerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, {
  timestamps: true, // ✅ Enables createdAt and updatedAt
});

module.exports = mongoose.model("User", userSchema);
