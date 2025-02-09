const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");

// User Routes
router.post("/", authenticate, OrderController.createOrder);
router.get("/", authenticate, OrderController.getUserOrders);
router.get("/:id", authenticate, OrderController.fetchOrderById);

// Admin-Specific Routes
router.get("/admin/all", authenticate, adminOnly, OrderController.getAllOrders); // Get all orders (Admin)
router.put("/admin/:id", authenticate, adminOnly, OrderController.updateOrder); // Update an order's status (Admin)
router.delete(
  "/admin/:id",
  authenticate,
  adminOnly,
  OrderController.deleteOrder
); // Delete an order (Admin)

module.exports = router;
