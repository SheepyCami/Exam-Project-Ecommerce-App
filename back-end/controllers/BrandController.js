// controllers/BrandController.js
const { Brand } = require("../models");
const BrandService = require("../services/BrandService");

class BrandController {
  // Get all brands
  static async getAllBrands(req, res) {
    //#swagger.tags = ["Brand"]
    //#swagger.description = "Retrieve all available brands."
    try {
      const brands = await Brand.findAll();
      res.status(200).json({
        status: "success",
        data: brands,
      });
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({
        status: "fail",
        message: "Server error.",
      });
    }
  }

  // Get a brand by ID
  static async getBrandById(req, res) {
    //#swagger.tags=["Brand"]
    //#swagger.description="Retrieve a single brand by its ID."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id']= {
          in: 'path',
          description: 'ID of the brand to fetch.',
          required: true,
          type: 'integer',
          example: 1
      }
    */
    try {
      const brand = await Brand.findByPk(req.params.id);
      if (!brand) {
        return res.status(404).json({
          status: "fail",
          message: `Brand with ID ${req.params.id} not found.`,
        });
      }
      res.status(200).json({
        status: "success",
        data: brand,
      });
    } catch (error) {
      console.error("Error fetching brand:", error);
      res.status(500).json({
        status: "fail",
        message: "Server error.",
      });
    }
  }

  // Create a new brand
  static async createBrand(req, res) {
    //#swagger.tags=["Brand"]
    //#swagger.description="Create a new brand by Admin."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['body']= {
          in: 'body',
          description: 'Data to create a new brand.',
          required: true,
          schema: {
              $ref: "#/definitions/createBrand"
          }
      }
    */
    try {
      const { name } = req.body;
      const newBrand = await Brand.create({ name });
      res.status(201).json({
        status: "success",
        data: newBrand,
      });
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({
        status: "fail",
        message: "Server error.",
      });
    }
  }

  // Update a brand by ID
  static async updateBrand(req, res) {
    //#swagger.tags=["Brand"]
    //#swagger.description="Update an existing brand by Admin."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['id']= {
          in: 'path',
          description: 'ID of the brand to update.',
          required: true,
          type: 'integer',
          example: 1
      }
    */
    /* #swagger.parameters['body']= {
          in: 'body',
          description: 'Updated brand data.',
          required: true,
          schema: {
              $ref: "#/definitions/updateBrand"
          }
      }
    */
    try {
      const { name } = req.body;
      const brand = await Brand.findByPk(req.params.id);
      if (!brand) {
        return res.status(404).json({
          status: "fail",
          message: `Brand with ID ${req.params.id} not found.`,
        });
      }
      brand.name = name;
      await brand.save();
      res.status(200).json({
        status: "success",
        data: {
          brand: {
            id: brand.id,
            name: brand.name,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({
        status: "fail",
        message: "Server error.",
      });
    }
  }

  // Delete a brand by ID
  static async deleteBrand(req, res) {
    //#swagger.tags=["Brand"]
    //#swagger.description="Delete a brand by Admin "
    //#swagger.produces=['application/json']
    /* #swagger.parameters['body']= {
            in: 'body',
            description: 'Delete a brand by Admin  ',
            required: true,
            schema: {
                $ref: "#/definitions/deleteBrand"
            }
        }
        */
    try {
      const brand = await Brand.findByPk(req.params.id);
      if (!brand) {
        return res.status(404).json({
          status: "fail",
          message: `Brand with ID ${req.params.id} not found.`,
        });
      }

      // Prevent deletion if brand is assigned to any products
      const canDelete = await BrandService.canDelete(brand.id);
      if (!canDelete) {
        return res.status(400).json({
          status: "fail",
          message: "Brand cannot be deleted as it is assigned to products.",
        });
      }

      await brand.destroy();
      res.status(200).json({
        status: "success",
        message: "Brand deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({
        status: "fail",
        message: "Server error.",
      });
    }
  }
}

module.exports = BrandController;
