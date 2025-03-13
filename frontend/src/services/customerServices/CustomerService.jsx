import axios from "axios";

// Base configuration for axios
const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authentication token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
    }

    // Format error message
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * Customer Service - Provides methods to interact with customer-related endpoints
 */
const CustomerService = {
  /**
   * Get a list of customers with optional search and pagination
   * @param {number} pageNo - Page number (default: 1)
   * @param {number} pageSize - Number of records per page (default: -1, all records)
   * @param {string} search - Search term (default: '')
   * @returns {Promise} - Promise resolving to customer list data
   */
  getCustomers: async (pageNo = 1, pageSize = -1, search = "") => {
    try {
      // Double check if this endpoint path is correct - it might be /customer (singular)
      // or another path entirely based on your 404 error
      return await API.get("/customer/customers", {
        params: { pageNo, pageSize, search },
      });
    } catch (error) {
      console.error("Customer API Error:", error);
      throw error;
    }
  },

  /**
   * Get customer details by ID
   * @param {string|number} id - Customer ID
   * @returns {Promise} - Promise resolving to customer details
   */
  getCustomerById: async (id) => {
    try {
      return await API.get(`/customer/customers/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new customer
   * @param {Object} customerData - Customer data to create
   * @returns {Promise} - Promise resolving to created customer
   */
  createCustomer: async (customerData) => {
    try {
      return await API.post("/create-customer", customerData);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing customer
   * @param {string|number} id - Customer ID to update
   * @param {Object} customerData - Updated customer data
   * @returns {Promise} - Promise resolving to updated customer
   */
  updateCustomer: async (id, customerData) => {
    try {
      return await API.put(`/update-customer/${id}`, customerData);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Formats customer data for frontend use
   * @param {Object} customer - Raw customer data from API
   * @returns {Object} - Formatted customer data
   */
  formatCustomerData: (customer) => {
    return {
      id: customer.PKID || customer.ID,
      fullName: customer.Party || "",
      email: customer.Email || "",
      phoneNumber: customer.Phone || customer.Mobile || "",
      address: customer.Address || "",
      pincode: customer.Pincode || "",
      station: customer.Station || "",
      drugLicense: customer.Druglicence || "",
      gstNumber: customer.Gstno || "",
      panNumber: customer.PanNo || "",
    };
  },

  /**
   * Prepares customer data for submission to backend
   * @param {Object} formData - Frontend form data
   * @returns {Object} - Properly formatted data for backend
   */
  prepareCustomerData: (formData) => {
    return {
      id: customer.PKID || customer.ID,
      fullName: customer.Party || "",
      email: customer.Email || "",
      phoneNumber: customer.Phone || customer.Mobile || "",
      address: customer.Address || "",
      pincode: customer.Pincode || "",
      station: customer.Station || "",
      drugLicense: customer.Druglicence || "",
      gstNumber: customer.Gstno || "",
      panNumber: customer.PanNo || "",
    };
  },
};

export default CustomerService;
