const express = require("express");
const ProductController = require("../controllers/ProductController.js");
const router = express.Router();
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");

// Fetch all products
router.get("/", ProductController.getProducts.bind(ProductController));

// Fetch latest products
router.get(
  "/latest",
  ProductController.getLatestProducts.bind(ProductController)
);

// Fetch products by category
router.get(
  "/category/:category",
  ProductController.getProductsByCategory.bind(ProductController)
);

// GET: Fetch a product by ID
router.get("/:id", ProductController.getProductById.bind(ProductController));

// CREATE: Create a new product
router.post(
  "/",
  authenticate,
  adminOnly,
  ProductController.createProduct.bind(ProductController)
);

// PUT: Update a product by ID
router.put(
  "/:id",
  authenticate,
  adminOnly,
  ProductController.updateProduct.bind(ProductController)
);

// DELETE: Delete a product by ID (soft delete)
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  ProductController.deleteProduct.bind(ProductController)
);

// PUT: Undelete a product
router.put(
  "/:id/undelete",
  authenticate,
  adminOnly,
  ProductController.undeleteProduct.bind(ProductController)
);

module.exports = router;
