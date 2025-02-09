const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");

// Public route to get all categories
router.get("/", CategoryController.getAllCategories);

// Public route to get a category by ID
router.get("/:id", CategoryController.getCategoryById);

//Admin routes:
// Create a new category
router.post("/", authenticate, adminOnly, CategoryController.createCategory);

// Update category by ID
router.put("/:id", authenticate, adminOnly, CategoryController.updateCategory);

// Delete category by ID
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  CategoryController.deleteCategory
);
module.exports = router;
