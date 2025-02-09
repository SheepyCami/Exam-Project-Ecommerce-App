const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     description: Register a new user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User registration details.
 *         required: true
 *         schema:
 *           $ref: "#/definitions/UserRegistration"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request. Missing required fields or user already exists.
 *       500:
 *         description: Server error during registration.
 */
router.post("/register", (req, res) => AuthController.register(req, res));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     description: Login an existing user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User login credentials.
 *         required: true
 *         schema:
 *           $ref: "#/definitions/UserLogin"
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Invalid email or password.
 *       500:
 *         description: Server error during login.
 */
router.post("/login", (req, res) => AuthController.login(req, res));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     description: Logout the logged-in user.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       500:
 *         description: Server error during logout.
 */
router.post("/logout", (req, res) => AuthController.logout(req, res));

module.exports = router;
