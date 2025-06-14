const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const requireAuth = require("../middleware/requireAuth");
const NegotiationRequest = require("../models/NegotiationRequest");
const jwt = require("jsonwebtoken");



router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customerId = decoded.id || decoded._id;

    const products = await Product.find();

    const negotiatedPrices = await NegotiationRequest.find({
      customerId,
      status: "approved",
    });

    const priceMap = {};
    negotiatedPrices.forEach((n) => {
      priceMap[n.productId.toString()] = n.approvedPrice;

    });

    const enriched = products.map((p) => ({
      ...p.toObject(),
      specialPrice: priceMap[p._id.toString()] || null,
    }));

    res.json(enriched);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// routes/product.js
router.get("/unapproved",  requireAuth({ permission: "Manage Pricing"}), async (req, res) => {
  try {
    const products = await Product.find({ approved: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unapproved products" });
  }
});


// Create a product (Admin Only)
router.post("/",  requireAuth({ permission: "Manage Products" }), async (req, res) => {
    console.log("Incoming request body:", req.body);
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
  console.error("Product create error:", err);
  res.status(400).json({ error: err.message || "Failed to create product" });
}

});
// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});


// Update a product (Admin Only)
router.put("/:id", requireAuth({ permission: "Manage Products" }), async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: "Failed to update product" });
  }
});

// Delete a product (Admin Only)
router.delete("/:id", requireAuth({ permission: "Manage Products" }), async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
