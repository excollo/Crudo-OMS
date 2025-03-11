import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/ProductInventry/ProductService";

const initialState = {
  products: [],
  selectedProducts: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ pageNo = 1, pageSize = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(
        pageNo,
        pageSize,
        search
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch product");
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
        state.selectedProducts.push({ ...action.payload, quantity: 1 });
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
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
