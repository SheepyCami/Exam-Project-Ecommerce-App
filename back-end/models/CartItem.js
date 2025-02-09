module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define("CartItem", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    soft_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  // Define associations
  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: "CartId" });
    CartItem.belongsTo(models.Product, { foreignKey: "ProductId" });
  };

  return CartItem;
};
