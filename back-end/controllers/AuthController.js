const UserService = require("../services/UserService");
const sendToken = require("../utils/sendToken");

class AuthController {
  // Register new user
  async register(req, res) {
    //#swagger.tags=["Auth"]
    //#swagger.description="Register a new user"
    /*#swagger.parameters['body'] = {
        in: 'body',
        description: 'User registration data',
        required: true,
        schema: {
            $ref: "#/definitions/UserRegistration"
        }
    } */
    try {
      const {
        firstname,
        lastname,
        username,
        email,
        password,
        address,
        telephone,
      } = req.body;

      if (
        !firstname ||
        !lastname ||
        !username ||
        !email ||
        !password ||
        !address ||
        !telephone
      ) {
        return res
          .status(400)
          .json({ status: "fail", message: "All fields are required" });
      }

      if (await UserService.findByUsername(username)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Username already exists" });
      }
      if (await UserService.findByEmail(email)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Email already exists" });
      }

      const newUser = await UserService.createUser({
        firstname,
        lastname,
        username,
        email,
        password,
        address,
        telephone,
        RoleId: 2,
        MembershipId: 1,
      });

      sendToken(newUser, 201, res);
    } catch (error) {
      console.error("Error registering user:", error);
      res
        .status(500)
        .json({ status: "error", message: "Server error during registration" });
    }
  }

  // Login existing user
  async login(req, res) {
    //#swagger.tags=["Auth"]
    //#swagger.description="Login a user"
    /*#swagger.parameters['body'] = {
        in: 'body',
        description: 'User login credentials',
        required: true,
        schema: {
            $ref: "#/definitions/UserLogin"
        }
    } */
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ status: "fail", message: "Email and password are required" });
      }

      const user = await UserService.findByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid email or password" });
      }

      sendToken(user, 200, res);
    } catch (error) {
      console.error("Error logging in:", error);
      res
        .status(500)
        .json({ status: "error", message: "Server error during login" });
    }
  }

  // Logout user
  logout(req, res) {
    //#swagger.tags=["Auth"]
    //#swagger.description="Logout a user"
    try {
      res.cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
      });

      res.status(200).json({
        status: "success",
        message: "User logged out successfully",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({
        status: "error",
        message: "Server error during logout",
      });
    }
  }

  // Get all users - ADMIN
  async getAllUsers(req, res) {
    //#swagger.tags=["User"]
    //#swagger.description="Get all users (Admin only)"
    try {
      const users = await UserService.getAllUsers();

      const formattedUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        telephone: user.telephone,
        role: user.role ? user.role.name : "No role assigned",
        membership: user.membership
          ? user.membership.name
          : "No membership assigned",
      }));

      res.status(200).json({ status: "success", data: formattedUsers });
    } catch (error) {
      console.error("Error retrieving users:", error);
      res
        .status(500)
        .json({ status: "error", message: "Failed to fetch users" });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    //#swagger.tags=["User"]
    //#swagger.description="Get user by ID (Admin only)"
    /*#swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'integer'
    } */
    try {
      const { id } = req.params;

      const user = await UserService.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });
      }

      const formattedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        telephone: user.telephone,
        role: user.role ? user.role.name : "No role assigned",
        membership: user.membership
          ? user.membership.name
          : "No membership assigned",
      };

      return res.status(200).json({ status: "success", data: formattedUser });
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to fetch user details" });
    }
  }

  // Update user details - ADMIN
  async updateUser(req, res) {
    //#swagger.tags=["User"]
    //#swagger.description="Update user details (Admin only)"
    /*#swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'integer'
    } */
    /*#swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated user details',
        required: true,
        schema: {
            $ref: "#/definitions/UpdateUser"
        }
    } */
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await UserService.updateUser(id, updateData);

      if (!updatedUser) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          message: "User updated successfully",
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        status: "error",
        message: "Server error during user update",
      });
    }
  }

  // Update user role - ADMIN
  async updateUserRole(req, res) {
    //#swagger.tags=["User"]
    //#swagger.description="Update user role (Admin only)"
    /*#swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'integer'
    } */
    /*#swagger.parameters['body'] = {
        in: 'body',
        description: 'New user role',
        required: true,
        schema: {
            role: "string"
        }
    } */
    try {
      const { id } = req.params;
      const { role } = req.body;

      const updatedUser = await UserService.updateUserRole(id, role);

      res.status(200).json({
        status: "success",
        data: {
          message: "User role updated successfully",
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({
        status: "error",
        message: "Server error during user role update",
      });
    }
  }

  // Update user membership - ADMIN
  async updateUserMembership(req, res) {
    //#swagger.tags=["User"]
    //#swagger.description="Update user membership (Admin only)"
    /*#swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'integer'
    } */
    /*#swagger.parameters['body'] = {
        in: 'body',
        description: 'New membership ID',
        required: true,
        schema: {
            membershipId: "integer"
        }
    } */
    try {
      const { id } = req.params;
      const { membershipId } = req.body;

      const updatedUser = await UserService.updateUserMembership(
        id,
        membershipId
      );

      res.status(200).json({
        status: "success",
        statusCode: 200,
        data: {
          message: "User membership updated successfully",
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Error updating user membership:", error);
      res.status(500).json({
        status: "error",
        message: "Server error during membership update",
      });
    }
  }

  // Delete a user - ADMIN
  async deleteUser(req, res) {
    //#swagger.tags=["User"]
    //#swagger.description="Delete a user (Admin only)"
    /*#swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'integer'
    } */
    try {
      const { id } = req.params;

      const result = await UserService.deleteUser(id);
      if (!result) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        status: "error",
        message: "Server error during user deletion",
      });
    }
  }
}

module.exports = new AuthController();
