const axios = require("axios");
const {
  UnauthorizedError,
  InternalServerError,
} = require("../utils/customErrors");

const SWIL_API_KEY = process.env.SWIL_API_KEY;

// Set up headers for SwilERP API authentication
const headers = {
  Authorization: `Bearer ${SWIL_API_KEY}`,
};

/**
 * Fetches a paginated list of products from SwilERP.
 * @param {number} pageNo - The page number to fetch.
 * @param {number} pageSize - The number of records per page (-1 for all).
 * @param {string} search - Optional search query for filtering products.
 * @returns {Promise<Object>} - The product list response from SwilERP.
 */
const fetchProductList = async (pageNo = 1, pageSize = -1, search = "") => {
  try {
    const response = await axios.post(
      `${process.env.SWILERP_BASE_URL}/api/master/Product/list`,
      {},
      {
        headers,
        params: { pageNo, pageSize, search },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Fetches product details by ID from SwilERP.
 * @param {string} id - The unique product ID.
 * @returns {Promise<Object>} - The product details response from SwilERP.
 */
const fetchProductById = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.SWILERP_BASE_URL}/api/master/Product/GetMobileByID`,
      {},
      {
        headers,
        params: { id },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Handles Axios errors and throws custom exceptions.
 * @param {Error} error - The error object from Axios.
 * @throws {UnauthorizedError|InternalServerError}
 */
const handleAxiosError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new UnauthorizedError("Invalid token");
  }
  throw new InternalServerError("Failed to fetch data from SwilERP");
};

module.exports = {
  fetchProductList,
  fetchProductById,
};
