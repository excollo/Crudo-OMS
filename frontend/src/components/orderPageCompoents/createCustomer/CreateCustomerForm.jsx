import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

// API base URL - can be replaced with environment variable in production
const API_BASE_URL = "http://localhost:3000/api";

// Mock token for testing - in a real app, this would come from your authentication system
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MTYxNjI4MDAsImV4cCI6MTYxNjE2NjQwMH0.2Mh0-VBCZ9YcQJCZAHcIjOGNYzYLxP5hHY0mnixFEvI";

// Reusable Input Component
const CustomTextField = ({ label, required, select, options, value, onChange, name, error, helperText }) => (
  <FormControl fullWidth error={!!error}>
    {select ? (
      <>
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          required={required}
          name={name}
          value={value || ""}
          onChange={onChange}
          label={label}
          error={!!error}
        >
          <MenuItem value="">Select {label}</MenuItem>
          {options && options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <Typography color="error" variant="caption">{helperText}</Typography>}
      </>
    ) : (
      <TextField
        label={label}
        required={required}
        fullWidth
        name={name}
        value={value || ""}
        onChange={onChange}
        error={!!error}
        helperText={error ? helperText : ""}
      />
    )}
  </FormControl>
);

// Add PropTypes validation
CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  select: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

// Default props
CustomTextField.defaultProps = {
  required: false,
  select: false,
  options: [],
  error: false,
  helperText: "",
};

const CreateCustomerForm = () => {
  const [formData, setFormData] = useState({
    Customer: "",
    Email: "",
    Mobile: "",
    Address: "",
    Pincode: "",
    Alias: "",
    Station: "",
    Druglicence: "",
    Gstno: "",
    PanNo: "",
    // Additional fields not required by backend validation
    age: "",
    sex: "",
    address2: "",
    referBy: "",
    city: "",
    state: "",
    medicalConditionNote: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [states, setStates] = useState([]);
  const [debugInfo, setDebugInfo] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    // In a real app, you would get the token from localStorage or your auth context
    // For testing, we'll use the mock token
    const storedToken = localStorage.getItem("token") || MOCK_TOKEN;
    setToken(storedToken);
    
    // Fetching dynamic data for dropdowns
    const fetchDropdownData = async () => {
      try {
        // All states of India
        setStates([
          { label: "Andhra Pradesh", value: "Andhra Pradesh" },
          { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
          { label: "Assam", value: "Assam" },
          { label: "Bihar", value: "Bihar" },
          { label: "Chhattisgarh", value: "Chhattisgarh" },
          { label: "Goa", value: "Goa" },
          { label: "Gujarat", value: "Gujarat" },
          { label: "Haryana", value: "Haryana" },
          { label: "Himachal Pradesh", value: "Himachal Pradesh" },
          { label: "Jharkhand", value: "Jharkhand" },
          { label: "Karnataka", value: "Karnataka" },
          { label: "Kerala", value: "Kerala" },
          { label: "Madhya Pradesh", value: "Madhya Pradesh" },
          { label: "Maharashtra", value: "Maharashtra" },
          { label: "Manipur", value: "Manipur" },
          { label: "Meghalaya", value: "Meghalaya" },
          { label: "Mizoram", value: "Mizoram" },
          { label: "Nagaland", value: "Nagaland" },
          { label: "Odisha", value: "Odisha" },
          { label: "Punjab", value: "Punjab" },
          { label: "Rajasthan", value: "Rajasthan" },
          { label: "Sikkim", value: "Sikkim" },
          { label: "Tamil Nadu", value: "Tamil Nadu" },
          { label: "Telangana", value: "Telangana" },
          { label: "Tripura", value: "Tripura" },
          { label: "Uttar Pradesh", value: "Uttar Pradesh" },
          { label: "Uttarakhand", value: "Uttarakhand" },
          { label: "West Bengal", value: "West Bengal" },
          { label: "Andaman and Nicobar Islands", value: "Andaman and Nicobar Islands" },
          { label: "Chandigarh", value: "Chandigarh" },
          { label: "Dadra and Nagar Haveli and Daman and Diu", value: "Dadra and Nagar Haveli and Daman and Diu" },
          { label: "Delhi", value: "Delhi" },
          { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
          { label: "Ladakh", value: "Ladakh" },
          { label: "Lakshadweep", value: "Lakshadweep" },
          { label: "Puducherry", value: "Puducherry" }
        ]);
        
      
        
        // Uncomment when APIs are available
        // const stationRes = await axios.get("/api/stations");
        // setStations(stationRes.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Customer validation
    if (!formData.Customer || formData.Customer.length < 3) {
      errors.Customer = "Name must be at least 3 characters long";
    }
    
    // Email validation
    if (!formData.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      errors.Email = "Valid email is required";
    }
    
    // Mobile validation
    if (!formData.Mobile || !/^[0-9]{10,15}$/.test(formData.Mobile)) {
      errors.Mobile = "Mobile number must be between 10 and 15 digits";
    }
    
    // Address validation
    if (!formData.Address) {
      errors.Address = "Address is required";
    }
    
    // Pincode validation
    if (!formData.Pincode || !/^[0-9]{6}$/.test(formData.Pincode)) {
      errors.Pincode = "Pincode must be 6 digits";
    }
    
    // Alias validation
    if (!formData.Alias || formData.Alias.length < 2) {
      errors.Alias = "Alias must be at least 2 characters long";
    }
    
    // Optional field validations - only validate if not empty
    if (formData.Gstno && formData.Gstno.trim() !== "") {
      // GST format: 2 digits, 10 chars, 1 digit, 1 char, 1 digit
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(formData.Gstno.trim())) {
        errors.Gstno = "GST number must be in valid format (e.g., 27AAPFU0939F1ZV)";
      }
    }
    
    if (formData.PanNo && formData.PanNo.trim() !== "") {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.PanNo.trim())) {
        errors.PanNo = "PAN number must be in format AAAAA9999A";
      }
    }
    
    // Log validation errors for debugging
    console.log("Validation errors:", errors);
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setDebugInfo(null);
    setSuccessMessage(null);
    
    // Validate form before submission
    if (!validateForm()) {
      setError("Please fix the validation errors before submitting");
      return;
    }
    
    // Check if we have a token
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    
    setLoading(true);

    try {
      // Create a payload with only the fields expected by the backend
      const payload = {
        Customer: formData.Customer,
        Email: formData.Email,
        Mobile: formData.Mobile,
        Address: formData.Address,
        Pincode: formData.Pincode,
        Alias: formData.Alias,
        Station: formData.Station || "",
        Druglicence: formData.Druglicence || "",
        // Only include GST and PAN if they're not empty and valid
        ...(formData.Gstno && formData.Gstno.trim() !== "" ? { Gstno: formData.Gstno.trim() } : {}),
        ...(formData.PanNo && formData.PanNo.trim() !== "" ? { PanNo: formData.PanNo.trim() } : {})
      };
      
      console.log("Sending payload:", payload);
      
      // Include the authentication token in the request
      const response = await axios.post(
        `${API_BASE_URL}/customer/create-customer`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data) {
        setSuccessMessage("Customer created successfully!");
        // Reset form
        setFormData({
          Customer: "",
          Email: "",
          Mobile: "",
          age: "",
          sex: "",
          Address: "",
          address2: "",
          referBy: "",
          city: "",
          state: "",
          Pincode: "",
          Alias: "",
          Station: "",
          medicalConditionNote: "",
          Druglicence: "",
          Gstno: "",
          PanNo: "",
        });
        setValidationErrors({});
      } else {
        setError(response.data?.message || "Failed to create customer");
        setDebugInfo(JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.error("API Error:", error);
      
      // Detailed error logging
      setDebugInfo(
        `Error: ${error.message}\n` +
        `Status: ${error.response?.status}\n` +
        `Data: ${JSON.stringify(error.response?.data, null, 2)}`
      );
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        // In a real app, you might want to redirect to login page here
      } else if (error.response?.data?.errors) {
        // Handle validation errors from the server
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.field] = err.message;
        });
        setValidationErrors(serverErrors);
        setError("Validation failed. Please check the form fields.");
      } else {
        setError(error.response?.data?.message || error.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: { xs: "10%", md: "8%" }, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper elevation={3} sx={{ width: { xs: "100%", sm: "80%", md: "60%" }, p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#72787F", textAlign: "start" }}>
            Customer Details
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {debugInfo && (
            <Alert severity="info" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              <Typography variant="subtitle2">Debug Information:</Typography>
              {debugInfo}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField 
                label="Full Name" 
                required 
                name="Customer" 
                value={formData.Customer} 
                onChange={handleChange}
                error={!!validationErrors.Customer}
                helperText={validationErrors.Customer}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField 
                label="Email" 
                required 
                name="Email" 
                value={formData.Email} 
                onChange={handleChange}
                error={!!validationErrors.Email}
                helperText={validationErrors.Email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CustomTextField 
                label="Phone Number" 
                required 
                name="Mobile" 
                value={formData.Mobile} 
                onChange={handleChange}
                error={!!validationErrors.Mobile}
                helperText={validationErrors.Mobile}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField label="Age" name="age" value={formData.age} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Sex"
                select
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                name="sex"
                value={formData.sex}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField 
                label="Address Line 1" 
                required 
                name="Address" 
                value={formData.Address} 
                onChange={handleChange}
                error={!!validationErrors.Address}
                helperText={validationErrors.Address}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField label="Address Line 2" name="address2" value={formData.address2} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField label="Refer by" name="referBy" value={formData.referBy} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField label="City" name="city" value={formData.city} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField label="State" select options={states} name="state" value={formData.state} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField 
                label="Postal Code" 
                required 
                name="Pincode" 
                value={formData.Pincode} 
                onChange={handleChange}
                error={!!validationErrors.Pincode}
                helperText={validationErrors.Pincode}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center", mt: 4, mb: 2 }}>
            Additional Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField 
                label="Alias" 
                required 
                name="Alias" 
                value={formData.Alias} 
                onChange={handleChange}
                error={!!validationErrors.Alias}
                helperText={validationErrors.Alias}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField 
                label="Station"  
                name="Station" 
                value={formData.Station} 
                onChange={handleChange}
                error={!!validationErrors.Station}
                helperText={validationErrors.Station}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField label="Medical Condition Note" name="medicalConditionNote" value={formData.medicalConditionNote} onChange={handleChange} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CustomTextField 
                label="Drug License" 
                name="Druglicence" 
                value={formData.Druglicence} 
                onChange={handleChange}
                error={!!validationErrors.Druglicence}
                helperText={validationErrors.Druglicence}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CustomTextField 
                label="GST Number" 
                name="Gstno" 
                value={formData.Gstno} 
                onChange={handleChange}
                error={!!validationErrors.Gstno}
                helperText={validationErrors.Gstno}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CustomTextField 
                label="PAN Number" 
                name="PanNo" 
                value={formData.PanNo} 
                onChange={handleChange}
                error={!!validationErrors.PanNo}
                helperText={validationErrors.PanNo}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Create Customer"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCustomerForm;
