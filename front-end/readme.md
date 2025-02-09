![Noroff](http://images.restapi.co.za/pvt/Noroff-64.png)

# Noroff

## Back-end Development Year 1

### EP - Course Assignment Front-end

Startup code for Noroff back-end development 1 - EP course (e-commerce).

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![IMPORTANT](http://images.restapi.co.za/pvt/important_icon.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

Only your main branch will be graded.

![HELP](http://images.restapi.co.za/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

front-end .env file:

```bash
PORT = "3001"
HOST = "localhost"
JWT_SECRET=a574315d548260e3186c4c3c70a1df2e031e7cd82e2d687ce046db6a3267e0559a7a68e359d93f8abc9416ddf2245e39f9ee3961c80b0d7d0df8e2c4e6e09814
COOKIE_EXPIRES_TIME=7
```

- Make sure the .env file is included in your .gitignore file to avoid exposing sensitive information.

---

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
- I added a User Dashboard (mypage) for users to be able to view their orders and membership
- Please notice that the reviews in the dashboard does not function.
- When a user purchase 15 - 30 items they will be upgraded to a Silver member, and receive a 15% bonus.
- When a user purscase 30 ore more items, they will become a Gold member, and receive a 30% discount.
- a user cannot, place more products than the quantity available to their cart.
- A user cannot, add a product that have been deleted to their cart (soft deleted status)
- A user can keep track of their membership level, by accesing: http://localhost:3001/users/mypage/profile
- A user can keep track of their orders by accesing: http://localhost:3001/orders
- Each user has a membership status based on how many items have been purchased - the total quantity of items purchased.
- A newly registered member has a default Bronze membership status
- The membership status will give users a discount based on the number of items purchased (the total quantity).
- When a user registers, the default role is User.
- Each user have their own dashboard with all orders, and profile information, as well as their own cart.

login by going to this endpoint:

```bash
http://localhost:3001/auth/login
```

User login from the Database:

```bash
{
  "email": "user1@example.com",
  "password": "User@123"
}
```

### Viewing as an Admin:

- Access to the Admin Dashboard
- The Admin Dashboard can perform CRUD opertaions on brands, categories, products, users and orders.
- Admin user roles can change registered/signed-up user roles to admin with the admin user interface.
- Admin user roles can add/edit/delete records. (The admin role cannot change Orders, except the status of the order)
- A user cannot be registered as the Admin role through the API /auth/register endpoint
- Only Admins can change/edit product information
- Admins can delete a product with a soft-delete, the product will not be permanently removed from the database.
- Only Admins can edit/change category information.
- Only Admins can edit/change brand information
- Only an admin user can change order status.

Admin login from the database:

```bash
{
  "email": "admin@noroff.no",
  "password": "P@ssword2023"
}
```

---

## Additional notes and instructions:

- For more information on node packages used for this project, see the main rewadme.md file located in the root of the project.
- I cannot stress enough, how important it is for the super secret key to be an exact match of the backend folders key! Please make sure the keys match in both of the .env folders!
- In the Admin dashboard, especially in the products and orders table, some features might be missing due to time constraints.
- The search function sadly does not work in frontend, but please feel free to try it in backend!
- The Reviews function in frontend was not completed, and a user cannot post or get reviews, try it in the backend!
- For more details on this project, please see the Reflection Report located in the Documentation folder!
