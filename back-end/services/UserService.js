const { User, Role, Membership } = require("../models"); // Ensure Role is imported

//removed aliases as getAll users function did not work.

class UserService {
  async getAllUsers() {
    return await User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "firstname",
        "lastname",
        "address",
        "telephone",
      ],
      include: [
        {
          model: Role,
          as: "role", // Matches the alias in User model
          attributes: ["name"],
        },
        {
          model: Membership,
          as: "membership", // Matches the alias in User model
          attributes: ["name"],
        },
      ],
    });
  }

  // Get user by username
  async findByUsername(username) {
    return await User.findOne({
      where: { username },
    });
  }

  async findByEmail(email) {
    return await User.findOne({
      where: { email },
    });
  }

  static async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  static async getAll() {
    return await User.findAll({
      include: [{ model: Membership, as: "Membership" }],
    });
  }

  // UserService.js
  async findById(id) {
    return await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role", // Use alias for the role relationship
          attributes: ["name"], // Only select the role name
        },
        {
          model: Membership,
          as: "membership", // Use alias for the membership relationship
          attributes: ["name"], // Only select the membership name
        },
      ],
    });
  }

  static async findByUsernameOrEmail(identifier) {
    return await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
  }

  // Create a new user
  async createUser(userData) {
    return await User.create(userData);
  }

  // Update user details
  async updateUser(UserId, updateData) {
    const user = await User.findByPk(UserId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.update(updateData);
    return user;
  }

  // Update user role
  async updateUserRole(UserId, newRoleId) {
    const user = await User.findByPk(UserId);
    if (!user) {
      throw new Error("User not found");
    }

    user.RoleId = newRoleId; // Update role ID
    await user.save();
    return user;
  }

  // Update user membership
  async updateUserMembership(UserId, newMembershipId) {
    const user = await User.findByPk(UserId);
    if (!user) {
      throw new Error("User not found");
    }

    user.MembershipId = newMembershipId; // Update membership ID
    await user.save();
    return user;
  }

  // Delete a user
  async deleteUser(UserId) {
    const user = await User.findByPk(UserId);
    if (!user) {
      return false;
    }

    await user.destroy(); // Alternatively, use soft delete logic
    return true;
  }
}

module.exports = new UserService();
