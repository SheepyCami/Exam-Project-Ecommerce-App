module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure unique role names
    },
  });

  // Define relationships
  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "RoleId", as: "users" });
  };

  return Role;
};
