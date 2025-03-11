import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const {
    products = [],
    selectedProducts = [],
    loading,
    hasMore = false, // Add this to your Redux state
  } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const observer = useRef();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((search) => {
      setPage(1); // Reset page when new search is performed
      dispatch(fetchProducts({ search, pageSize: 10, page: 1 }));
    }, 300),
    [dispatch]
  );

  // Initialize products on component mount
  useEffect(() => {
    dispatch(fetchProducts({ search: "", pageSize: 10, page: 1 }));
  }, [dispatch]);

  // Handle search term changes
  useEffect(() => {
    if (searchTerm !== null) {
      debouncedSearch(searchTerm);
    }
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Infinite scroll using intersection observer
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          dispatch(
            fetchProducts({
              search: searchTerm,
              pageSize: 10,
              page: nextPage,
              append: true, // Make sure your reducer appends instead of replaces
            })
          );
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, searchTerm, dispatch]
  );

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsInputFocused(true);
    if (!products.length) {
      dispatch(fetchProducts({ search: "", pageSize: 10, page: 1 }));
    }
  };

  // Handle clicks outside search input
  const handleClickOutside = useCallback((event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setIsInputFocused(false);
    }
  }, []);

  // Setup and cleanup event listeners
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

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
          id: product.PKID, // Make sure ID is properly set
          name: product.NameToDisplay, // Use correct field from API
          price: product.MRP, // Use correct field from API
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
        <Box sx={{ position: "relative" }} ref={searchInputRef}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
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

          {/* Search Results Dropdown with Infinite Scrolling */}
          {(isInputFocused || searchTerm) && (
            <Paper
              sx={{
                position: "absolute",
                width: "100%",
                zIndex: 10,
                maxHeight: "300px",
                overflowY: "auto",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <List>
                {Array.isArray(products) &&
                  products.map((product, index) => {
                    // Apply ref to the last item for infinite scrolling
                    const isLastItem = index === products.length - 1;

                    return (
                      <ListItem
                        ref={isLastItem ? lastProductRef : null}
                        key={product.PKID || index}
                        onClick={() => {
                          handleSelectProduct(product);
                          setIsInputFocused(false);
                        }}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <ListItemText
                          primary={product.NameToDisplay}
                          secondary={`Price: ₹${product.MRP}`}
                        />
                      </ListItem>
                    );
                  })}

                {loading && (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                {!loading &&
                  Array.isArray(products) &&
                  products.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No products found"
                        secondary={
                          searchTerm
                            ? "Try a different search term"
                            : "Start typing to search products"
                        }
                      />
                    </ListItem>
                  )}
              </List>
            </Paper>
          )}
        </Box>

        {/* Selected Products Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {Array.isArray(selectedProducts) &&
            selectedProducts.map((product) => (
              <Chip
                key={product.PKID}
                label={product.NameToDisplay}
                onDelete={() => dispatch(removeSelectedProduct(product.PKID))}
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
                key={product.PKID }
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
                <Typography variant="body1">{product.NameToDisplay}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantityChange(
                        product.PKID,
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
                      handleQuantityChange(product.PKID, product.quantity + 1)
                    }
                    sx={{ border: "1px solid #ddd" }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{ ml: 2, minWidth: "80px", textAlign: "right" }}
                  >
                    ₹{(product.MRP * product.quantity).toFixed(2)}
                  </Typography>
                  <IconButton
                    onClick={() => dispatch(removeSelectedProduct(product.PKID))}
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
            ₹{calculateMRPTotal()}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProductSelection;
