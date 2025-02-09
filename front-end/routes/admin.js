const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { authenticate, authorize } = require("../middlewares/userMiddleware");

router.get("/dashboard", authenticate, authorize([1]), async (req, res) => {
  try {
    const token = req.cookies.token; // Get the token from the cookie
    // Fetch all necessary data for the dashboard

    const [
      categoriesResponse,
      brandsResponse,
      productsResponse,
      usersResponse,
      reviewsResponse,
      ordersResponse,
      membershipsResponse,
    ] = await Promise.all([
      axios.get("http://localhost:3000/categories", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:3000/brands", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:3000/products", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:3000/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:3000/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:3000/orders", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:3000/memberships", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      user: req.user,
      token: token, // Pass the token
      categories: categoriesResponse.data.data || [],
      brands: brandsResponse.data.data || [],
      products: productsResponse.data.data || [],
      users: usersResponse.data.data || [],
      reviews: reviewsResponse.data.data || [],
      orders: ordersResponse.data.data || [],
      memberships: membershipsResponse.data.data || [],
      token: token, // Pass the token
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res
      .status(500)
      .json({ message: "Server error while fetching dashboard data" });
  }
});

// Manage Products Dashboard

router.get("/products", authenticate, authorize([1]), async (req, res) => {
  try {
    const token = req.cookies.token;

    const response = await axios.get("http://localhost:3000/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    const products = response.data.data.products;

    if (!Array.isArray(products)) {
      console.error("Products is not an array:", products);
      return res.render("admin/products", {
        title: "Manage Products",
        user: req.user,
        token: token,
        products: [],
      });
    }

    res.render("admin/products", {
      title: "Manage Products",
      user: req.user,
      token: token,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Manage Categories Dashboard

router.get("/categories", authenticate, authorize([1]), async (req, res) => {
  try {
    const token = req.cookies.token; // Get the token from cookies

    // Make the API call to fetch categories
    const response = await axios.get("http://localhost:3000/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Extract categories from response
    const categories = response.data.data || [];

    // Pass the token and categories to the frontend
    res.render("admin/categories", {
      title: "Manage Categories",
      categories,
      token, // Pass the token to the template
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);

    // Render the page with an empty array and token
    res.render("admin/categories", {
      title: "Manage Categories",
      categories: [],
      token: req.cookies.token,
      user: req.user,
    });
  }
});

// Brands Management Dashboard:

router.get("/brands", authenticate, authorize([1]), async (req, res) => {
  try {
    const token = req.cookies.token; // Get the token from cookies

    const response = await axios.get("http://localhost:3000/brands", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const brands = response.data.data || [];

    // Pass token explicitly to the view
    res.render("admin/brands", {
      title: "Manage Brands",
      brands,
      token, // Pass the token to EJS
      user: req.user, // Ensure `req.user` is populated
    });
  } catch (error) {
    console.error("Error fetching brands:", error.message);

    res.render("admin/brands", {
      title: "Manage Brands",
      brands: [],
      token: req.cookies.token || "", // Fallback in case token is undefined
      user: req.user || { role: "guest" },
    });
  }
});

// Fetch all orders (Admin) Dashboard:

router.get("/orders", authenticate, authorize([1]), async (req, res) => {
  try {
    const token = req.cookies.token; // Get the token from cookies

    // Make API call to fetch all orders
    const response = await axios.get("http://localhost:3000/orders/admin/all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const orders = response.data.data || [];

    res.render("admin/orders", {
      title: "Manage Orders",
      orders,
      token, // Pass token
      user: req.user, // Include user info
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);

    // Render page with empty orders and token
    res.render("admin/orders", {
      title: "Manage Orders",
      orders: [],
      token: req.cookies.token,
      user: req.user,
    });
  }
});

// Users - Fetch all users

router.get("/users", authenticate, authorize([1]), async (req, res) => {
  try {
    const token = req.cookies.token; // Fetch token from cookies

    // Fetch all users from backend
    const response = await axios.get("http://localhost:3000/users/all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = response.data.data || [];

    res.render("admin/users", {
      title: "Manage Users",
      users,
      token, // Pass the token
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);

    res.render("admin/users", {
      title: "Manage Users",
      users: [],
      token: req.cookies.token,
      user: req.user,
    });
  }
});

//Memberships route:

// Memberships
router.get("/memberships", authenticate, authorize([1]), async (req, res) => {
  try {
    const token = req.cookies.token;

    // Fetch users with their memberships
    const response = await axios.get(
      "http://localhost:3000/memberships/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const users = response.data.data || [];
    res.render("admin/memberships", {
      title: "Manage Memberships",
      users,
      token,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching memberships:", error.message);
    res.render("admin/memberships", {
      title: "Manage Memberships",
      users: [], // Pass empty users if error occurs
      token: req.cookies.token,
      user: req.user,
    });
  }
});

//Reviews:
// Reviews - Fetch all reviews
router.get("/reviews", authenticate, authorize([1]), async (req, res) => {
  try {
    const token = req.cookies.token;

    // Fetch all reviews
    const response = await axios.get("http://localhost:3000/reviews", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const reviews = response.data.data || [];
    res.render("admin/reviews", {
      title: "Manage Reviews",
      reviews,
      token,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.render("admin/reviews", {
      title: "Manage Reviews",
      reviews: [], // Pass empty reviews if an error occurs
      token: req.cookies.token,
      user: req.user,
    });
  }
});

module.exports = router;
