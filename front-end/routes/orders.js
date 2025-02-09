const express = require("express");
const router = express.Router();
const axios = require("axios");
const { authenticate } = require("../middlewares/userMiddleware");

// Route to fetch and display user's orders
// Route to display user's orders
router.get("/", authenticate, async (req, res) => {
  try {
    const token = req.cookies.token;

    // Fetch user orders from the backend
    const response = await axios.get("http://localhost:3000/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const orders = response.data.data;

    // Render the orders page
    res.render("userOrders", { title: "My Orders", orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).render("userOrders", {
      title: "My Orders",
      orders: [],
      error: "Failed to fetch orders.",
    });
  }
});



module.exports = router;
