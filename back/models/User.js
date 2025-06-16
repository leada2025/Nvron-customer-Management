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

  // 👇 Add this line
  tags: {
    type: [String],
    default: [], // e.g., ["Doctor", "Retailer"]
  },
});


module.exports = mongoose.model("User", userSchema);
