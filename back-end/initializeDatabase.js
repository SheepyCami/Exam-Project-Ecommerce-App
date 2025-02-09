const axios = require("axios");
const {
  User,
  Role,
  Membership,
  Product,
  Category,
  Brand,
} = require("./models");

async function initializeDatabase() {
  try {
    console.log("Starting database initialization...");

    // Check if the database is already populated
    const userCount = await User.count();
    if (userCount > 0) {
      console.log("Database is already populated.");
      return { status: "error", message: "Database is already populated" };
    }

    // Populate Roles
    console.log("Populating Roles...");
    await Role.bulkCreate([
      { id: 1, name: "Admin" },
      { id: 2, name: "User" },
    ]);

    // Populate Membership tiers
    console.log("Populating Membership tiers...");
    await Membership.bulkCreate([
      { id: 1, name: "Bronze", min: 0, max: null, discount: 0 },
      { id: 2, name: "Silver", min: 15, max: 30, discount: 15 },
      { id: 3, name: "Gold", min: 30, max: null, discount: 30 },
    ]);

    // Create initial Admin user
    console.log("Creating initial Admin user...");
    await User.create({
      username: "Admin",
      password: "P@ssword2023",
      email: "admin@noroff.no",
      firstname: "Admin",
      lastname: "Support",
      address: "Online",
      telephone: "911",
      RoleId: 1,
      MembershipId: 1,
    });

    // Create an initial User
    console.log("Creating initial User...");
    await User.create({
      username: "User1",
      password: "User@123",
      email: "user1@example.com",
      firstname: "John",
      lastname: "Doe",
      address: "123 Main St",
      telephone: "1234567890",
      RoleId: 2,
      MembershipId: 1,
    });

    // Fetch product data from API
    console.log("Fetching product data from API...");
    const { data: apiResponse } = await axios.get(
      "http://backend.restapi.co.za/items/products"
    );
    const products = apiResponse.data;

    for (const product of products) {
      console.log(`Processing product: ${product.name}`);

      // Check and create brand if it doesn't exist
      const [brand] = await Brand.findOrCreate({
        where: { name: product.brand },
      });

      // Check and create category if it doesn't exist
      const [category] = await Category.findOrCreate({
        where: { name: product.category },
      });

      // Create product
      await Product.create({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        date_added: product.date_added,
        imgurl: product.imgurl,
        status: "available",
        BrandId: brand.id,
        CategoryId: category.id,
      });
    }

    console.log("Database initialized successfully.");
    return { status: "success", message: "Database initialized successfully" };
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw new Error("Database initialization failed: " + error.message);
  }
}

module.exports = initializeDatabase;
