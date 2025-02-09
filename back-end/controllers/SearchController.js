const SearchService = require("../services/SearchService");

class SearchController {
  // Search products
  async searchProducts(req, res) {
    //#swagger.tags=["Search"]
    //#swagger.description="Search for products based on name, category, brand with pagination support."
    //#swagger.produces=['application/json']
    /* #swagger.parameters['name'] = {
      in: 'body',
      description: 'Name of the product to search for.',
      required: false,
      type: 'string',
      example: 'MacBook'
  }
  #swagger.parameters['category'] = {
      in: 'body',
      description: 'Category of the product to search for.',
      required: false,
      type: 'string',
      example: 'Electronics'
  }
  #swagger.parameters['brand'] = {
      in: 'body',
      description: 'Brand of the product to search for.',
      required: false,
      type: 'string',
      example: 'Apple'
  }
  #swagger.parameters['page'] = {
      in: 'body',
      description: 'The page number for pagination.',
      required: false,
      type: 'integer',
      example: 1
  }
  #swagger.parameters['limit'] = {
      in: 'body',
      description: 'Number of results per page.',
      required: false,
      type: 'integer',
      example: 10
  } */
    try {
      const { name, category, brand, page, limit } = req.body;

      // Set default page and limit if not provided
      const currentPage = page || 1;
      const pageLimit = limit || 10;

      const products = await SearchService.search(
        name,
        category,
        brand,
        currentPage,
        pageLimit
      );

      if (products.length === 0) {
        return res.status(404).json({
          status: "success",
          message: "No products found matching the search criteria.",
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          result: "Products found",
          products,
          count: products.length,
          page: currentPage,
          limit: pageLimit,
        },
      });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while searching for products.",
      });
    }
  }
}

module.exports = new SearchController();
