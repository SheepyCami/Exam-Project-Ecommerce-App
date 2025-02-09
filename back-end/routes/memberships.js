const express = require("express");
const router = express.Router();
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");
const Membership = require("../models").Membership;
const User = require("../models").User;

// Fetch all memberships
// Fetch all memberships
router.get("/", authenticate, adminOnly, async (req, res) => {
  //#swagger.tags=["Membership"]
  //#swagger.description="Retrieve all memberships. Admin access required."
  //#swagger.produces=['application/json']
  try {
    const memberships = await Membership.findAll();
    res.status(200).json({ status: "success", data: memberships });
  } catch (error) {
    console.error("Error fetching memberships:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Fetch all users with memberships
router.get("/users", authenticate, adminOnly, async (req, res) => {
  //#swagger.tags=["Membership"]
  //#swagger.description="Retrieve all users with memberships. Admin access required."
  //#swagger.produces=['application/json']
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "firstname", "lastname"],
      include: [
        {
          model: Membership,
          as: "membership",
          attributes: ["id", "name", "discount"],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users with memberships:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Update user membership
router.put("/users/:id", authenticate, adminOnly, async (req, res) => {
  //#swagger.tags=["Membership"]
  //#swagger.description="Update the membership of a specific user. Admin access required."
  //#swagger.produces=['application/json']
  /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the user to update.',
        required: true,
        type: 'integer',
        example: 1
  } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Membership update data.',
        required: true,
        schema: {
            type: 'object',
            properties: {
                membershipId: { type: 'integer', description: 'New membership ID', example: 2 }
            }
        }
  } */
  try {
    const { id } = req.params;
    const { membershipId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    user.MembershipId = membershipId;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Membership updated successfully",
    });
  } catch (error) {
    console.error("Error updating membership:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

module.exports = router;
