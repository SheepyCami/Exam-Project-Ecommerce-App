//This app is used for running tests with JEST.
//It is only used for testing purposes and not for production.
// the main app for this application is called app.js!

require("dotenv").config();

// Import necessary modules
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const bodyParser = require("body-parser");

const db = require("./models");
const initializeDatabase = require("./initializeDatabase");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createError = require("http-errors");

// Import routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const brandsRouter = require("./routes/brands");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const testRouter = require("./routes/test");

// Create Express app instance
const app = express();

// Function to initialize the app specifically for testing
async function initializeTestApp() {
  try {
    // Reset and sync the database for testing
    await db.sequelize.sync({ force: true });
    console.log("Database synced for testing");

    // Initialize the database with test data
    await initializeDatabase();
    console.log("Test database initialized successfully");

    // Middleware and route setup
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    // Use the routes
    app.use("/", indexRouter);
    app.use("/auth", authRouter);
    app.use("/products", productsRouter);
    app.use("/categories", categoriesRouter);
    app.use("/brands", brandsRouter);
    app.use("/cart", cartRouter);
    app.use("/orders", ordersRouter);
    app.use("/users", usersRouter);
    app.use("/test", testRouter);

    // Add Swagger for documentation
    app.use(bodyParser.json());
    app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

    // Error handling
    app.use(function (req, res, next) {
      next(createError(404));
    });

    app.use(function (err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};
      res.status(err.status || 500);
      res.render("error");
    });
  } catch (err) {
    console.error("Error initializing the test app:", err);
  }
}

// Initialize the app only if not in test environment
if (process.env.NODE_ENV !== "test") {
  initializeTestApp();
}

module.exports = { app, initializeTestApp, db };
