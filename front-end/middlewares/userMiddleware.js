const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const Token = () => {
  return jwt.sign(mockAdminUser, process.env.JWT_SECRET, { expiresIn: "2h" });
};

const mockAdminUser = {
  id: 1,
  username: "Admin",
  email: "admin@noroff.no",
  RoleId: "admin",
};

console.log("Mock Admin Token:", Token);

// Guest User object
const guestUser = {
  id: null,
  username: "Guest",
  role: "guest",
};

// Middleware to set the user (guest or authenticated)
const setUser = (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.header("Authorization") &&
      req.header("Authorization").replace("Bearer ", ""));

  if (!token) {
    req.user = guestUser; // Set as guest user if no token is found
    res.locals.user = guestUser; // Attach guest info to locals for views
    return next();
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = verified; // Attach verified user to request
    res.locals.user = verified; // Attach verified user to views
  } catch (error) {
    console.error("Invalid token:", error.message);
    req.user = guestUser; // Fallback to guest user if token is invalid
    res.locals.user = guestUser;
  }

  next();
};

// Middleware to enforce authentication
const authenticate = (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "Access Denied. You need to log in to access this resource.",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user data to request
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(400).json({ message: "Invalid Token" });
  }
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    // Use RoleId instead of role
    if (!req.user || !allowedRoles.includes(req.user.RoleId)) {
      return res.status(403).json({
        message:
          "Access Denied. You are not authorized to access this resource.",
      });
    }
    next();
  };
};

module.exports = { setUser, authenticate, authorize };
