module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("Brand", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure no duplicate brands
    },
  });

  // Relationships
  Brand.associate = (models) => {
    Brand.hasMany(models.Product);
  };

  return Brand;
};
