// models/User.js
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
});

module.exports = mongoose.model("User", userSchema);
