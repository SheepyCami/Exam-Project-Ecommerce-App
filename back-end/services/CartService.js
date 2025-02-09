const {
  Cart,
  CartItem,
  Product,
  Order,
  OrderItem,
  User,
  Membership,
} = require("../models");
const { v4: uuidv4 } = require("uuid");

class CartService {
  // Find or create an active cart for a user
  static async getOrCreateCart(userId) {
    let cart = await Cart.findOne({
      where: { UserId: userId, status: "active" },
    });
    if (!cart) {
      cart = await Cart.create({ UserId: userId, status: "active" });
    }
    return cart;
  }

  // Add an item to the cart
  static async addProductToCart(userId, productId, quantity) {
    const cart = await this.getOrCreateCart(userId);
    const product = await Product.findByPk(productId);

    if (!product || product.status === "out-of-stock" || product.isdeleted) {
      throw new Error("Product not available.");
    }

    if (quantity > product.quantity) {
      throw new Error(
        `Not enough stock available. Only ${product.quantity} items are in stock.`
      );
    }

    const cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.quantity) {
        throw new Error(
          `Not enough stock available. Only ${product.quantity} items are in stock.`
        );
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      await CartItem.create({
        CartId: cart.id,
        ProductId: productId,
        quantity,
        unit_price: product.price,
      });
    }

    // After adding an item, recalculate the membership status based on the updated cart
    await this.recalculateMembership(userId);

    return await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
      include: Product,
    });
  }

  // Retrieve the active cart for a user
  static async getCart(userId) {
    const cart = await Cart.findOne({
      where: { UserId: userId, status: "active" },
      include: [
        {
          model: CartItem,
          include: [Product], // Ensure CartItems include Product details
        },
      ],
    });

    return cart;
  }

  // Update the quantity of an item in the cart
  static async updateCartItem(userId, productId, quantity) {
    // Find the active cart for the user
    const cart = await this.getCart(userId);
    if (!cart) {
      throw new Error("No active cart found for the user.");
    }

    // Find the cart item for the specified productId
    const cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (!cartItem) {
      throw new Error("Product not found in the cart.");
    }

    // Get the product details to check stock
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    // Check if the new quantity is valid (not exceeding stock)
    if (quantity > product.quantity) {
      throw new Error(
        `Not enough stock available. Only ${product.quantity} items are in stock.`
      );
    }

    // Update the cart item's quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    // Recalculate membership and discount
    await this.recalculateMembership(userId);

    // Return the updated cart item with product details
    return await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
      include: Product, // Include the product details in the response
    });
  }

  // Helper function to retrieve the active cart
  static async getCart(userId) {
    // Find the user's active cart
    const cart = await Cart.findOne({
      where: { UserId: userId, status: "active" },
      include: [
        {
          model: CartItem,
          include: Product, // Ensure CartItems include Product details
        },
      ],
    });
    return cart;
  }

  // Recalculate the membership status based on total quantity in cart
  // Recalculate the membership status based on total quantity in cart
  static async recalculateMembership(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const cart = await this.getCart(userId);
    const totalItems = cart.CartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    let membershipLevel = "Bronze";
    let discount = 0;

    // Prevent downgrading if the user is already Gold
    if (user.MembershipId === 3) {
      // Assuming 3 is Gold
      return discount; // Return the current discount without making any changes
    }

    if (totalItems >= 30) {
      membershipLevel = "Gold";
      discount = 30; // Gold membership discount
    } else if (totalItems >= 15) {
      membershipLevel = "Silver";
      discount = 15; // Silver membership discount
    }

    const newMembership = await Membership.findOne({
      where: { name: membershipLevel },
    });

    if (newMembership && user.MembershipId !== newMembership.id) {
      user.MembershipId = newMembership.id;
      await user.save();
    }

    return discount;
  }

  // Other methods remain the same (getCart, etc.)

  // Remove an item from the cart
  static async deleteCartItem(userId, productId) {
    // Retrieve the user's active cart
    const cart = await this.getCart(userId);

    if (!cart) {
      throw new Error("No active cart found.");
    }

    // Find the cart item to be removed
    const cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (!cartItem) {
      throw new Error("Cart item not found.");
    }

    // Remove the CartItem completely
    await cartItem.destroy(); // This will delete the CartItem from the database

    // Optionally, you can also handle soft-deleting or other cleanup tasks if needed
    // For instance, if the product should be marked as deleted, you can do that here

    return { message: "Item removed from cart successfully." };
  }

  // Helper function to retrieve the active cart
  static async getCart(userId) {
    // Find the user's active cart
    const cart = await Cart.findOne({
      where: { UserId: userId, status: "active" },
      include: [
        {
          model: CartItem,
          include: Product, // Include product details for each cart item
        },
      ],
    });
    return cart;
  }

  // Checkout the cart and create an order
  static async checkoutCart(userId) {
    const cart = await Cart.findOne({
      where: { UserId: userId, status: "active" },
      include: {
        model: CartItem,
        include: Product,
      },
    });

    if (!cart) throw new Error("No active cart found for the user.");
    if (cart.CartItems.length === 0) throw new Error("Cart is empty.");

    const orderNumber = uuidv4().slice(0, 8); // Generate unique order number
    const user = await User.findByPk(userId);

    // Recalculate the membership and discount based on the cart
    const discountPercentage = await this.recalculateMembership(userId); // Prevent downgrade here

    let totalPrice = 0;

    // Process each cart item
    for (const item of cart.CartItems) {
      totalPrice += item.unit_price * item.quantity;

      const product = await Product.findByPk(item.ProductId);
      product.quantity -= item.quantity;
      await product.save();
    }

    // Apply the discount based on membership
    const discountAmount = (totalPrice * discountPercentage) / 100;
    const finalPrice = totalPrice - discountAmount;

    // Create the order first (use the orderNumber here for display purposes)
    const order = await Order.create({
      orderNumber, // 'orderNumber' instead of 'OrderId'
      UserId: userId,
      email: user.email,
      amount: finalPrice,
      status: "In Progress",
    });

    // Now, create the order items and associate them with the order's id
    for (const item of cart.CartItems) {
      await OrderItem.create({
        OrderId: order.id, // Use the 'id' of the created order
        ProductId: item.ProductId,
        quantity: item.quantity,
        unit_price: item.unit_price,
      });
    }

    // Mark the cart as completed
    cart.status = "completed";
    await cart.save();

    return {
      order,
      totalPrice,
      discountPercentage,
      discountAmount,
      finalPrice,
    };
  }
}

module.exports = CartService;
