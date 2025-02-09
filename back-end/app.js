require("dotenv").config();

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const bodyParser = require("body-parser");

const db = require("./models");
const initializeDatabase = require("./initializeDatabase");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cookieParser = require("cookie-parser");
var logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");
const brandsRouter = require("./routes/brands");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const membershipsRouter = require("./routes/memberships");
const reviewsRouter = require("./routes/reviews");
const searchRoutes = require("./routes/search");

var app = express();
const cors = require("cors");

// Enable CORS for all routes

app.use(
  cors({
    origin: "http://localhost:3001", //  frontend URL
    credentials: true,
  })
);

//Initialize Database - change to false after first time initializing table,
// change to true for resetting the database.

db.sequelize.sync({ force: false }).then(async () => {
  console.log("Database synced");

  try {
    await initializeDatabase();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error during database initialization:", error);
  }
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/brands", brandsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/memberships", membershipsRouter);
app.use("/reviews", reviewsRouter);
app.use("/search", searchRoutes);
app.use("/auth", authRouter);

//add swaggerUi
app.use(bodyParser.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
