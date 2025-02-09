const OrderService = require("../services/OrderService");
// Get a specific order by ID, OrderController:
const { Order, OrderItem, Product, User, Membership } = require("../models");

class OrderController {
  // Create a new order
  static async createOrder(req, res) {
    //#swagger.tags=["Order"]
    //#swagger.description="Create a new order for the logged-in user."
    //#swagger.produces=['application/json']
    try {
      const userId = req.user.id;
      const order = await OrderService.createOrder(userId);
      res.status(201).json({ status: "success", data: order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Get all orders (admin-only) OrderController.js:
  static async getAllOrders(req, res) {
    //#swagger.tags=["Order"]
    //#swagger.description="Retrieve all orders for the logged-in user or admin."
    try {
      const userId = req.user.id;
      const isAdmin = req.user.role === "admin"; // or however you determine if the user is an admin
      const orders = await OrderService.getAllOrders(userId, isAdmin);

      res.status(200).json({ status: "success", data: orders });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Get all orders for the current user, OrderController.js:
  static async getUserOrders(req, res) {
    //#swagger.tags=["Order"]
    //#swagger.description="Retrieve all orders for the logged-in user."
    //#swagger.produces=['application/json']
    try {
      const userId = req.user.id;
      const orders = await OrderService.getUserOrders(userId);
      res.status(200).json({ status: "success", data: orders });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Get a specific order by ID, OrderController:
  static async fetchOrderById(req, res) {
    //#swagger.tags=["Order"]
    //#swagger.description="Fetch a specific order by its ID, including order items and associated product details."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the order to fetch.',
        required: true,
        type: 'integer',
        example: 1
    } */
    try {
      const { id } = req.params; // Extract the order ID from the request parameters

      if (!id) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid order ID" });
      }

      // Fetch the specific order by ID, including order items and associated product details
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            include: [
              { model: Product }, // Include product details for each order item
            ],
          },
          {
            model: User,
            include: { model: Membership, as: "membership" }, // Include user and membership details
          },
        ],
      });

      if (!order) {
        return res
          .status(404)
          .json({ status: "error", message: "Order not found" });
      }

      // Call the calculateOrderSummary function to process order data
      const orderSummary = OrderService.calculateOrderSummary(order);

      res.status(200).json({
        status: "success",
        data: orderSummary, // Return the calculated order summary
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Update the status of an order (admin-only)
  static async updateOrder(req, res) {
    //#swagger.tags=["Order"]
    //#swagger.description="Update the status of an order (Admin-only)."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID of the order to update.',
          required: true,
          type: 'integer',
          example: 1
      }
    */
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'New status for the order.',
          required: true,
          schema: {
              $ref: "#/definitions/updateOrderStatus"
          }
      }
    */
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await OrderService.updateOrder(id, status);
      if (!updatedOrder) {
        return res
          .status(404)
          .json({ status: "error", message: "Order not found" });
      }
      res.status(200).json({
        status: "success",
        message: "Order status updated",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Delete an order (admin-only) OrderController:
  static async deleteOrder(req, res) {
    //#swagger.tags=["Order"]
    //#swagger.description="Delete an order (Admin-only)."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID of the order to delete.',
          required: true,
          type: 'integer',
          example: 1
      }
    */
    try {
      const { id } = req.params;

      // Check if id is valid (you can add further checks here depending on the expected type of `id`)
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid order ID" });
      }

      const deleted = await OrderService.deleteOrder(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ status: "error", message: "Order not found" });
      }

      res
        .status(200)
        .json({ status: "success", message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  // Recalculate membership discount for a user
  static async recalculateMembership(req, res) {
    //#swagger.tags=["Order"]
    //#swagger.description="Recalculate membership discount for the logged-in user."
    //#swagger.produces=['application/json']
    try {
      const userId = req.user.id;
      const discount = await OrderService.recalculateMembership(userId);
      res.status(200).json({
        status: "success",
        message: "Membership recalculated successfully",
        data: discount,
      });
    } catch (error) {
      console.error("Error recalculating membership:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

module.exports = OrderController;
