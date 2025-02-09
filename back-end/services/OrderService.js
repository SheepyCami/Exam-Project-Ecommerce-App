const { Order, OrderItem, User, Product, Membership } = require("../models");
const { v4: uuidv4 } = require("uuid");
const CartService = require("../services/CartService");

class OrderService {
  static async createOrder(userId) {
    const orderNumber = uuidv4().slice(0, 8); // Unique order number
    const user = await User.findByPk(userId);
    const cart = await user.getCarts({
      where: { status: "active" },
      include: [{ model: OrderItem, include: Product }],
    });

    if (!cart.length) {
      throw new Error("No active cart found");
    }

    const activeCart = cart[0];
    const order = await Order.create({
      orderNumber, // Use 'orderNumber' instead of 'OrderId'
      UserId: userId,
      status: "In Progress",
      membership: user.MembershipId, // Store the user's membership at the time of the order
    });

    let totalPrice = 0;

    for (const item of activeCart.CartItems) {
      await OrderItem.create({
        OrderId: order.id, // 'OrderId' is still the foreign key in OrderItem model
        ProductId: item.ProductId,
        quantity: item.quantity,
        unit_price: item.unit_price,
      });

      const product = await Product.findByPk(item.ProductId);
      product.quantity -= item.quantity;
      await product.save();

      totalPrice += item.unit_price * item.quantity;
    }

    activeCart.status = "completed";
    await activeCart.save();

    // Recalculate the discount based on the user's membership at the time of the order
    const discountPercentage = await CartService.recalculateMembership(userId);

    const discountAmount = totalPrice * (discountPercentage / 100);
    const finalPrice = totalPrice - discountAmount;

    return {
      order,
      totalPrice,
      discountPercentage,
      discountAmount,
      finalPrice,
    };
  }

  static async getAllOrders() {
    try {
      // Fetch all orders with their associated order items and products
      const orders = await Order.findAll({
        include: [
          {
            model: OrderItem,
            include: [{ model: Product }],
          },
          {
            model: User,
            include: { model: Membership, as: "membership" }, // Include user and membership details
          },
        ],
        logging: console.log, // Log SQL query to debug
      });

      // If no orders are found
      if (orders.length === 0) {
        console.log("No orders found.");
      }

      // Loop through the orders and calculate the order summary
      const ordersWithSummary = await Promise.all(
        orders.map(async (order) => {
          let totalPrice = 0;
          let discountPercentage = 0;

          // Calculate total price from OrderItems
          for (const item of order.OrderItems) {
            totalPrice += item.unit_price * item.quantity;
          }

          // Get the discount percentage from the user's membership
          discountPercentage = order.User?.membership?.discount || 0;
          const discountAmount = (totalPrice * discountPercentage) / 100;
          const finalPrice = totalPrice - discountAmount;

          // Add calculated values to order.dataValues
          order.dataValues.totalPrice = parseFloat(totalPrice.toFixed(2)); // Store total price as a float with 2 decimals
          order.dataValues.discountPercentage = discountPercentage;
          order.dataValues.discountAmount = parseFloat(
            discountAmount.toFixed(2)
          ); // Store discountAmount as a float with 2 decimals
          order.dataValues.finalPrice = parseFloat(finalPrice.toFixed(2)); // Store finalPrice as a float with 2 decimals

          return order;
        })
      );

      return ordersWithSummary; // Return orders with the summary fields
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Error fetching orders");
    }
  }

  static async getUserOrders(userId) {
    try {
      const orders = await Order.findAll({
        where: { UserId: userId },
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

      // Loop through the orders and calculate the order summary
      const ordersWithSummary = await Promise.all(
        orders.map(async (order) => {
          let totalPrice = 0;
          let discountPercentage = 0;

          // Calculate total price from OrderItems
          for (const item of order.OrderItems) {
            totalPrice += item.unit_price * item.quantity;
          }

          // Get the discount percentage from the user's membership
          discountPercentage = order.User?.membership?.discount || 0;
          const discountAmount = (totalPrice * discountPercentage) / 100;
          const finalPrice = totalPrice - discountAmount;

          // Add calculated values to order.dataValues
          order.dataValues.totalPrice = totalPrice.toFixed(2); // Total price with 2 decimal places
          order.dataValues.discountPercentage = discountPercentage;
          order.dataValues.discountAmount = discountAmount.toFixed(2); // Discount amount with 2 decimal places
          order.dataValues.finalPrice = finalPrice.toFixed(2); // Final price with 2 decimal places

          return order;
        })
      );

      return ordersWithSummary; // Return orders with the summary fields
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw new Error("Error fetching user orders");
    }
  }

  static async updateOrder(orderId, status) {
    const [updated] = await Order.update(
      { status },
      { where: { id: orderId } }
    );
    return updated;
  }

  static async fetchOrderById(orderId) {
    const order = await Order.findByPk(orderId, { include: [OrderItem, User] });

    let totalPrice = 0;
    for (const item of order.OrderItems) {
      totalPrice += item.unit_price * item.quantity;
    }

    const discountPercentage = await CartService.recalculateMembership(
      order.UserId
    );
    const discountAmount = totalPrice * (discountPercentage / 100);
    const finalPrice = totalPrice - discountAmount;

    order.dataValues.totalPrice = totalPrice;
    order.dataValues.discountPercentage = discountPercentage;
    order.dataValues.discountAmount = discountAmount;
    order.dataValues.finalPrice = finalPrice;

    return order;
  }

  // Helper function to calculate the order summary
  static calculateOrderSummary(order) {
    let totalPrice = 0;

    // Calculate total price from the OrderItems
    for (const item of order.OrderItems) {
      totalPrice += item.unit_price * item.quantity;
    }

    // Get the discount percentage from the user's membership
    const discountPercentage = order.User?.membership?.discount || 0;
    const discountAmount = (totalPrice * discountPercentage) / 100;
    const finalPrice = totalPrice - discountAmount;

    // Return the updated order object with calculated fields
    return {
      ...order.get(),
      totalPrice: totalPrice.toFixed(2), // Return total price with 2 decimal places
      discountPercentage,
      discountAmount: discountAmount.toFixed(2), // Return discount amount with 2 decimal places
      finalPrice: finalPrice.toFixed(2), // Return final price with 2 decimal places
      createdAt: order.createdAt.toLocaleDateString(),
      updatedAt: order.updatedAt.toLocaleDateString(),
    };
  }

  static async deleteOrder(orderId) {
    try {
      // Fetch the order to delete by its ID
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem }], // Include associated OrderItems for deletion
      });

      // If the order doesn't exist, throw an error
      if (!order) {
        throw new Error("Order not found.");
      }

      // Delete all associated OrderItems for the order
      await OrderItem.destroy({
        where: { OrderId: orderId },
      });

      // Now delete the order itself
      await order.destroy();

      return { message: "Order and associated items deleted successfully." };
    } catch (error) {
      console.error("Error deleting order:", error);
      throw new Error("Error deleting order");
    }
  }
}

module.exports = OrderService;
