const express = require("express");
const router = express.Router();
const Catalogue = require("../models/Catalogue");
const Category = require("../models/Category");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "/mnt/catalog"; 
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET all catalogue items
router.get("/", async (req, res) => {
  try {
    const items = await Catalogue.find().populate("category");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch catalogue items" });
  }
});

// GET all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST a new catalogue item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, dosage, category, badge, description } = req.body;
    const newItem = new Catalogue({
      name,
      dosage,
      category,
      badge,
      description,
     image: req.file ? `/catalog/${req.file.filename}` : "",

    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add catalogue item" });
  }
});

// POST a new category
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

// PUT to update a category
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

// PUT update catalogue item
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, dosage, category, badge, description } = req.body;

    const updateData = {
      name,
      dosage,
      category,
      badge,
      description,
    };

    if (req.file) {
     updateData.image = `/catalog/${req.file.filename}`;

    }

    const updated = await Catalogue.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});


// DELETE a category
router.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await Catalogue.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Delete image file if it exists and is on Render Disk
    if (item.image && item.image.startsWith("/catalog/")) {
      const filename = item.image.replace("/catalog/", "");
      const filePath = path.join("/mnt/catalog", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove from DB
    await Catalogue.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

module.exports = router;
