module.exports = {
  createBrand: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the brand to be created.",
        example: "Samsung",
      },
    },
    required: ["name"],
  },

  updateBrand: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Updated name of the brand.",
        example: "Apple",
      },
    },
    required: ["name"],
  },

  deleteBrand: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "ID of the brand to delete.",
        example: 1,
      },
    },
    required: ["id"],
  },

  createCategory: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the category to be created.",
        example: "Electronics",
      },
    },
    required: ["name"],
  },

  updateCategory: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Updated name of the category.",
        example: "Home Appliances",
      },
    },
    required: ["name"],
  },

  deleteCategory: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "ID of the category to delete.",
        example: 1,
      },
    },
    required: ["id"],
  },

  createOrder: {
    type: "object",
    properties: {
      userId: {
        type: "integer",
        description: "ID of the user placing the order.",
        example: 123,
      },
    },
    required: ["userId"],
  },

  updateOrderStatus: {
    type: "object",
    properties: {
      status: {
        type: "string",
        description: "The new status of the order.",
        example: "Shipped",
      },
    },
    required: ["status"],
  },

  deleteOrder: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "ID of the order to delete.",
        example: 1,
      },
    },
    required: ["id"],
  },

  orderDetails: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "Order ID.",
        example: 1,
      },
      userId: {
        type: "integer",
        description: "ID of the user who placed the order.",
        example: 123,
      },
      status: {
        type: "string",
        description: "The current status of the order.",
        example: "Pending",
      },
      items: {
        type: "array",
        description: "List of items in the order.",
        items: {
          type: "object",
          properties: {
            productId: {
              type: "integer",
              description: "ID of the product in the order.",
              example: 101,
            },
            quantity: {
              type: "integer",
              description: "Quantity of the product.",
              example: 2,
            },
            price: {
              type: "number",
              description: "Price of the product.",
              example: 99.99,
            },
          },
        },
      },
      totalPrice: {
        type: "number",
        description: "Total price of the order.",
        example: 199.98,
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the order was created.",
        example: "2023-01-01T12:00:00Z",
      },
    },
  },

  recalculateMembership: {
    type: "object",
    properties: {
      userId: {
        type: "integer",
        description:
          "ID of the user whose membership discount is being recalculated.",
        example: 123,
      },
    },
    required: ["userId"],
  },

  latestProducts: {
    type: "array",
    description: "An array of the latest products added to the store.",
    items: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "The ID of the product",
          example: 1,
        },
        name: {
          type: "string",
          description: "The name of the product",
          example: "Wireless Headphones",
        },
        description: {
          type: "string",
          description: "The product description",
          example: "Noise-cancelling wireless headphones.",
        },
        price: {
          type: "number",
          description: "The price of the product",
          example: 99.99,
        },
        category: {
          type: "string",
          description: "The category of the product",
          example: "Electronics",
        },
        brand: {
          type: "string",
          description: "The brand of the product",
          example: "Sony",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "The date and time the product was added",
          example: "2023-01-01T12:00:00Z",
        },
      },
    },
  },

  addProductToCart: {
    type: "object",
    properties: {
      productId: {
        type: "integer",
        description: "ID of the product to add to the cart.",
        example: 101,
      },
      quantity: {
        type: "integer",
        description: "Quantity of the product to add to the cart.",
        example: 2,
      },
    },
    required: ["productId", "quantity"],
  },

  updateCartItem: {
    type: "object",
    properties: {
      productId: {
        type: "integer",
        description: "ID of the product to update in the cart.",
        example: 101,
      },
      quantity: {
        type: "integer",
        description: "Updated quantity of the product in the cart.",
        example: 3,
      },
    },
    required: ["productId", "quantity"],
  },

  deleteCartItem: {
    type: "object",
    properties: {
      productId: {
        type: "integer",
        description: "ID of the product to remove from the cart.",
        example: 101,
      },
    },
    required: ["productId"],
  },

  updateOrderStatus: {
    type: "object",
    properties: {
      status: {
        type: "string",
        description: "The new status of the order.",
        example: "Shipped",
      },
    },
    required: ["status"],
  },

  createProduct: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the product.",
        example: "Smartphone",
      },
      description: {
        type: "string",
        description: "Description of the product.",
        example: "A high-end smartphone with 128GB storage.",
      },
      price: {
        type: "number",
        description: "Price of the product.",
        example: 699.99,
      },
      quantity: {
        type: "integer",
        description: "Available quantity of the product.",
        example: 50,
      },
      date_added: {
        type: "string",
        format: "date",
        description: "Date the product was added.",
        example: "2024-01-01",
      },
      imgurl: {
        type: "string",
        description: "URL of the product image.",
        example: "https://example.com/images/product.jpg",
      },
      status: {
        type: "string",
        description: "Status of the product (e.g., 'active', 'inactive').",
        example: "active",
      },
      brandName: {
        type: "string",
        description: "Name of the brand associated with the product.",
        example: "Samsung",
      },
      categoryName: {
        type: "string",
        description: "Name of the category associated with the product.",
        example: "Electronics",
      },
    },
    required: [
      "name",
      "description",
      "price",
      "quantity",
      "date_added",
      "imgurl",
      "status",
      "brandName",
      "categoryName",
    ],
  },

  updateProduct: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Updated name of the product.",
        example: "Smartphone",
      },
      description: {
        type: "string",
        description: "Updated description of the product.",
        example: "An updated description for the smartphone.",
      },
      price: {
        type: "number",
        description: "Updated price of the product.",
        example: 599.99,
      },
      quantity: {
        type: "integer",
        description: "Updated available quantity of the product.",
        example: 30,
      },
      status: {
        type: "string",
        description: "Updated status of the product.",
        example: "inactive",
      },
    },
    required: [],
  },

  createReview: {
    type: "object",
    properties: {
      rating: {
        type: "integer",
        description: "Rating for the product (1-5).",
        example: 5,
      },
      comment: {
        type: "string",
        description: "Review comment for the product.",
        example: "Excellent product!",
      },
      productId: {
        type: "integer",
        description: "ID of the product being reviewed.",
        example: 101,
      },
    },
    required: ["rating", "comment", "productId"],
  },

  getAllReviewsResponse: {
    type: "array",
    description: "An array of all reviews across all products.",
    items: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "The ID of the review.",
          example: 1,
        },
        productId: {
          type: "integer",
          description: "The ID of the product the review is associated with.",
          example: 101,
        },
        userId: {
          type: "integer",
          description: "The ID of the user who wrote the review.",
          example: 5,
        },
        rating: {
          type: "integer",
          description: "The rating given in the review (1-5).",
          example: 4,
        },
        comment: {
          type: "string",
          description: "The comment left by the user in the review.",
          example: "Great product! Highly recommended.",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "The date and time when the review was created.",
          example: "2024-01-01T12:00:00Z",
        },
      },
    },
  },

  deleteReview: {
    type: "object",
    properties: {
      reviewId: {
        type: "integer",
        description: "The ID of the review to delete.",
        example: 1,
      },
      userId: {
        type: "integer",
        description: "The ID of the user performing the deletion.",
        example: 5,
      },
    },
    required: ["reviewId"],
  },

  searchProduct: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The name of the product to search for.",
        example: "MacBook Pro",
      },
      category: {
        type: "string",
        description: "The category of the product.",
        example: "Electronics",
      },
      brand: {
        type: "string",
        description: "The brand of the product.",
        example: "Apple",
      },
      page: {
        type: "integer",
        description: "The page number for pagination.",
        example: 1,
      },
      limit: {
        type: "integer",
        description: "The number of results per page.",
        example: 10,
      },
    },
    required: [],
  },

  UserRegistration: {
    type: "object",
    properties: {
      firstname: {
        type: "string",
        description: "User's first name",
        example: "John",
      },
      lastname: {
        type: "string",
        description: "User's last name",
        example: "Doe",
      },
      username: {
        type: "string",
        description: "Username for login",
        example: "johndoe123",
      },
      email: {
        type: "string",
        description: "User's email address",
        example: "john.doe@example.com",
      },
      password: {
        type: "string",
        description: "Password for login",
        example: "securePassword123",
      },
      address: {
        type: "string",
        description: "User's address",
        example: "123 Elm Street",
      },
      telephone: {
        type: "string",
        description: "User's contact number",
        example: "+1234567890",
      },
    },
    required: [
      "firstname",
      "lastname",
      "username",
      "email",
      "password",
      "address",
      "telephone",
    ],
  },

  UserLogin: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "User's email address",
        example: "john.doe@example.com",
      },
      password: {
        type: "string",
        description: "Password for login",
        example: "securePassword123",
      },
    },
    required: ["email", "password"],
  },

  LogoutResponse: {
    type: "object",
    properties: {
      status: {
        type: "string",
        description: "Indicates the operation status",
        example: "success",
      },
      message: {
        type: "string",
        description: "Message indicating the user was logged out successfully.",
        example: "User logged out successfully",
      },
    },
  },

  UpdateUser: {
    type: "object",
    properties: {
      firstname: {
        type: "string",
        description: "Updated first name of the user",
        example: "Jane",
      },
      lastname: {
        type: "string",
        description: "Updated last name of the user",
        example: "Smith",
      },
      username: {
        type: "string",
        description: "Updated username for login",
        example: "janesmith123",
      },
      email: {
        type: "string",
        description: "Updated email address",
        example: "jane.smith@example.com",
      },
      address: {
        type: "string",
        description: "Updated address",
        example: "456 Oak Street",
      },
      telephone: {
        type: "string",
        description: "Updated contact number",
        example: "+0987654321",
      },
    },
  },

  UpdateUserRole: {
    type: "object",
    properties: {
      role: {
        type: "string",
        description: "The new role to assign to the user",
        example: "Admin",
      },
    },
    required: ["role"],
  },

  UpdateUserMembership: {
    type: "object",
    properties: {
      membershipId: {
        type: "integer",
        description: "The ID of the new membership to assign to the user",
        example: 3,
      },
    },
    required: ["membershipId"],
  },
};
