const ProductService = require("../services/ProductService.js");
const { Brand, Category, Product, User, Review } = require("../models");

class ProductController {
  async getProducts(req, res) {
    //#swagger.tags=["Product"]
    //#swagger.description="Retrieve all available products."
    //#swagger.produces=['application/json']
    try {
      const products = await ProductService.getAll();
      res.status(200).json({
        status: "success",
        statusCode: 200,
        data: {
          message: "All products",
          products,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "An error occurred while retrieving products",
        error: error.message,
      });
    }
  }

  async getProductsByCategory(req, res) {
    //#swagger.tags=["Product"]
    //#swagger.description="Retrieve products by category."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['category'] = {
          in: 'path',
          description: 'Name of the category to fetch products from.',
          required: true,
          type: 'string',
          example: 'Electronics'
    } */
    try {
      const { category } = req.params;

      // Use ProductService to fetch products by category
      const products = await ProductService.getProductsByCategory(category);

      if (products.length === 0) {
        return res.status(404).json({
          status: "error",
          message: `No products found in category: ${category}`,
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          message: `Products in category: ${category}`,
          products,
        },
      });
    } catch (error) {
      console.error("Error fetching products by category:", error.message);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch products by category",
      });
    }
  }

  // Function to create a new product
  async createProduct(req, res) {
    //#swagger.tags=["Product"]
    //#swagger.description="Create a new product."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Product data to create.',
          required: true,
          schema: {
              $ref: "#/definitions/createProduct"
          }
      }
    */
    try {
      const {
        name,
        description,
        price,
        quantity,
        date_added,
        imgurl,
        status,
        brandName,
        categoryName,
      } = req.body;

      // Fetch Brand and Category IDs based on their names
      const brand = await Brand.findOne({ where: { name: brandName } });
      if (!brand) {
        return res.status(404).json({
          status: "fail",
          message: `Brand with name '${brandName}' not found.`,
        });
      }

      const category = await Category.findOne({
        where: { name: categoryName },
      });
      if (!category) {
        return res.status(404).json({
          status: "fail",
          message: `Category with name '${categoryName}' not found.`,
        });
      }

      // Prepare product data with BrandId and CategoryId
      const productData = {
        name,
        description,
        price,
        quantity,
        date_added,
        imgurl,
        status,
        BrandId: brand.id,
        CategoryId: category.id,
      };

      // Call the service to create the product
      const newProduct = await ProductService.create(productData);

      // Include brand and category names in the response
      const productResponse = {
        ...newProduct.toJSON(),
        brand: brand.name,
        category: category.name,
      };

      // Successful response
      res.status(201).json({
        status: "success",
        statusCode: 201,
        data: {
          message: "Product created successfully",
          product: productResponse,
        },
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "An error occurred while creating the product",
        error: error.message,
      });
    }
  }

  //Get product by id, get product details

  async getProductById(req, res) {
    //#swagger.tags=["Product"]
    //#swagger.description="Retrieve a product by its ID."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID of the product to retrieve.',
          required: true,
          type: 'integer',
          example: 1
      }
    */
    try {
      // Extract product ID from the request params
      const { id } = req.params;

      // Fetch the product by ID using the service layer
      const product = await ProductService.getById(id);

      // Check if the product exists
      if (!product) {
        return res.status(404).json({
          status: "error",
          statusCode: 404,
          message: "Product not found",
        });
      }

      // Successful response
      res.status(200).json({
        status: "success",
        statusCode: 200,
        data: {
          message: "Product retrieved successfully",
          product,
        },
      });
    } catch (error) {
      // Log error for debugging
      console.error("Error fetching product by ID:", error);

      // Error response
      res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "An error occurred while retrieving the product",
        error: error.message,
      });
    }
  }

  // update product,
  // Function to update a product
  async updateProduct(req, res) {
    //#swagger.tags=["Product"]
    //#swagger.description="Update an existing product."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID of the product to update.',
          required: true,
          type: 'integer',
          example: 1
      }
    */
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Updated product data.',
          required: true,
          schema: {
              $ref: "#/definitions/updateProduct"
          }
      }
    */
    try {
      const { id } = req.params; // Extract product ID from the request params
      const productData = req.body; // Get updated product data from the request body

      // Call the service to update the product
      const updatedProduct = await ProductService.update(id, productData);

      // Return a success response
      res.status(200).json({
        status: "success",
        statusCode: 200,
        data: {
          message: "Product updated successfully",
          product: updatedProduct,
        },
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "An error occurred while updating the product",
        error: error.message,
      });
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    //#swagger.tags=["Product"]
    //#swagger.description="Soft delete a product by marking it as deleted."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID of the product to delete.',
          required: true,
          type: 'integer',
          example: 1
    } */
    try {
      const productId = req.params.id;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }

      product.isdeleted = true; // Soft delete
      await product.save();

      res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
        data: { product },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to delete product",
      });
    }
  }

  // Undelete a product
  async undeleteProduct(req, res) {
    //#swagger.tags=["Product"]
    //#swagger.description="Restore a previously deleted product."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID of the product to restore.',
          required: true,
          type: 'integer',
          example: 1
    } */
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);

      if (!product) {
        return res
          .status(404)
          .json({ status: "error", message: "Product not found" });
      }

      product.isdeleted = false; // Mark product as active again
      await product.save();

      res
        .status(200)
        .json({ status: "success", message: "Product restored successfully" });
    } catch (error) {
      console.error("Error restoring product:", error);
      res
        .status(500)
        .json({ status: "error", message: "Failed to restore product" });
    }
  }

  // Search products
  async searchProducts(req, res) {
    //#swagger.tags=["Search"]
    //#swagger.description="Search for products based on name, category, or brand."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['name'] = {
      in: 'body',
      description: 'Name of the product to search for.',
      required: false,
      type: 'string',
      example: 'MacBook'
  }
  #swagger.parameters['category'] = {
      in: 'body',
      description: 'Category of the product to search for.',
      required: false,
      type: 'string',
      example: 'Electronics'
  }
  #swagger.parameters['brand'] = {
      in: 'body',
      description: 'Brand of the product to search for.',
      required: false,
      type: 'string',
      example: 'Apple'
  } */
    try {
      const { name, category, brand } = req.body;

      // Validate input data
      if (!name && !category && !brand) {
        return res.status(400).json({
          status: "fail",
          message: "Please provide at least one search parameter.",
        });
      }

      // Perform the search using SearchService
      const products = await SearchService.search(name, category, brand);

      // Check if products were found
      if (products.length === 0) {
        return res.status(404).json({
          status: "success",
          message: "No products found matching the search criteria.",
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          result: "Products found",
          products,
          count: products.length,
        },
      });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while searching for products.",
      });
    }
  }

  // Create or update a product review
  async createProductReview(req, res) {
    //#swagger.tags=["Review"]
    //#swagger.description="Create or update a review for a product."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Details of the review to create or update.',
        required: true,
        schema: {
            $ref: "#/definitions/createReview"
        }
    }
  */
    try {
      const { rating, comment, productId } = req.body;
      const userId = req.user.id;

      if (!rating || !comment || !productId) {
        return res.status(400).json({
          status: "error",
          message: "Rating, comment, and product ID are required.",
        });
      }

      const result = await ProductService.addOrUpdateReview(
        userId,
        productId,
        rating,
        comment
      );

      res.status(200).json({
        status: "success",
        message: "Review added or updated successfully.",
        data: result,
      });
    } catch (error) {
      console.error("Error creating or updating review:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to create or update review.",
        error: error.message,
      });
    }
  }

  // Get all reviews for a product
  async getProductReviews(req, res) {
    //#swagger.tags=["Review"]
    //#swagger.description="Retrieve all reviews for a specific product."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['productId'] = {
        in: 'path',
        description: 'ID of the product to fetch reviews for.',
        required: true,
        type: 'integer',
        example: 1
    }
  */
    try {
      const { productId } = req.params;

      const reviews = await ProductService.getReviews(productId);

      if (!reviews || reviews.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No reviews found for this product.",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Reviews fetched successfully.",
        data: reviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch reviews.",
        error: error.message,
      });
    }
  }

  // Controller to get all reviews
  async getAllReviews(req, res) {
    //#swagger.tags=["Review"]
    //#swagger.description="Retrieve all reviews for all products."
    //#swagger.produces=['application/json']
    try {
      const reviews = await ProductService.getAllReviews();
      res.status(200).json({
        status: "success",
        data: reviews,
      });
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch reviews.",
      });
    }
  }

  // Delete a product review
  async deleteProductReview(req, res) {
    //#swagger.tags=["Review"]
    //#swagger.description="Delete a product review by its ID."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'The ID of the review to delete.',
        required: true,
        type: 'integer',
        example: 1
  } */
    try {
      const reviewId = req.params.id; // Access the review ID from the URL parameter
      const userId = req.user.id; // Assuming the user is authenticated and their ID is available

      if (!reviewId) {
        return res.status(400).json({
          status: "error",
          message: "Review ID is required.",
        });
      }

      // Call ProductService to delete the review
      const result = await ProductService.deleteReview(reviewId, userId);

      res.status(200).json({
        status: "success",
        message: "Review deleted successfully.",
        data: result,
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to delete review.",
        error: error.message,
      });
    }
  }

  // Get latest products
  async getLatestProducts(req, res) {
    //#swagger.tags = ["Product"]
    //#swagger.description = "Retrieve the latest added products."
    //#swagger.produces = ["application/json"]
    try {
      const latestProducts = await ProductService.getLatestProducts(); // Use the service

      if (!latestProducts || latestProducts.length === 0) {
        return res.status(404).json({
          status: "error",
          statusCode: 404,
          message: "No latest products found",
        });
      }

      res.status(200).json({
        status: "success",
        data: latestProducts,
      });
    } catch (error) {
      console.error("Error fetching latest products:", error.message);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch latest products",
      });
    }
  }
}

module.exports = new ProductController();
