import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addSelectedProduct,
  removeSelectedProduct,
  updateProductQuantity,
} from "../../../redux/slices/productInventrySlice";
import { debounce } from "lodash";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Chip,
  List,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ProductSelection = () => {
  const dispatch = useDispatch();
  const { products, selectedProducts, loading } = useSelector(
    (state) => state.products
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search function to fetch products
  const debouncedSearch = debounce((search) => {
    dispatch(fetchProducts({ search, pageSize: 10 }));
  }, 300);

  useEffect(() => {
    // If there's a search term, fetch products
    if (searchTerm) {
      debouncedSearch(searchTerm);
    }

    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectProduct = (product) => {
    // Check if product already exists in selected products
    const existingProduct = selectedProducts.find(
      (selectedProduct) => selectedProduct.id === product.id
    );

    if (existingProduct) {
      // If product exists, update its quantity
      dispatch(
        updateProductQuantity({
          id: product.id,
          quantity: existingProduct.quantity + 1,
        })
      );
    } else {
      // Otherwise add it as a new selected product
      dispatch(
        addSelectedProduct({
          ...product,
          quantity: 1,
        })
      );
    }

    // Clear search after selection
    setSearchTerm("");
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateProductQuantity({ id, quantity }));
  };

  const calculateMRPTotal = () => {
    return selectedProducts
      .reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <Grid item xs={12} sx={{ mt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          ml: "13%",
          width: "80%",
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "700", color: "#72787F", mb: 2 }}
        >
          Product Selection
        </Typography>

        {/* Search Field */}
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Search Results Dropdown */}
          {searchTerm && (
            <Paper
              sx={{
                position: "absolute",
                width: "100%",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <List>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ListItem
                        button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                      >
                        <ListItemText
                          primary={product.name}
                          secondary={`Price: $${product.price}`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No products found" />
                    </ListItem>
                  )}
                </List>
              )}
            </Paper>
          )}
        </Box>

        {/* Selected Products Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {selectedProducts.map((product) => (
            <Chip
              key={product.id}
              label={product.name}
              onDelete={() => dispatch(removeSelectedProduct(product.id))}
              sx={{
                backgroundColor: "#a67662",
                color: "white",
                fontWeight: "500",
                "& .MuiChip-deleteIcon": {
                  color: "white",
                },
              }}
            />
          ))}
        </Box>

        {/* Quantity and Price Section */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "700", color: "#72787F", mb: 2 }}
        >
          Product Quantity
        </Typography>

        {/* Selected Products */}
        <Box sx={{ mt: 2 }}>
          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <Box
                key={product.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="body1">{product.name}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        Math.max(1, product.quantity - 1)
                      )
                    }
                    sx={{ border: "1px solid #ddd" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography>{product.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantityChange(product.id, product.quantity + 1)
                    }
                    sx={{ border: "1px solid #ddd" }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{ ml: 2, minWidth: "80px", textAlign: "right" }}
                  >
                    ${(product.price * product.quantity).toFixed(2)}
                  </Typography>
                  <IconButton
                    onClick={() => dispatch(removeSelectedProduct(product.id))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "#72787F", textAlign: "center", py: 2 }}
            >
              No products selected. Search and select products above.
            </Typography>
          )}
        </Box>

        {/* MRP Total */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            border: "1px solid #eee",
            borderRadius: "8px",
            my: 2,
          }}
        >
          <Typography sx={{ fontWeight: "500", color: "#333" }}>
            MRP Total
          </Typography>
          <Typography sx={{ fontWeight: "600", color: "#333" }}>
            ${calculateMRPTotal()}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProductSelection;
