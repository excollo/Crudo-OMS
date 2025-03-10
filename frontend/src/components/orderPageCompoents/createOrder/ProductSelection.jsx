import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Chip,
  InputAdornment,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

// Sample medicine list with prices
const medicineList = [
  { name: "Dolo 500mg", price: 20 },
  { name: "Paracetamol", price: 15 },
  { name: "Ibuprofen", price: 25 },
  { name: "Aspirin", price: 18 },
  { name: "Cough Syrup", price: 30 },
];

const ProductSelection = ({
 selectedProducts = [], 
 setSelectedProducts = () => {} ,
  handleQuantityChange,
  calculateMRPTotal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue) {
      setFilteredMedicines(
        medicineList.filter((medicine) =>
          medicine.name.toLowerCase().includes(searchValue)
        )
      );
    } else {
      setFilteredMedicines([]);
    }
  };

  // Handle selecting a medicine from the suggestions
  const handleSelectMedicine = (medicine) => {
    const existingProduct = selectedProducts.find(
      (product) => product.name === medicine.name
    );

    if (existingProduct) {
      handleQuantityChange(medicine.name, existingProduct.quantity + 1);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { name: medicine.name, quantity: 1, price: medicine.price },
      ]);
    }

    setSearchTerm("");
    setFilteredMedicines([]);
  };

  return (
    <Grid item xs={12} sx={{ mt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          ml: "13%",
          p: 3,
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
            placeholder="Search for medicines"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Medicine Suggestions List */}
          {filteredMedicines.length > 0 && (
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
              <List>
                {filteredMedicines.map((medicine) => (
                  <ListItem
                    button
                    key={medicine.name}
                    onClick={() => handleSelectMedicine(medicine)}
                  >
                    <ListItemText primary={medicine.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Selected Medicines */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {selectedProducts.map((product) => (
            <Chip
              key={product.name}
              label={product.name}
              onDelete={() =>
                setSelectedProducts(
                  selectedProducts.filter((p) => p.name !== product.name)
                )
              }
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

        {selectedProducts.map((product) => (
          <Box
            key={product.name}
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
                    product.name,
                    Math.max(product.quantity - 1, 1)
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
                  handleQuantityChange(product.name, product.quantity + 1)
                }
                sx={{ border: "1px solid #ddd" }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ ml: 2, minWidth: "80px", textAlign: "right" }}>
                ${product.price}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* MRP Total section */}
        <MRPTotal calculateMRPTotal={calculateMRPTotal} />
      </Paper>
    </Grid>
  );
};

// MRP Total sub-component
const MRPTotal = ({ calculateMRPTotal }) => {
  return (
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
  );
};

export default ProductSelection;
