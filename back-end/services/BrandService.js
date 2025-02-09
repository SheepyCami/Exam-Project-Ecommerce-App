// services/BrandService.js
const { Product, Brand } = require("../models");

class BrandService {
  static async getAll() {
    return await Brand.findAll();
  }

  static async findById(id) {
    return await Brand.findByPk(id);
  }

  static async create(data) {
    return await Brand.create(data);
  }

  static async update(id, updateData) {
    const brand = await Brand.findByPk(id);
    if (!brand) throw new Error("Brand not found");
    await brand.update(updateData);
    return brand;
  }

  static async delete(id) {
    const brand = await Brand.findByPk(id);
    if (!brand) throw new Error("Brand not found");
    await brand.destroy();
    return true;
  }

  // Check if a brand can be deleted (i.e., if it's assigned to any products)
  static async canDelete(brandId) {
    try {
      // Check if the brand is assigned to any products
      const productCount = await Product.count({
        where: { brandId: brandId },
      });

      // If there are any products with this brand, we cannot delete it
      if (productCount > 0) {
        return false; // The brand is in use, cannot delete
      }

      // Otherwise, the brand can be deleted
      return true;
    } catch (error) {
      console.error("Error checking if brand can be deleted:", error);
      throw new Error("Unable to check deletion status.");
    }
  }
}

module.exports = BrandService;
