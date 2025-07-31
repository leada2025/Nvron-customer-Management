// /models/Catalogue.js

const mongoose = require("mongoose");

const catalogueSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  badge: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Catalogue", catalogueSchema);
