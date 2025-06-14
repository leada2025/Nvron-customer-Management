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
    default: true, // true = enabled, false = disabled
  },

   assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // this stores which user added this customer
  },
  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

});

module.exports = mongoose.model("User", userSchema);
