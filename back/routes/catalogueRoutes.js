const express = require("express");
const router = express.Router();
const Catalogue = require("../models/Catalogue");
const Category = require("../models/Category");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "catalogue", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// ✅ GET all catalogue items
router.get("/", async (req, res) => {
  try {
    const items = await Catalogue.find().populate("category");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch catalogue items" });
  }
});

// ✅ GET all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ✅ POST a new catalogue item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, dosage, category, badge, description } = req.body;
    const newItem = new Catalogue({
      name,
      dosage,
      category,
      badge,
      description,
      image: req.file ? req.file.path : "",
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add catalogue item" });
  }
});

// ✅ POST a new category
router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

// ✅ PUT to update a category
router.put("/categories/:id", async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

// ✅ PUT update catalogue item
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, dosage, category, badge, description } = req.body;
    const updateData = { name, dosage, category, badge, description };

    if (req.file) {
      updateData.image = req.file.path; // Cloudinary returns full secure URL
    }

    const updated = await Catalogue.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// ✅ DELETE a category
router.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ✅ DELETE a catalogue item (and delete from Cloudinary)
router.delete("/:id", async (req, res) => {
  try {
    const item = await Catalogue.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Remove image from Cloudinary if exists
    if (item.image && item.image.includes("cloudinary.com")) {
      const publicId = item.image.split("/").pop().split(".")[0]; // Extract ID from URL
      await cloudinary.uploader.destroy(`catalogue/${publicId}`);
    }

    await Catalogue.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

module.exports = router;
