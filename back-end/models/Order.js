module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    orderNumber: {
      // Renaming from 'OrderId' to 'orderNumber, for less confusion'
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("In Progress", "Ordered", "Completed"),
      defaultValue: "In Progress",
    },
  });

  // Define associations for Order
  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "UserId" });
    Order.hasMany(models.OrderItem, { foreignKey: "OrderId" });
  };

  return Order;
};
