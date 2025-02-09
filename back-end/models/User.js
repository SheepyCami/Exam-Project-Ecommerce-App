const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Enforce unique usernames
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Enforce unique emails
      validate: {
        isEmail: true, // Ensure valid email format
      },
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RoleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Roles", // References the Role model
        key: "id",
      },
    },
    MembershipId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Memberships", // References the Membership model
        key: "id",
      },
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  // Hooks for hashing the password before creating or updating
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  // Instance method to compare passwords
  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define relationships
  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "RoleId", as: "role" });
    User.belongsTo(models.Membership, {
      foreignKey: "MembershipId",
      as: "membership", // Alias defined here
    });
    User.hasMany(models.Cart, { foreignKey: "UserId" }); // Ensure this exists
    User.hasMany(models.Order);
  };

  // Instance method to generate password reset token
  User.prototype.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set `resetPasswordToken` field
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set `resetPasswordExpire` field
    this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);

    return resetToken;
  };

  return User;
};
