// Main OrderForm component
import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomerDetailsForm from "./CustomerDetailsForm";
import PrescriptionUpload from "./PrescriptionUpload";
import ProductSelection from "./ProductSelection";
import DosageInstructions from "./DosageInstructions";
import OrderSummary from "./OrderSummery";
import FormButtons from "./FormButtons";

import { createSalesOrder } from "../../../services/OrderManagements/orderService";
import { useNavigate } from "react-router-dom";

// Create a custom theme with Inter font
const theme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

const OrderForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    age: "",
    sex: "",
    address: "",
    referBy: "",
    additionalNote: "",
  });
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
  const [dosageInstructions, setDosageInstructions] = useState([
    
  ]);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = (file) => {
    if (file) {
      setUploadedFile({
        name: file.name,
        size: Math.round(file.size / 1024), // Convert to KB
      });

      // Simulate progress for demo purposes
      setUploadProgress(0);
      const timer = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const handleProductRemove = (productToRemove) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.name !== productToRemove)
    );
  };

  const handleQuantityChange = (productName, newQuantity) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product.name === productName
          ? { ...product, quantity: Math.max(1, newQuantity) }
          : product
      )
    );
  };

  const calculateMRPTotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
setIsSuccessPopupOpen(true);
    const orderData = {
      customerDetails: formData,
      uploadedFile,
      selectedProducts,
      dosageInstructions,
      totalAmount: selectedProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ),
    };

    try {
      const response = await createSalesOrder(orderData);
      console.log("Order created successfully:", response);
      alert("Order submitted successfully!");
    } catch (err) {
      console.error("Error submitting order:", err);
      setError(err.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };
    const handleCancel = () => {
      // Navigate back or reset form
      navigate(-1); // Goes back to previous page
    };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: { xs: "stretch", md: "flex-start" },
          gap: "5%",
        }}
      >
        {/* Left side - Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <CustomerDetailsForm
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData} // Pass this to allow form to update all fields at once
            />

            <PrescriptionUpload
              uploadedFile={uploadedFile}
              uploadProgress={uploadProgress}
              handleFileUpload={handleFileUpload}
              handleRemoveFile={handleRemoveFile}
            />

            <ProductSelection
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              handleProductRemove={handleProductRemove}
              handleQuantityChange={handleQuantityChange}
              calculateMRPTotal={calculateMRPTotal}
            />

            <DosageInstructions
              dosageInstructions={selectedProducts}
              setDosageInstructions={setDosageInstructions}
            />
            {/* <pre>{JSON.stringify(dosageInstructions, null, 2)}</pre> */}

            {/* Order Summary will appear here on small screens */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },

                mt: 2,
                mb: 3,
              }}
            >
              <OrderSummary
                formData={formData}
                handleChange={handleChange}
                calculateMRPTotal={calculateMRPTotal}
              />
            </Box>

            <Box sx={{ width: "75vw" }}>
              <FormButtons
                handleCancel={handleCancel}
                handleSubmit={handleSubmit}
              />
            </Box>
          </form>
        </Box>

        {/* Right side - Order Summary (visible only on medium and larger screens) */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: { xs: "none", md: "block" },
          }}
        >
          <OrderSummary
            formData={formData}
            handleChange={handleChange}
            calculateMRPTotal={calculateMRPTotal}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OrderForm;
