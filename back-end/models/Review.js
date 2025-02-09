module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    comment: {
      type: DataTypes.STRING,
      allowNull: false, // Equivalent to `required: true` in Mongoose
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false, // Equivalent to `required: true` in Mongoose
      validate: {
        min: 1,
        max: 5, // Assuming a 5-star rating system
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // References the User model
        key: "id",
      },
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products", // References the Product model
        key: "id",
      },
    },
  });

  // Define associations
  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: "UserId", as: "User" });
    Review.belongsTo(models.Product, { foreignKey: "ProductId" });
  };

  return Review;
};
