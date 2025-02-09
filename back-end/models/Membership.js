module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define("Membership", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure unique membership tiers
    },
    min: {
      type: DataTypes.INTEGER,
      allowNull: true, // Minimum threshold for membership
    },
    max: {
      type: DataTypes.INTEGER,
      allowNull: true, // Maximum threshold for membership
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false, // Discount percentage
    },
  });

  // Relationships
  Membership.associate = (models) => {
    Membership.hasMany(models.User, {
      foreignKey: "MembershipId",
      as: "users", // Alias defined here
    });
  };

  return Membership;
};
