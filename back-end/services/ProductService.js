const { Product, Brand, Category, User, Review } = require("../models");

class ProductService {
  // Function to create a new product
  async create(productData) {
    try {
      // Create a new product in the database
      const newProduct = await Product.create(productData);
      return newProduct; // Return the created product
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Unable to create product"); // Throw an error to handle it in the controller
    }
  }

  // Function to get all products
  async getAll() {
    const query = `
        SELECT 
            Products.*, 
            Brands.name AS brand, 
            Categories.name AS category 
        FROM Products
        LEFT JOIN Brands ON Products.BrandId = Brands.id
        LEFT JOIN Categories ON Products.CategoryId = Categories.id
    `;
    return await Product.sequelize.query(query, {
      type: Product.sequelize.QueryTypes.SELECT,
    });
  }

  // Function to get the latest products
  async getLatestProducts() {
    try {
      const latestProducts = await Product.findAll({
        where: { isdeleted: false },
        order: [["date_added", "DESC"]],
        limit: 10,
      });

      return latestProducts.map((product) => ({
        ...product.toJSON(),
        price: parseFloat(product.price), // Ensure price is a number
      }));
    } catch (error) {
      console.error("Error fetching latest products:", error);
      throw new Error("Unable to fetch latest products");
    }
  }

  // Function to get a product by its ID
  async getById(id) {
    try {
      const product = await Product.findByPk(id, {
        include: [Brand, Category], // Ensure Brand and Category are included
      });
      return product; // Return the product object with included Brand and Category
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw new Error("Unable to fetch product");
    }
  }

  // Fetch products by category name
  // Fetch products by category name
  async getProductsByCategory(categoryName) {
    try {
      const products = await Product.findAll({
        where: { isdeleted: false }, // Exclude deleted products
        include: [
          {
            model: Category,
            where: { name: categoryName }, // Filter by category name
            attributes: [], // Exclude category attributes from result
          },
        ],
      });
      return products;
    } catch (error) {
      console.error("Error fetching products by category:", error.message);
      throw new Error("Failed to fetch products by category");
    }
  }

  // Function to update a product by its ID
  // Update a product
  async update(productId, productData) {
    const {
      name,
      description,
      price,
      quantity,
      date_added,
      imgurl,
      brandName,
      categoryName,
      status,
      isDeleted,
      discount,
    } = productData;

    try {
      // Find the product by ID
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Find or create the brand
      let brand = null;
      if (brandName) {
        [brand] = await Brand.findOrCreate({ where: { name: brandName } });
      }

      // Find or create the category
      let category = null;
      if (categoryName) {
        [category] = await Category.findOrCreate({
          where: { name: categoryName },
        });
      }

      // Determine the product status based on quantity
      const productStatus = quantity > 0 ? "available" : "out-of-stock";

      // Calculate discounted price if applicable
      const discountedPrice = discount
        ? parseFloat((price - price * (discount / 100)).toFixed(2))
        : price;

      // Update the product
      await product.update({
        name,
        description,
        price: discountedPrice,
        quantity,
        date_added,
        imgurl,
        status: status || productStatus,
        discount,
        BrandId: brand ? brand.id : product.BrandId, // Keep existing brand if not updated
        CategoryId: category ? category.id : product.CategoryId, // Keep existing category if not updated
        isdeleted: isDeleted !== undefined ? isDeleted : product.isdeleted, // Keep current value if not provided
      });

      return product; // Return the updated product
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Unable to update product");
    }
  }

  // Function to delete a product by its ID
  async delete(productId) {
    // Fetch the product by ID
    const product = await Product.findByPk(productId);

    // If product doesn't exist, throw an error
    if (!product) {
      throw new Error("Product not found");
    }

    // If the product is already marked as deleted, throw an error
    if (product.isdeleted) {
      throw new Error("Product is already deleted");
    }

    // Mark the product as deleted (soft delete)
    product.isdeleted = true;
    await product.save(); // Save the updated product to the database

    return product; // Return the updated product
  }

  // Function to undelete a product by its ID
  async undelete(productId) {
    try {
      // Find the product by ID
      const product = await Product.findByPk(productId);

      // If product doesn't exist, throw an error
      if (!product) {
        throw new Error("Product not found");
      }

      // If the product is already active, throw an error
      if (!product.isdeleted) {
        throw new Error("Product is already active");
      }

      // Mark the product as not deleted
      product.isdeleted = false;
      await product.save(); // Save the updated product to the database

      return product; // Return the updated product
    } catch (error) {
      console.error("Error undeleting product:", error);
      throw new Error("Unable to undelete product");
    }
  }

  // Add or update a product review
  async addOrUpdateReview(userId, productId, rating, comment) {
    try {
      // Find or create the review
      const [review, created] = await Review.findOrCreate({
        where: { UserId: userId, ProductId: productId },
        defaults: { rating, comment },
      });

      // Update the review if it already exists
      if (!created) {
        review.rating = rating;
        review.comment = comment;
        await review.save();
      }

      // Update the product's reviews and rating
      const reviews = await Review.findAll({
        where: { ProductId: productId },
        include: [
          { model: User, as: "User", attributes: ["username"] },
          { model: Product, as: "Product", attributes: ["name"] },
        ],
      });
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;

      const product = await Product.findByPk(productId);
      if (product) {
        product.numOfReviews = reviews.length;
        product.rating = averageRating;
        await product.save();
      }

      return { review, product };
    } catch (error) {
      console.error("Error adding or updating review:", error);
      throw new Error("Unable to add or update review.");
    }
  }

  // Fetch all reviews for a product
  async getReviews(productId) {
    try {
      const reviews = await Review.findAll({
        include: [
          {
            model: User,
            as: "User", // Use the alias defined in the Review model
            attributes: ["id", "username"], // Include specific user fields
          },
          {
            model: Product,
            as: "Product", // Use the alias defined in the Review model
            attributes: ["id", "name"], // Include specific product fields
          },
        ],
      });
      return reviews;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw new Error("Unable to fetch reviews for the product.");
    }
  }

  // Fetch all reviews
  async getAllReviews() {
    try {
      const reviews = await Review.findAll({
        include: [
          {
            model: User,
            as: "User", // Use the alias defined in the Review model
            attributes: ["id", "username"], // Include specific User fields
          },
          {
            model: Product,
            as: "Product", // Optionally include Product if needed
            attributes: ["id", "name"], // Include specific Product fields
          },
        ],
      });
      return reviews;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }

  // Delete a review for a product
  async deleteReview(productId, reviewId, userId) {
    try {
      // Find the review by its ID and ensure it belongs to the product
      const review = await Review.findOne({
        where: {
          id: reviewId,
          productId: productId,
        },
      });

      if (!review) {
        throw new Error("Review not found or does not belong to the product");
      }

      // Optionally check if the user is the creator of the review (if needed)
      if (review.userId !== userId) {
        throw new Error("You are not authorized to delete this review");
      }

      // Delete the review
      await review.destroy();

      return { message: "Review deleted successfully" };
    } catch (error) {
      throw new Error(error.message || "Failed to delete review");
    }
  }
}

module.exports = new ProductService();
