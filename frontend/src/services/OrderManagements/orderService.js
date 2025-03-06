import axios from "axios";

const API_BASE_URL =  "http://localhost:5000/api/order"; // Update based on your environment

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to create a new sales order
export const createSalesOrder = async (orderData) => {
  try {
    const response = await apiClient.post("/create-order", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create order" };
  }
};

// Function to fetch a single order's details
export const fetchSingleOrderDetails = async (id, FkID) => {
  try {
    const response = await apiClient.get(`/single-order-details`, {
      params: { id, FkID },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch order details" };
  }
};

// Function to fetch order fulfillment list
export const fetchOrderFulfillmentList = async (filters) => {
  try {
    const response = await apiClient.get("/order-fulfillment", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching order fulfillment list:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch order fulfillment list" };
  }
};
