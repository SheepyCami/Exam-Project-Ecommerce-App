const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Render Login Page
router.get("/login", (req, res) => {
  res.render("auth/login", { error: null });
});

// Render Register Page
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

// Handle Login Request
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call backend API for login
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });

    // Extract the token from the backend response
    const token = response.data.token;
    if (!token) {
      throw new Error("Token not received from backend");
    }

    // Decode the token to extract user role
    const decodedToken = jwt.decode(token);
    if (!decodedToken || !decodedToken.RoleId) {
      throw new Error("Invalid token structure");
    }

    const { RoleId } = decodedToken; // Extract the RoleId from the token payload

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7200000, // 2 hours in milliseconds
    });

    // Redirect based on user role
    if (RoleId === 1) {
      // Admin Role
      res.redirect("/admin/dashboard");
    } else if (RoleId === 2) {
      // User Role
      res.redirect("http://localhost:3001/");
    } else {
      // Guest
      res.redirect("/");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    res.render("auth/login", { error: "Invalid email or password" });
  }
});

// Handle Register Request
router.post("/register", async (req, res) => {
  try {
    await axios.post("http://localhost:3000/auth/register", req.body);
    res.redirect("/auth/login");
  } catch (error) {
    res.render("auth/register", { error: "Registration failed. Try again." });
  }
});

// Handle Logout Request
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
