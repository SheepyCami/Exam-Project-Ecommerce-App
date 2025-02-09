const express = require("express");
const router = express.Router();
const axios = require("axios");

/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const [
      categoriesResponse,
      latestProductsResponse,
      allProductsResponse,
      brandsResponse,
    ] = await Promise.all([
      axios.get("http://localhost:3000/categories"),
      axios.get("http://localhost:3000/products/latest"),
      axios.get("http://localhost:3000/products"), // Fetch all products
      axios.get("http://localhost:3000/brands"),
    ]);

    const categories = categoriesResponse.data.data || [];
    const latestProducts = latestProductsResponse.data.data || [];
    const allProducts = allProductsResponse.data.data || []; // All products
    const brands = brandsResponse.data.data || [];

    console.log("All Products Data:", allProducts); // Debug log

    res.render("index", {
      title: "Home Page",
      user: req.user || null,
      categories,
      latestProducts,
      allProducts, // Pass all products to the front end
      brands,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.render("index", {
      title: "Home Page",
      user: req.user || null,
      categories: [],
      latestProducts: [],
      allProducts: [],
      brands: [],
    });
  }
});

module.exports = router;
