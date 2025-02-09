const request = require("supertest");
const { app, initializeTestApp, db } = require("../testApp");
const { Token } = require("../middlewares/testMiddleware");

// Helper for conditional tests
const testScenarios = {
  runCreateCategoryTest: true,
  runCreateBrandTest: true,
  runCreateProductTest: true,
  runGetProductTest: true,
  runUpdateCategoryTest: true,
  runUpdateBrandTest: true,
  runGetUpdatedProductTest: true,
  runDeleteProductTest: true,
};

const dynamicTest = (title, condition, callback) => {
  condition ? it(title, callback) : it.skip(title, callback);
};

// Admin token and resource IDs
let adminToken;
let createdCategoryId;
let createdProductId;
let createdBrandId;

// Initialize the app and generate an admin token
beforeAll(async () => {
  await initializeTestApp(); // Initialize the app and database
  adminToken = Token(); // Generate a valid admin token using the middleware
});

beforeAll(async () => {
  // login as admin and get admin token
  const adminLoginResponse = await request(app).post("/auth/login").send({
    email: "admin@noroff.no",
    password: "P@ssword2023",
  });

  //admin login credentials from initializedatabase:
  //{
  //  "email": "admin@noroff.no",
  //"password": "P@ssword2023"

  if (adminLoginResponse.statusCode !== 200) {
    const errorMsg = JSON.stringify(adminLoginResponse.body, null, 2);
    throw new Error(`Admin login failed: ${errorMsg}`);
  }

  adminToken = adminLoginResponse.body.token;
});

// TEST 1: Add a category with the name TEST_CATEGORY:

describe("Category CRUD Operations", () => {
  dynamicTest(
    "should create a new category as admin",
    testScenarios.runCreateCategoryTest,
    async () => {
      const newCategory = { name: "TEST_CATEGORY" };

      const response = await request(app)
        .post("/categories")
        .set("Authorization", `Bearer ${adminToken}`) // Use the admin token for authorization
        .send(newCategory);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("category");
      expect(response.body.data.category.name).toEqual("TEST_CATEGORY");

      createdCategoryId = response.body.data.category.id; // Store the created category ID for further tests
      console.log("Created Category ID:", createdCategoryId);
    }
  );
});

// TEST 2: Add a brand with the name TEST_BRAND:

describe("Brand CRUD Operations", () => {
  dynamicTest(
    "should create a new brand named TEST_BRAND as admin",
    testScenarios.runCreateBrandTest,
    async () => {
      const newBrand = { name: "TEST_BRAND" };

      const response = await request(app)
        .post("/brands")
        .set("Authorization", `Bearer ${adminToken}`) // Use the admin token for authorization
        .send(newBrand);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.name).toEqual("TEST_BRAND");

      createdBrandId = response.body.data.id; // Store the created Brand ID for further tests
      console.log("Created Brand ID:", createdBrandId);
    }
  );
});

// TEST 3: Add a product with the name TEST_PRODUCT, brand must be TEST_BRAND, and category must be TEST_CATEGORY. quantity 10, price 99,99:

describe("Product CRUD Operations", () => {
  dynamicTest(
    "should create a new product named TEST_PRODUCT, with TEST_BRAND and TEST_CATEGORY, price=99.99, quantity=10.",
    testScenarios.runCreateProductTest,
    async () => {
      const newProduct = {
        name: "TEST_PRODUCT",
        description: "This is just a test product for Jest tests",
        price: 99.99,
        quantity: 10,
        date_added: "2024-12-13T00:00:00.000Z",
        imgurl: "http://example.com/product-image.png",
        status: "available",
        brandName: "TEST_BRAND",
        categoryName: "TEST_CATEGORY",
      };

      const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${adminToken}`) // Use the admin token for authorization
        .send(newProduct);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("product");
      expect(response.body.data.product.name).toEqual("TEST_PRODUCT");

      createdProductId = response.body.data.product.id;
      console.log("Created Product ID:", createdProductId); // test
    }
  );

  // TEST 4: GET the newly created TEST_PRODUCT, with TEST_BRAND and TEST_CATEGORY:
  // Get product by ID:
  dynamicTest(
    "should fetch TEST_PRODUCT by id, with TEST_BRAND and TEST_CATEGORY",
    testScenarios.runGetProductTest,
    async () => {
      console.log("Retrieving Product ID:", createdProductId); // test

      const response = await request(app)
        .get(`/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      console.log("Retrieve Response:", response.body); // test

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("product");
      expect(response.body.data.product.id).toEqual(createdProductId);
      expect(response.body.data.product.name).toEqual("TEST_PRODUCT");
    }
  );

  // TEST 5: Change the category name TEST_CATEGORY to TEST_CATEGORY2:
  dynamicTest(
    "should update TEST_CATEGORY to TEST_CATEGORY2",
    testScenarios.runUpdateCategoryTest,
    async () => {
      const updatedCategory = {
        name: "TEST_CATEGORY2",
      };

      const response = await request(app)
        .put(`/categories/${createdCategoryId}`) // Use the created category ID
        .set("Authorization", `Bearer ${adminToken}`) // Include the admin token
        .send(updatedCategory);

      // Check the status code
      expect(response.statusCode).toEqual(200);

      // Validate the response structure
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("category");
      expect(response.body.data.category.name).toEqual("TEST_CATEGORY2");

      console.log("Updated Category:", response.body.data.category); // Debugging log
    }
  );

  // TEST 6: Change the brand name TEST_BRAND to TEST_BRAND2:

  dynamicTest(
    "should update TEST_BRAND to TEST_BRAND2",
    testScenarios.runUpdateBrandTest,
    async () => {
      const updatedBrand = {
        name: "TEST_BRAND2",
      };

      const response = await request(app)
        .put(`/brands/${createdBrandId}`)
        .set("Authorization", `Bearer ${adminToken}`) // Use the admin token for authorization
        .send(updatedBrand);

      // Validate the response structure
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("brand");
      expect(response.body.data.brand.name).toEqual("TEST_BRAND2");

      console.log("Updated Brand:", response.body.data.brand); // Debugging log
    }
  );

  // TEST 7: Get the product TEST_PRODUCT with all the information, including the category and brand name.
  dynamicTest(
    "should fetch TEST_PRODUCT by id, with TEST_BRAND2 and TEST_CATEGORY2",
    testScenarios.runGetUpdatedProductTest,
    async () => {
      console.log("Retrieving Product ID:", createdProductId); // test

      const response = await request(app)
        .get(`/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      console.log("Retrieve Response:", response.body); // test

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("product");
      expect(response.body.data.product.id).toEqual(createdProductId);
      expect(response.body.data.product.name).toEqual("TEST_PRODUCT");
    }
  );

  // TEST 8: Delete the TEST_PRODUCT

  dynamicTest(
    "should delete the created product as admin",
    testScenarios.runDeleteProductTest,
    async () => {
      const response = await request(app)
        .delete(`/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("product");
      expect(response.body.data.product.id).toEqual(createdProductId);
    }
  );

  afterAll(async () => {
    await db.sequelize.close(); // close connection with database
  });
});
