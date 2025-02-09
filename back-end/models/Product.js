module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_added: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    imgurl: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("available", "out-of-stock"),
      allowNull: false,
      defaultValue: "available",
    },
    isdeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  // Define relationships
  Product.associate = (models) => {
    Product.belongsTo(models.Brand, { foreignKey: "BrandId" });
    Product.belongsTo(models.Category, { foreignKey: "CategoryId" });
    Product.hasMany(models.CartItem, { foreignKey: "ProductId" });
    Product.hasMany(models.OrderItem, { foreignKey: "ProductId" });
  };

  return Product;
};
