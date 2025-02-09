const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/SearchController"); // Verify the path

// POST route for product search
router.post("/", SearchController.searchProducts); // Use the static method here

module.exports = router;
