module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    status: {
      type: DataTypes.ENUM("active", "completed"),
      allowNull: false,
      defaultValue: "active",
    },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "UserId" });
    Cart.hasMany(models.CartItem, { foreignKey: "CartId" });
  };

  return Cart;
};
