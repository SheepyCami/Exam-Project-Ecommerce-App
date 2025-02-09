const CategoryService = require("../services/CategoryService");
const { Category } = require("../models");

class CategoryController {
  // Get all categories
  static async getAllCategories(req, res) {
    //#swagger.tags=["Category"]
    //#swagger.description="Retrieve all available categories."
    //#swagger.produces=['application/json']
    try {
      const categories = await Category.findAll();
      res.status(200).json({ status: "success", data: categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ status: "fail", message: "Server error." });
    }
  }

  // Get a category by ID
  static async getCategoryById(req, res) {
    //#swagger.tags=["Category"]
    //#swagger.description="Retrieve a single category by its ID."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id']= {
          in: 'path',
          description: 'ID of the category to fetch.',
          required: true,
          type: 'integer',
          example: 1
      }
    */
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          status: "fail",
          message: `Category with ID ${req.params.id} not found.`,
        });
      }
      res.status(200).json({ status: "success", data: category });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ status: "fail", message: "Server error." });
    }
  }

  // Create a new category
  static async createCategory(req, res) {
    //#swagger.tags=["Category"]
    //#swagger.description="Create a new category by Admin."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['body']= {
        in: 'body',
        description: 'Data to create a new category.',
        required: true,
        schema: {
            $ref: "#/definitions/createCategory"
        }
    }
  */
    try {
      const { name } = req.body;
      const newCategory = await Category.create({ name });
      res
        .status(201)
        .json({ status: "success", data: { category: newCategory } });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ status: "fail", message: "Server error." });
    }
  }

  // Update a category by ID
  static async updateCategory(req, res) {
    //#swagger.tags=["Category"]
    //#swagger.description="Update an existing category by its ID (Admin-only)."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id']= {
          in: 'path',
          description: 'ID of the category to update.',
          required: true,
          type: 'integer',
          example: 1
      }
    */
    /* #swagger.parameters['body']= {
          in: 'body',
          description: 'Updated category data.',
          required: true,
          schema: {
              $ref: "#/definitions/updateCategory"
          }
      }
    */
    try {
      const { name } = req.body;
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          status: "fail",
          message: `Category with ID ${req.params.id} not found.`,
        });
      }
      category.name = name;
      await category.save();
      res.status(200).json({
        status: "success",
        data: {
          category: {
            id: category.id,
            name: category.name,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ status: "fail", message: "Server error." });
    }
  }

  // Delete a category by ID
  static async deleteCategory(req, res) {
    //#swagger.tags=["Category"]
    //#swagger.description="Delete a category by Admin."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id']= {
        in: 'path',
        description: 'ID of the category to delete.',
        required: true,
        type: 'integer',
        example: 1
    }
  */
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          status: "fail",
          message: `Category with ID ${req.params.id} not found.`,
        });
      }

      // Prevent deletion if category is assigned to any products
      const canDelete = await CategoryService.canDelete(category.id);
      if (!canDelete) {
        return res.status(400).json({
          status: "fail",
          message: "Category cannot be deleted as it is assigned to products.",
        });
      }

      await category.destroy();
      res.status(200).json({
        status: "success",
        message: "Category deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ status: "fail", message: "Server error." });
    }
  }
}

module.exports = CategoryController;
