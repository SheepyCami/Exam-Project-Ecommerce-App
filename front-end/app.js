// Use require instead of import for js-cookie
const Cookies = require("js-cookie");

require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { setUser, authenticate } = require("./middlewares/userMiddleware");

var app = express();

// Using js-cookie to get the token from cookies
const token = Cookies.get("token"); // This fetches the token from the cookies
console.log("Token fetched from cookies:", token);

// Import Routes
var indexRouter = require("./routes/index");
const usersRouter = require("./routes/users"); // Import the users route
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth"); // Login, Register, Logout
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const ordersRoute = require("./routes/orders");
const searchRoutes = require("./routes/search");

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setUser); // Set user globally
app.use(express.static(path.join(__dirname, "public")));

// Route Definitions
app.use("/", indexRouter);
app.use("/users", usersRouter); // Use the router for /users path
app.use("/admin", adminRouter);
app.use("/auth", authRouter); // Mount auth routes
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRoute);
app.use("/search", searchRoutes);
app.use("/results", require("./routes/search"));

// Catch 404 and Forward to Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the Error Page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
