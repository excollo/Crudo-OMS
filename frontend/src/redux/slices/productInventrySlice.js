import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const initialState = {
  products: [],
  selectedProducts: [],
  loading: false,
  error: null,
  hasMore: false, // Added hasMore flag for infinite scrolling
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ search, pageSize, page, append = false }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/inventory/products`, {
        params: { search, pageSize, page }, // Added page parameter
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Return both the data and metadata needed for pagination
      return {
        data: response.data.data || [],
        append, // Flag to indicate if we should append or replace
        hasMore: response.data.data.length === pageSize, // If we got full page, there might be more
        page,
      };
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(
          "Network error - Please check if the server is running"
        );
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addSelectedProduct: (state, action) => {
      const existingProduct = state.selectedProducts.find(
        (product) => product.id === action.payload.id
      );
      if (!existingProduct) {
        state.selectedProducts.push(action.payload);
      }
    },
    removeSelectedProduct: (state, action) => {
      state.selectedProducts = state.selectedProducts.filter(
        (product) => product.id !== action.payload
      );
    },
    updateProductQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.selectedProducts.find((p) => p.id === id);
      if (product) {
        product.quantity = quantity;
      }
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // Update products based on append flag
        if (action.payload.append && action.payload.page > 1) {
          // Append new products to existing ones for infinite scrolling
          state.products = [...state.products, ...action.payload.data];
        } else {
          // Replace products for new searches
          state.products = action.payload.data;
        }

        // Update pagination info
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
        state.hasMore = false;
      });
  },
});

export const {
  addSelectedProduct,
  removeSelectedProduct,
  updateProductQuantity,
  clearSelectedProducts,
} = productSlice.actions;

export default productSlice.reducer;
