import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const productService = {
  getProducts: async (pageNo = 1, pageSize = 10, search = "") => {
    const response = await axios.get(`${API_URL}/inventory/products`, {
      params: { pageNo, pageSize, search },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/inventory/products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
};
