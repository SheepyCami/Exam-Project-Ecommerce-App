const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { adminOnly, authenticate } = require("../middlewares/authMiddleware");

// Admin route to get all users
router.get("/all", authenticate, adminOnly, AuthController.getAllUsers);

// Route to update a user
// Put request to update a user
router.put("/:id", authenticate, adminOnly, AuthController.updateUser); // Make sure the function is correctly assigned

// route to get a specific user by ID
router.get("/:id", authenticate, AuthController.getUserById); // Add this route

// Route to delete a user
router.delete("/:id", authenticate, adminOnly, AuthController.deleteUser);

// Route to update user role
router.put("/:id/role", authenticate, adminOnly, AuthController.updateUserRole);

// Route to update user membership
router.put(
  "/:id/membership",
  authenticate,
  adminOnly,
  AuthController.updateUserMembership
);

module.exports = router;
