# Noroff

## Back-end Development Year 1

### EP - Course Assignment Back-end

- This project involves developing a full-stack e-commerce system by transitioning an existing static website,
  into a dynamic web application with a MySQL database, API endpoints, and an admin interface.
- The system allows registered users to browse and purchase products while providing administrators with tools to manage products, orders, and users.

- The backend was built using Node.js, Express, and Sequelize (ORM), with authentication handled via JWT tokens.
- The database was designed in Third Normal Form (3NF), ensuring efficient data organization and integrity.
- API endpoints will follow RESTful principles, supporting CRUD operations,
  secure user authentication, role-based access control, and proper error handling.

### Key project features include:

- **User Roles & Authentication:** Guest users can browse products, while registered users can add products to their cart and place orders. Admins have full management privileges.
- **Product, Brand, and Category Management:** CRUD functionality with soft deletion to retain historical product data.
- **Cart & Order System:** Users can add in-stock items to their cart and check out, creating an order with a unique tracking number. Order prices remain unchanged even if product prices are later modified.
- **Membership System:** Users progress from Bronze to Silver or Gold based on purchase history, unlocking discounts.
- **Search & Filtering:** Implemented via raw SQL queries for performance optimization.
- **Admin Dashboard:** Built with Express.js and EJS, allowing administrators to manage all aspects of the e-commerce platform.
- **Testing & Documentation:** The backend will include Jest & Supertest for API testing and Swagger documentation for clear API reference.

- This project emphasizes clean code practices (DRY, modular structure),
- security best practices, and maintainability, ensuring a scalable and efficient e-commerce solution.

---

- This Application contains 3 folders, a back-end folder, a front-end folder and a Documentation folder.
- The back-end and front-end applications are running on separate ports.
- The Documentation folder contains a Reflection Report describing the challenges and progression of the project.
- The back-end and front-end are separate applications.
- Below is the guide on how to install, configure, and use the E-commerce project.

## Table of Contents

1. Installation
2. Environment Variables
3. Additional Libraries/Packages
4. NodeJS Version Used
5. Database Setup - Restart the Database
6. Generate your_super_secret_key;
7. Testing the Frontend Application:
8. Viewing as a Guest (non-registered user):
9. Viewing as a User:
10. Viewing as an Admin:
11. Testing Backend Application with Postman - Postman Render Setup
12. Testing Backend Application with Swagger
13. Jest and Supertest
14. Running tests with Jest
15. Additional notes and instructions
16. References

---

## Installation

1. Download the Project Files or Clone the repository from my github:

```bash
  git clone <your-repository-url>
  cd my-project
```

2. Set your directory folder for running the project.
   **\*IMPORTANT!:**Because this Application contains 2 seperate application folders,
   you need to install the packages in both the back-end AND the front-end folders!

For Example:

```
cd "\Skrivebord\examp_v1\ep-ca-1-SheepyCami\back-end"
cd "\Skrivebord\examp_v1\ep-ca-1-SheepyCami\front-end"
```

3.  **Install dependencies:** Once inside the project directory, install the necessary dependencies by running in both folders:

```bash
 npm install
```

All required packages are listed in the package.json file of both back-end and front-end folders.
You can also manually install the required packages by using the command:

```
npm install package_name@version
```

Refer to the package.json file for the exact versions of the packages used in this project.

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

front-end .env file:

```bash
PORT = "3001"
HOST = "localhost"
JWT_SECRET=a574315d548260e3186c4c3c70a1df2e031e7cd82e2d687ce046db6a3267e0559a7a68e359d93f8abc9416ddf2245e39f9ee3961c80b0d7d0df8e2c4e6e09814
COOKIE_EXPIRES_TIME=7
```

- Make sure the .env file is included in your .gitignore file to avoid exposing sensitive information.

---

## Additional Libraries/Packages

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

**Frontend Dependencies:**

20. **bootstrap-icons ^1.11.3** _A collection of over 1,000 open-source icons that can be used to enhance your application’s interface with scalable, customizable icons._
21. **express-ejs-layouts ^2.5.1** _A plugin for Express.js that allows you to use a common layout for all pages, making it easier to organize common page elements like headers and footers in EJS templates._
22. **js-cookie ^3.0.5** _A simple, lightweight JavaScript library for managing cookies. It provides a clean API for reading, setting, and deleting cookies in the browser, making it easier to work with client-side cookies._
23. **start ^5.1.0** _A simple, lightweight development server used to quickly start your application for testing and development purposes._

    **DevDependencies**

24. **jest ^29.7.0** _A testing framework for JavaScript that focuses on simplicity. It’s used for writing and running tests, ensuring that your code behaves as expected._
25. **supertest ^7.0.0** _A library for testing HTTP servers. It is commonly used with Jest to make HTTP requests to your backend and test the server’s response._

You can also isntall each package manually by typing:

```
npm install package_name@version
```

---

## NodeJS Version Used

The project was developed using Node.js version **v22.2.0** Ensure you are using this version or a compatible version.
You can check your current Node.js version by running:

```
node -v
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

Populate the membership table with the following data:

```
Bronze with 0% discount
Silver with min 15 and max 30 for a 15% discount
Gold with a min of 30 for a 30% discount
```

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

## Testing the Frontend Application:

- In order for the front-end to run, you also need to run the back-end on a **second terminal.**
- Make sure both applications are running **simultaneously**
  The front-end is running on port 3001, while backend is running on port 3000.
  **\*IMPORTANT!:** Before starting the application, make sure your super secret key is \*\*EXACTLY\*\* the same as the key in your back-end folder!!

- The index/home page for this application runs by entering:

```bash
http://localhost:3001/
```

If you cannot see anything, its most likely because you typed 3000 which is the backend's index file!

### Viewing as a Guest (non-registered user):

- Guest Users are any users that have not registered.
- Guest Users should be able to register.
- A Guest user is anonymous.
- Guest users cannot add anything to their cart or buy any items.
- Guest users can view and search for products

### Viewing as a User:

- Registered users will have carts and orders.
- Each user has a membership status based on how many items have been purchased - the total quantity of items purchased.
- A newly registered member has a default Bronze membership status
- The membership status will give users a discount based on the number of items purchased (the total quantity).
- When a user registers, the default role is User.
- Each user have their own dashboard with all orders, and profile information, as well as their own cart.

### Viewing as an Admin:

- Access to the Admin Dashboard
- The Admin Dashboard can perform CRUD opertaions on brands, categories, products, users, orders, memberships and reviews.
- Admin user roles can change registered/signed-up user roles to admin with the admin user interface.
- Admin user roles can add/edit/delete records. (The admin role cannot change Orders, except the status of the order)
- A user cannot be registered as the Admin role through the API /auth/register endpoint
- Only Admins can change/edit product information
- Admins can delete a product with a soft-delete, the product will not be permanently removed from the database.
- Only Admins can edit/change category information.
- Only Admins can edit/change brand information
- Only an admin user can change order status.

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

## Jest and Supertest

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

please see the readme.md files for both frontend and backend for more specific instructions.
Please see the documentation folder for more information on the development of this project.

---

## References:

1. Udemy Courses:
   - Natours app - Master Node by building a real-world RESTful API and web app (with authentication, Node.js security, payments & more). Udemy.
   - ShopIT e-commerce - Build Powerful E-commerce Project using React, Redux Toolkit, Node.js, Express, MongoDB, Stripe from DEV to DEPLOYMENT. Udemy.
   - Lebaba e-commerce - This is a full-featured e-commerce project using the MERN stack (MongoDB, Express.js, React, Node.js). Udemy.
2. Noroff Code:
   - Srv m3: RV - Module 3 - TDD lesson. Retrieved from https://github.com/noroff-bed1/srv_m3_l4_tdd
3. AI Used:
   - ChatGPT. (2024).
   - User login test, sourced from Noroff's module 3.4. Test Driven Development (TDD) - User login test.
4. Tutorials and Videos:
   - Node and Express - Connect to MySQL Database with Sequelize. Retrieved from https://www.youtube.com/watch?v=pKhdNPN4b1g&list=PL2HhFRI8JWYGr93nOp19qCCSr9Rj3VTcy&index=19&t=726s
   - Sequelize Tutorial: Episode 4 - Model Querying. Retrieved from https://www.youtube.com/watch?v=jWdVy265Q-A&list=PL2HhFRI8JWYGr93nOp19qCCSr9Rj3VTcy&index=21
   - How to Create a Stunning Portfolio Website with Nextjs, Tailwind CSS and Framer-motion. Retrieved from https://www.youtube.com/watch?v=Yw7yWHigGKI&list=PL2HhFRI8JWYGr93nOp19qCCSr9Rj3VTcy&index=13
   - Responsive Portfolio Website From Scratch. Retrieved from https://www.youtube.com/watch?v=ldwlOzRvYOU&list=PL2HhFRI8JWYGr93nOp19qCCSr9Rj3VTcy&index=14
5. Source Code References:
   - Codes for Token, sendToken, JWT: Inspired from the Udemy course Master Node by building a real-world RESTful API and web app (with authentication, Node.js security, payments & more), Section 10: Authentication, Authorization, and Security.
   - Authentication/Middleware Code: Sourced from Noroff’s own project files in the server section: srv m3. Available on GitHub.
   - API’s and API Design: Inspired by Master Node by building a real-world RESTful API and web app (with authentication, Node.js security, payments & more), Section 6: Express: Let’s Start Building the Natours API!
   - Web Design and Layout: Main inspiration for the webpage design and layout was Komplett (Komplett.no).
   - CSS, Styling, Headers, Footer, Components: Heavily inspired by the ShopIT app from Udemy: Build Powerful E-commerce Project using React, Redux Toolkit, Node.js, Express, MongoDB, Stripe from DEV to DEPLOYMENT.
   - Database Connection (Models/Index.js): Direct copy with minimal changes from the index.js file in Noroff's srv m3 folder.
   - Models: Inspired from the following Udemy tutorials: Build Powerful E-commerce Project using React, Redux Toolkit, Node.js, Express, MongoDB, Stripe from DEV to DEPLOYMENT and This is a full-featured e-commerce project using the MERN stack (MongoDB, Express.js, React, Node.js).
   - Frontend Javascript Management Files: Heavily sourced from AI (ChatGPT). Retrieved from https://chatgpt.com/.
   - Frontend Tables, Modals, EJS Files: Heavily sourced from AI (ChatGPT). Retrieved from https://chatgpt.com/.
   - Backend Controller and Service Files: Functions and file structure inspired by the ShopIT app. Build Powerful E-commerce Project using React, Redux Toolkit, Node.js, Express, MongoDB, Stripe from DEV to DEPLOYMENT.
   - Routes: Heavily inspired by the ShopIT app. Build Powerful E-commerce Project using React, Redux Toolkit, Node.js, Express, MongoDB, Stripe from DEV to DEPLOYMENT.
   - Swagger and Jest: Assistance from ChatGPT, as well as Noroff's tutorial on Test Driven Development (TDD), Section 3.4: Setting up for test driven development. Retrieved from https://noroff.bravais.com/s/4sjBtVQSL2YDXmkDOaVB.
