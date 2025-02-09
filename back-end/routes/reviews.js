const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");

// Fetch all reviews
router.get("/", authenticate, adminOnly, ProductController.getAllReviews);

// Fetch all reviews for a product
router.get(
  "/:productId",
  authenticate,
  adminOnly,
  ProductController.getProductReviews.bind(ProductController)
);

// Create or update a review
router.post(
  "/",
  authenticate,
  ProductController.createProductReview.bind(ProductController)
);

// Delete a review by ID
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  ProductController.deleteProductReview.bind(ProductController)
);

module.exports = router;
