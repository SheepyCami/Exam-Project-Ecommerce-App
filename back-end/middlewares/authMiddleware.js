// This middleware is for the app.js file
// the testMiddleware is for testing purposes with Jest only.

const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure dotenv is loaded

// Middleware to authenticate the token and check if it is valid
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")
    ? req.header("Authorization").replace("Bearer ", "")
    : req.cookies.token;
  console.log("Token received in Middleware:", token);

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Please log in to access this resource",
    });
  }

  try {
    // Verify token with the JWT_SECRET from environment
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(400).json({
      message: "Invalid Token",
    });
  }
};

// Middleware to restrict access to admin-only routes
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.RoleId !== 1) {
    return res.status(403).json({
      status: "fail",
      message: "Access denied. Admins only.",
    });
  }
  next();
};

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is missing in the environment variables.");
}

module.exports = {
  authenticate,
  adminOnly,
};
