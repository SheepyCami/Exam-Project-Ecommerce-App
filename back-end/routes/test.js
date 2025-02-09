//This route is for testing with Jest only!

const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/testMiddleware");
const axios = require("axios");

// Apply admin-specific middleware
router.use(authenticate, authorize([1]));

// Get all categories
router.get("/categories", async (req, res) => {
  //#swagger.tags=["Test"]
  //#swagger.description="Retrieve all categories. Admin access required."
  //#swagger.produces=['application/json']

  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const response = await axios.get("http://localhost:3000/category", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const categories = response.data.data.categories;
    res.status(200).json({ status: "success", data: categories });
  } catch (error) {
    console.error(
      "Error fetching categories:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new category
router.post("/categories", async (req, res) => {
  //#swagger.tags=["Test"]
  //#swagger.description="Create a new category. Admin access required."
  //#swagger.produces=['application/json']
  /* #swagger.parameters['body']= {
          in: 'body',
          description: 'Data to create a new category.',
          required: true,
          schema: {
              $ref: "#/definitions/CreateCategory"
          }
      } */
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const response = await axios.post(
      "http://localhost:3000/category",
      req.body,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.status(201).json({ status: "success", data: response.data });
  } catch (error) {
    console.error(
      "Error creating category:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Server error" });
  }
});

// Update a category
router.put("/categories/:id", async (req, res) => {
  //#swagger.tags=["Test"]
  //#swagger.description="Update an existing category. Admin access required."
  //#swagger.produces=['application/json']

  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const response = await axios.put(
      `http://localhost:3000/category/${req.params.id}`,
      req.body,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.status(200).json({ status: "success", data: response.data });
  } catch (error) {
    console.error(
      "Error updating category:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a category
router.delete("/categories/:id", async (req, res) => {
  //#swagger.tags=["Test"]
  //#swagger.description="Delete a category. Admin access required."
  //#swagger.produces=['application/json']

  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const response = await axios.delete(
      `http://localhost:3000/category/${req.params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.status(200).json({ status: "success", message: "Category deleted" });
  } catch (error) {
    console.error(
      "Error deleting category:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
