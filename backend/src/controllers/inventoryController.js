const { appLogger } = require("../loggers/appLogger");
const inventoryService = require("../services/inventoryService");
const { handleControllerError } = require("../utils/errorHandler");
const { sendResponse } = require("../utils/sendResponse");

// Fetches a paginated list of products with optional search
const getProductList = async (req, res) => {
  const { pageNo = 1, pageSize = -1, search = "" } = req.query;
  try {
    const products = await inventoryService.fetchProductList(
      pageNo,
      pageSize,
      search
    );
    sendResponse(res, 200, "Product list fetched successfully", products);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Fetches product details by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  const { barcode = 0 } = req.query;
  try {
    const product = await inventoryService.fetchProductById(id, barcode);
    sendResponse(res, 200, "Product fetched successfully", product);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

module.exports = {
  getProductList,
  getProductById,
};
