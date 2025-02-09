![Noroff](http://images.restapi.co.za/pvt/Noroff-64.png)

# Noroff

## Back-end Development Year 1

### EP - Course Assignment Back-end

Noroff back-end development 1 - EP course (e-commerce).

---

## Environment Variables

1. Inside your project directory, create a new .env file (you can use the terminal or file explorer).
2. Use the provided env_example file as a reference for setting up your environment variables.
3. Copy the following information underneath for my .env file used for this project:

back-end .env file:

```bash
ADMIN_USERNAME = ecomadmin
ADMIN_PASSWORD = ecom1234
DATABASE_NAME = ecommerce
DIALECT = "mysql"
DIALECTMODEL = "mysql2"
PORT = "3000"
HOST = "localhost"
JWT_SECRET=a574315d548260e3186c4c3c70a1df2e031e7cd82e2d687ce046db6a3267e0559a7a68e359d93f8abc9416ddf2245e39f9ee3961c80b0d7d0df8e2c4e6e09814
COOKIE_EXPIRES_TIME=7
```

---

# Additional Libraries/Packages

Here are the core libraries and packages used in this project:

**Backend Dependencies:**

1. **axios ^1.7.8** _A promise-based HTTP client for the browser and Node.js, used for making API requests. This library helps in making asynchronous requests and handling responses from RESTful services, simplifying HTTP request handling_
2. **bcrypt ^5.1.1** _A library for hashing passwords. It provides a secure way to hash passwords before storing them in a database and is widely used for authentication purposes in web applications_
3. **bootstrap ^5.3.3** _A popular CSS framework for building responsive and modern web applications. It includes pre-designed components and utilities for quickly styling and laying out your application._
4. **cookie-parser ~1.4.4** _Middleware that parses cookies attached to the client request object. It is commonly used to manage sessions and store user-related information in cookies._
5. **cors ^2.8.5** _A middleware that enables Cross-Origin Resource Sharing (CORS) in Express applications. It allows you to specify which domains are allowed to access your server resources, helping to prevent cross-origin issues_
6. **debug ~2.6.9** _A small debugging utility for tracking application flow. It allows you to log debug information easily based on namespaces, making it simple to track and monitor different parts of your application_
7. **dotenv ^16.4.5** _A zero-dependency module that loads environment variables from a .env file into process.env. It is commonly used for managing configuration variables such as API keys, database credentials, etc._
8. **ejs ^3.1.10** _A templating engine for rendering HTML with JavaScript. EJS allows you to embed JavaScript logic (like loops and conditionals) within HTML templates, enabling dynamic content rendering._
9. **express ^4.21.1** _A fast, unopinionated, minimalist web framework for Node.js. Express simplifies routing and handling HTTP requests, making it a go-to choice for building web applications and APIs._
10. **express-session ^1.18.1** _A simple session middleware for Express. It stores session data (such as user login information) on the server-side, while a session ID is stored on the client-side in a cookie._
11. **http-errors ~1.6.3** _A utility to create HTTP error objects. It is used for throwing errors in a standardized format, making it easier to handle HTTP errors like 404 (Not Found), 500 (Server Error), etc._
12. **jquery ^3.7.1** _A fast, small, and feature-rich JavaScript library. It simplifies tasks like DOM manipulation, event handling, and AJAX requests, making it easier to work with JavaScript in a cross-browser environment._
13. **jsonwebtoken ^9.0.2**_A library for creating and verifying JSON Web Tokens (JWT). JWT is commonly used for authentication and authorization in modern web applications._
14. **morgan ~1.9.1** _logging middleware for recording HTTP requests and responses in your Express application. It helps track request details (such as the method, URL, and response status) for debugging and analysis._
15. **mysql ^2.18.1** _A MySQL client for Node.js that provides APIs to interact with MySQL databases. This package allows you to query, insert, update, and delete data from a MySQL database._
16. mysql2 ^3.11.4 _An improved version of the MySQL client with support for modern features like prepared statements and async/await. It's compatible with MySQL databases and provides better performance and flexibility than the older mysql package._
17. **sequelize ^6.37.5** _A promise-based ORM for Node.js that provides a higher-level abstraction to interact with databases like MySQL. Sequelize helps in defining models, making queries, and handling associations between tables._
18. **swagger-autogen ^2.23.7** _A library to automatically generate Swagger documentation for your Express API. Swagger is a popular tool for describing and documenting RESTful APIs._
19. **swagger-ui-express ^5.0.1** _An Express middleware for serving Swagger UI, a web interface for interacting with and exploring an API's Swagger documentation._

**DevDependencies** 20. **jest ^29.7.0** _A testing framework for JavaScript that focuses on simplicity. It’s used for writing and running tests, ensuring that your code behaves as expected._ 21. **supertest ^7.0.0** _A library for testing HTTP servers. It is commonly used with Jest to make HTTP requests to your backend and test the server’s response._

You can also isntall each package manually by typing:

```
npm install package_name@version
```

---

## Database Setup - Initialize / Restart the database

-This Project contains a database (MySQL) designed in third normal form (3NF)
-You must create your own database for this project.
-Download MySQL Workbench on your computer.
-Create a new database with MySQL Workbench commands like so:

```bash
CREATE DATABASE ecommerce;
USE ecommerce;
CREATE USER 'ecomadmin'@'localhost' IDENTIFIED BY 'ecom1234';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecomadmin'@'localhost' WITH GRANT OPTION;
```

-This line of code, will create a new admin with all priviliges, as well as a new database.
-Add this information in your .env file.

**Initialize the Database**

in your back-end folder, you will find this file:

```
initializeDatabase.js
```

This file is used for the initial database population.
It will populate the database once. All the relevant data from the Noroff API is used to populate the database with the relationships.
The initial data is optained with an API GET call to the Noroff API (http://backend.restapi.co.za/items/products)
This API endpoint will populate the roles table with two roles:
Id of 1 for Admin
Id of 2 for User

---

initial Admin user in the Users table:

```
Username: Admin
Password: P@ssword2023
Email: admin@noroff.no
First Name: Admin
Last Name: Support
Address: Online
Telephone: 911
RoleId: 1,
MembershipId: 1,
```

---

initial User in the Users table:

```
username: "User1",
password: "User@123",
email: "user1@example.com",
firstname: "John",
lastname: "Doe",
address: "123 Main St",
telephone: "1234567890",
RoleId: 2,
MembershipId: 1,
```

---

Populate the membership table with the following data:

```
Bronze with 0% discount
Silver with min 15 and max 30 for a 15% discount
Gold with a min of 30 for a 30% discount
```

---

Locate this line of code in your app.js in the back-end folder:

```bash
node
db.sequelize.sync({ force: false }).then(async () => {
  console.log("Database synced");
```

change this line to:

```bash
node
db.sequelize.sync({ force: true }).then(async () => {
  console.log("Database synced");
```

Start the application by running:

```
npm start
```

**\*IMPORTANT!:** This line is only for the first time you start up the program, or for resetting the database for other reasons! Change back to "false" after the tables have been successfully created and loaded into the database!

---

- The 2 users from the initializeDatabase.js should have been added to the Users table in your database!
- Confirm the users has been sucesffuly created by running the following command in MySQL:

```bash
node
SELECT * FROM ecommerce.users;
```

---

## Generate your_super_secret_key;

- Before testing any of the applications, make sure you generate your secret key first.
- This can be done by entering the following code in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**\*IMPORTANT!:** Make sure you copy this key and save it in **BOTH** your back-end **AND** front-end .env files!!
If they are not **EXACTLY** the same, you will **NOT** be able to authenticate with token!!

---

## Testing Backend Application with Postman - Postman Render Setup

- In order to autherize as an Admin/User user, you need to localize the **Authorization** tab
- Select Auth Type - Bearer Token, and paste the key you received by logging in to the /auth/login endpoint.
- Body tab: Ensure it's set to **raw** and **JSON.**

Auth Routes:

1. POST: /register
   Route to register a new user.
2. POST: /login
   Route to log in a user and authenticate them.
3. POST: /logout
   Route to log out a user.

---

Brand Routes:

1.  GET: /brands
    Route to get all brands.
2.  GET: /brands/:id
    Route to get a specific brand by its ID.
3.  POST: /brands
    Route to create a new brand (Admin only).
4.  PUT: /brands/:id
    Route to update a brand by ID (Admin only).
5.  DELETE: /brands/:id
    Route to delete a brand by ID (Admin only).

---

Category Routes:

1.  GET: /categories
    Route to get all categories.
2.  GET: /categories/:id
    Route to get a specific category by its ID.
3.  POST: /categories
    Route to create a new category (Admin only).
4.  PUT: /categories/:id
    Route to update a category by ID (Admin only).
5.  DELETE: /categories/:id
    Route to delete a category by ID (Admin only).

---

User Routes:

1. POST: /users
   Route to create a new order for a user.
2. GET: /users
   Route to get all orders for a user.
3. GET: /users/:id
   Route to get a specific order by its ID for a user.
4. GET: /users/admin/all
   Route to get all users (Admin only).
5. PUT: /users/admin/:id
   Route to update the order status (Admin only).
6. DELETE: /users/admin/:id
   Route to delete an order (Admin only).

---

Product Routes:

1. POST: /products
   Route to create a new product (Admin only).
2. PUT: /products/:id
   Route to update a product by ID (Admin only).
3. DELETE: /products/:id
   Route to delete a product by ID (Admin only).
4. PUT: /products/:id/undelete
   Route to undelete a product (Admin only).
5. GET: /products/:productId/reviews
   Route to fetch all reviews for a product.
6. POST: /products/reviews
   Route to create or update a product review.
7. DELETE: /products/reviews
   Route to delete a specific product review (Admin only).

---

Review Routes:

1. GET: /reviews
   Route to fetch all product reviews (Admin only).
2. GET: /reviews/:productId
   Route to fetch reviews for a specific product (Admin only).
3. POST: /reviews
   Route to create or update a review.
4. DELETE: /reviews/:id
   Route to delete a review by ID (Admin only).

---

Search Routes:

1. POST: /search
   Route to search for products based on provided criteria (e.g., name, category, brand).

---

Order Routes:

1. POST: /orders
   Route to create a new order for a user. Requires authentication.
2. GET: /orders
   Route to get all orders for a user. Requires authentication.
3. GET: /orders/:id
   Route to get a specific order by ID for a user. Requires authentication.
4. GET: /orders/admin/all
   Route to get all orders (Admin only). Requires authentication and admin role.
5. PUT: /orders/admin/:id
   Route to update an order's status by ID (Admin only). Requires authentication and admin role.
6. DELETE: /orders/admin/:id
   Route to delete an order by ID (Admin only). Requires authentication and admin role.

---

Cart Routes:

---

1. POST: /cart
   Route to add an item to the cart. Requires authentication.
2. GET: /cart
   Route to fetch all items in the cart. Requires authentication.
3. DELETE: /cart
   Route to remove an item from the cart. Requires authentication.
4. PUT: /cart
   Route to update the quantity of an item in the cart. Requires authentication.
5. POST: /cart/checkout
   Route to checkout the cart (submit an order). Requires authentication.
6. GET: /cart/count
   Route to fetch the count of items in the cart. Requires authentication.

---

## Testing Backend Application with Swagger

- The swagger module is located at http://localhost:3000/doc/

- Most of the endpoints are protected by authorization.
- In order to generate your token, press try it out on the /auth/login endpoint
- enter email and username, example:

```bash
{
  "email": "user1@example.com",
  "password": "User@123"
}
```

in your 200 response body, there will be a "token".
copy the token and use it in the Authorization tab in the other endpoints.

## Jest and Supertest - testApp.js

This project uses Jest and Supertest for testing the various API routes and functionalities.

testApp.js is a specialized version of the main application (app.js), created specifically to run tests in a clean and controlled environment. It initializes the database in a way that is suitable for running tests without affecting the main application or production database.

Before running the tests, make sure your database is synced properly with the required setup. Specifically, ensure that force: false is set when syncing the database in app.js for the tests to run successfully.
.
the application has its own test-suits: under tests folder, you will find 2 tests. they are login.test.js and product.test.js. Inorder to run these tests correctly,
Ensure that the following code is included in your app.js:

```bash
db.sequelize.sync({ force: false }).then(async () => {
    console.log('Database synced');
});
```

This is necessary to prevent dropping the tables during sync when running tests. Using force: true would reset the database every time, which could lead to unwanted data loss.

login.test.js:
Tests the login functionality, ensuring that valid credentials return a successful login with the correct response.

## Running Tests with Jest

Run the following command in the terminal to run the Jest tests:

```bash
npm test
```

The following 8 tests will be run:

1. Add a category with the name TEST_CATEGORY
2. Add a brand with the name TEST_BRAND
3. Add a product with the name TEST_PRODUCT, brand must be TEST_BRAND, and category must be TEST_CATEGORY, quantity 10, price 99.99
4. Get the newly created TEST_PRODUCT with all the information, including category and brand name.
5. Change the category name TEST_CATEGORY to TEST_CATEGORY2
6. Change the brand name TEST_BRAND to TEST_BRAND2
7. Get the product TEST_PRODUCT with all the information, including the category and brand name.
8. Delete the TEST_PRODUCT

---

## Additional notes and instructions:

- Some features, like the Orders being affected by Membership have not been completed. When a user is being upgraded to Silver og Gold, all past orders will also be affected. I sadly ran out of time to fix this problem.
- Please see the main readme.md file (located at the root of the project) to see the full reference list used for this project.
- There are more details on why certain choices were made in the Reflection Report located in the Documentation folder.
