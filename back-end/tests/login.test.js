const request = require("supertest");
const { db, app, initializeTestApp } = require("../testApp");

// Utility to control which tests to run
const testScenarios = {
  validLogin: true,
  invalidLogin: true,
};

// Utility for conditionally running tests
const dynamicTest = (title, condition, callback) => {
  condition ? it(title, callback) : it.skip(title, callback);
};

beforeAll(async () => {
  // Initialize the app and database before tests
  await initializeTestApp();
});

describe("Authentication API Tests", () => {
  let adminToken = "";

  dynamicTest(
    "should authenticate with valid admin credentials",
    testScenarios.validLogin,
    async () => {
      const loginPayload = {
        email: "admin@noroff.no",
        password: "P@ssword2023",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(loginPayload);

      //admin login credentials from initializedatabase:
      //{
      //  "email": "admin@noroff.no",
      //"password": "P@ssword2023"

      // Validate that the login request was successful
      if (response.statusCode !== 200) {
        console.error("Failed Login Response:", response.body);
        throw new Error(
          "Admin login failed. Check credentials or API behavior."
        );
      }

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.token).not.toBeNull();
      expect(response.body).toMatchObject({
        status: "success",
        message: "User successfully logged in",
      });

      // Save token for subsequent tests
      adminToken = response.body.token;
    }
  );

  dynamicTest(
    "should fail to authenticate with incorrect credentials",
    testScenarios.invalidLogin,
    async () => {
      const invalidPayload = {
        email: "UnknownAdmin",
        password: "WrongPassword",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(invalidPayload);

      // Validate that the login attempt fails
      expect(response.statusCode).toBe(400); // Bad Request
      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    }
  );
});

afterAll(async () => {
  await db.sequelize.close(); // close the database connection after all
});
