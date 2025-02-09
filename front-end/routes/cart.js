const express = require("express");
const router = express.Router();
const axios = require("axios");
const { authenticate } = require("../middlewares/userMiddleware");

// Route to display the cart page
router.get("/", authenticate, async (req, res) => {
  try {
    const token = req.cookies.token;

    // Fetch cart data from the backend
    const cartResponse = await axios.get("http://localhost:3000/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cartData = cartResponse.data.data;

    // Fetch categories for the banner
    const categoriesResponse = await axios.get(
      "http://localhost:3000/categories"
    );
    const categories = categoriesResponse.data.data;

    // Render the cart page with cart and categories data
    res.render("cart", {
      title: "Your Cart",
      cart: cartData.CartItems || [],
      totalPrice: cartData.totalPrice || 0,
      discountPercentage: cartData.discountPercentage || 0,
      discountAmount: cartData.discountAmount || 0,
      finalPrice: cartData.finalPrice || 0,
      categories: categories || [],
    });
  } catch (error) {
    console.error("Error fetching cart or categories:", error.message);
    res.status(500).render("cart", {
      title: "Your Cart",
      cart: [],
      totalPrice: 0,
      discountPercentage: 0,
      discountAmount: 0,
      finalPrice: 0,
      categories: [],
    });
  }
});

// Route to add an item to the cart
router.post("/add", authenticate, async (req, res) => {
  try {
    const { productId } = req.body;
    const token = req.cookies.token || "";

    const response = await axios.post(
      "http://localhost:3000/cart", // backend cart route
      { productId, quantity: 1 }, // passing the data to backend
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Backend Response:", response.data);
    res.redirect("/cart"); // Redirect to cart page after successful addition
  } catch (error) {
    console.error("Error adding product to cart:", error.message);
    res.redirect("back"); // In case of an error, go back to previous page
  }
});

// Route to update the quantity of a cart item
router.post("/update", authenticate, async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const { productId, quantity } = req.body;

    // Call backend API to update the cart item
    await axios.put(
      "http://localhost:3000/cart",
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.redirect("/cart");
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    res.redirect("/cart");
  }
});

// Route to remove an item from the cart
router.post("/remove", authenticate, async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const { productId } = req.body;

    // Call backend API to remove the cart item
    await axios.delete("http://localhost:3000/cart", {
      headers: { Authorization: `Bearer ${token}` },
      data: { productId },
    });

    res.redirect("/cart");
  } catch (error) {
    console.error("Error removing cart item:", error.message);
    res.redirect("/cart");
  }
});

// Route to checkout the cart

router.post("/checkout", authenticate, async (req, res) => {
  try {
    const token = req.cookies.token;

    // Call backend checkout endpoint
    await axios.post(
      "http://localhost:3000/cart/checkout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Redirect to My Orders page after successful checkout
    res.redirect("/orders");
  } catch (error) {
    console.error("Error during checkout:", error.message);
    res.redirect("/cart"); // Stay on cart page if checkout fails
  }
});

module.exports = router;
