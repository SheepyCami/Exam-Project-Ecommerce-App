const CartService = require("../services/CartService");
const OrderService = require("../services/OrderService");
const { Membership, User } = require("../models");

class CartController {
  // Add an item to the cart
  static async addProductToCart(req, res) {
    //#swagger.tags=["Cart"]
    //#swagger.description="A registered user can add items to cart"
    /*#swagger.parameters['body'] = {
        name: 'body',
        in: 'body',
        description: 'A registered user can add items to cart',
        required: true,
        schema: {
            $ref: "#/definitions/addProductToCart"
        }
    } */
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      // Call CartService to add the item
      const cartItem = await CartService.addProductToCart(
        userId,
        productId,
        quantity
      );
      res.status(201).json({ status: "success", data: cartItem });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

 
  // Retrieve the user's cart
static async getCart(req, res) {
  //#swagger.tags=["Cart"]
  //#swagger.description="Retrieve the user's cart, including items and price details."
  //#swagger.produces=['application/json']
  /* #swagger.parameters['userId'] = {
      in: 'header',
      description: 'User ID (from JWT token)',
      required: true,
      type: 'integer',
      example: 1
  } */
    try {
      const userId = req.user.id;
      const cart = await CartService.getCart(userId);

      if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No items found in cart",
        });
      }

      const user = await User.findByPk(userId, {
        include: { model: Membership, as: "membership" },
      });

      const discountPercentage = user.membership ? user.membership.discount : 0;
      const totalPrice = cart.CartItems.reduce(
        (total, item) => total + item.unit_price * item.quantity,
        0
      );
      const discountAmount = (totalPrice * discountPercentage) / 100;
      const finalPrice = totalPrice - discountAmount;

      res.status(200).json({
        status: "success",
        data: {
          CartItems: cart.CartItems,
          totalPrice,
          discountPercentage,
          discountAmount,
          finalPrice,
        },
      });
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Update an item in the cart
  static async updateCartItem(req, res) {
    //#swagger.tags=["Cart"]
    //#swagger.description="A registered user can update items in their cart"
    /*#swagger.parameters['body'] = {
        name: 'body',
        in: 'body',
        description: 'A registered user can update items in their cart',
        required: true,
        schema: {
            $ref: "#/definitions/UpdateCartItem"
        }
    } */
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      // Call CartService to update the cart item
      const updatedCartItem = await CartService.updateCartItem(
        userId,
        productId,
        quantity
      );
      res.status(200).json({ status: "success", data: updatedCartItem });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }


  // Delete an item from the cart
  static async deleteCartItem(req, res) {
    //#swagger.tags=["Cart"]
    //#swagger.description="A registered user can remove items from their cart"
    /*#swagger.parameters['body'] = {
      name: 'body',
      in: 'body',
      description: 'A registered user can remove items from their cart',
      required: true,
      schema: {
          $ref: "#/definitions/deleteCartItem"
      }
  } */
    try {
      const userId = req.user.id;
      const { productId } = req.body;

      // Call the service method to remove the item
      const response = await CartService.deleteCartItem(userId, productId);

      // Send success response with the message from the service
      res.status(200).json({ status: "success", message: response.message });
    } catch (error) {
      console.error("Error removing cart item:", error.message);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Checkout the cart and create an order
  static async checkoutCart(req, res) {
    //#swagger.tags=["Cart"]
    //#swagger.description="A registered user can checkout the cart"

    try {
      const userId = req.user.id;
      const {
        order,
        totalPrice,
        discountPercentage,
        discountAmount,
        finalPrice,
      } = await CartService.checkoutCart(userId);
      res.status(200).json({
        status: "success",
        data: {
          order,
          totalPrice,
          discountPercentage,
          discountAmount,
          finalPrice,
        },
      });
    } catch (error) {
      console.error("Error checking out cart:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

module.exports = CartController;
