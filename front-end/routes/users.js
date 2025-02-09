var express = require("express");
var router = express.Router();
const axios = require("axios");
const { authenticate } = require("../middlewares/userMiddleware");

// Route for User Dashboard
router.get("/mypage", authenticate, async (req, res) => {
  try {
    const user = req.user; // The authenticated user
    const token = req.cookies.token; // Fetch token from cookies
    const response = await axios.get("http://localhost:3000/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const orders = response.data.data || [];

    // Render the user dashboard (myPage.ejs) and pass user and orders data
    res.render("myPage", {
      title: "My Page",
      user,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res.status(500).render("myPage", {
      title: "My Page",
      user: req.user,
      orders: [],
      error: "Error fetching dashboard data.",
    });
  }
});

// Route for User Profile
// Route for User Profile
// Route to fetch and display user's profile data
router.get("/mypage/profile", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    const token = req.cookies.token; // Get the token from cookies

    // Fetch user profile data from backend
    const response = await axios.get(`http://localhost:3000/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = response.data.data;

    // Render the profile page and pass the user data
    res.render("userProfile", { title: "User Profile", user });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).render("userProfile", {
      title: "User Profile",
      error: "Failed to fetch profile data.",
    });
  }
});

module.exports = router;
