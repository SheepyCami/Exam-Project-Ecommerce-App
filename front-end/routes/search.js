const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET route for search results
router.get("/search-results", async (req, res) => {
  try {
    const { query } = req.query; // Retrieve the search query

    // Fetch categories, brands, and products based on the search term
    const [categoriesResponse, brandsResponse, productsResponse] =
      await Promise.all([
        axios.get("http://localhost:3000/categories"),
        axios.get("http://localhost:3000/brands"),
        axios.get(`http://localhost:3000/products?search=${query}`), // Use query to filter products
      ]);

    const categories = categoriesResponse.data.data || [];
    const brands = brandsResponse.data.data || [];
    const products = productsResponse.data.data || [];

    res.render("search-results", {
      title: "Search Results",
      categories,
      brands,
      products,
      keyword: query || "", // Pass the search keyword
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
