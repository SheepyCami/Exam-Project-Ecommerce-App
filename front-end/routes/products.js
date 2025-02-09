const express = require("express");
const router = express.Router();
const axios = require("axios");

// Fetch all products and categories and render the EJS template
// Fetch all products and categories and render the EJS template
router.get("/", async (req, res) => {
  try {
    // Fetch products from the backend
    const productsResponse = await axios.get("http://localhost:3000/products");
    const products = productsResponse.data.data.products;

    // Fetch categories from the backend
    const categoriesResponse = await axios.get(
      "http://localhost:3000/categories"
    );
    const categories = categoriesResponse.data.data;

    console.log("Fetched Products:", products);
    console.log("Fetched Categories:", categories);

    // Render allProducts.ejs (not products.ejs)
    res.render("allProducts", {
      title: "All Products",
      products: products || [],
      categories: categories || [],
    });
  } catch (error) {
    console.error("Error fetching products or categories:", error.message);

    res.render("allProducts", {
      title: "All Products",
      products: [],
      categories: [],
    });
  }
});

// Route to get product details by ID
// Route to get product details by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch product details by ID
    const productResponse = await axios.get(
      `http://localhost:3000/products/${id}`
    );
    const product = productResponse.data.data.product;

    // Fetch categories for the banner
    const categoriesResponse = await axios.get(
      "http://localhost:3000/categories"
    );
    const categories = categoriesResponse.data.data;

    if (!product) {
      // Render 404 error page if product is not found
      return res.status(404).render("error", { title: "Product Not Found" });
    }

    // Render the product.ejs view
    res.render("products/product", {
      title: product.name,
      product, // Pass the single product object
      categories: categories || [], // Pass categories
    });
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).render("error", { title: "Server Error" });
  }
});

// Route to fetch products by category and all categories
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch products in the selected category
    const productsResponse = await axios.get(
      `http://localhost:3000/products/category/${category}`
    );
    const products = productsResponse.data.data.products;

    // Fetch all categories to display in the "Browse Categories" section
    const categoriesResponse = await axios.get(
      "http://localhost:3000/categories"
    );
    const categories = categoriesResponse.data.data;

    res.render("products/category", {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Category`,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      products: products || [],
      categories: categories || [], // Pass all categories to the view
    });
  } catch (error) {
    console.error("Error fetching products by category:", error.message);
    res.render("products/category", {
      title: "Category",
      category: null,
      products: [],
      categories: [],
    });
  }
});

module.exports = router;
