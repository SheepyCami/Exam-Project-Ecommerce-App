const { Category, Product } = require("../models");

class CategoryService {
  // Get all categories
  static async getAllCategories() {
    return await Category.findAll();
  }

  // Get category by ID
  static async getCategoryById(id) {
    return await Category.findByPk(id);
  }

  // Create a new category
  static async createCategory(data) {
    return await Category.create(data);
  }

  // Update a category
  static async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error(`Category with ID ${id} not found.`);
    }

    await category.update(data);
    return category;
  }

  // Delete a category
  static async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error(`Category with ID ${id} not found.`);
    }

    await category.destroy();
    return true;
  }

  // Check if a category can be deleted (i.e., if it's assigned to any products)
  static async canDelete(categoryId) {
    try {
      // Check if the category is assigned to any products
      const productCount = await Product.count({
        where: { categoryId: categoryId },
      });

      // If there are any products with this category, we cannot delete it
      if (productCount > 0) {
        return false; // The category is in use, cannot delete
      }

      // Otherwise, the category can be deleted
      return true;
    } catch (error) {
      console.error("Error checking if category can be deleted:", error);
      throw new Error("Unable to check deletion status.");
    }
  }
}

module.exports = CategoryService;
