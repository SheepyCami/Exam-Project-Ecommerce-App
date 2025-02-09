const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");
const { authenticate } = require("../middlewares/authMiddleware");

// Routes for cart
// Route to add item to cart
router.post("/", authenticate, CartController.addProductToCart);
router.get("/", authenticate, CartController.getCart);
router.delete("/", authenticate, CartController.deleteCartItem);
router.put("/", authenticate, CartController.updateCartItem);
router.post("/checkout", authenticate, CartController.checkoutCart);

module.exports = router;
