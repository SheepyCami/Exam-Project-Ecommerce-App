// routes/brands.js
const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/BrandController");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", BrandController.getAllBrands); // Public route to get all brands
router.get("/:id", BrandController.getBrandById); // Public route to get a brand by ID

// Admin-only routes:
router.post("/", authenticate, adminOnly, BrandController.createBrand); // Create a new brand
router.put("/:id", authenticate, adminOnly, BrandController.updateBrand); // Update brand by ID
router.delete("/:id", authenticate, adminOnly, BrandController.deleteBrand); // Delete brand by ID

module.exports = router;
