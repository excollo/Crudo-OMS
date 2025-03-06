import React from "react";
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
} from "@mui/material";
import FormButtons from "../createOrder/FormButtons";


const CustomTextField = ({ label, required, select, options }) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    {select ? (
      <Select required={required}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    ) : (
      <TextField label={label} required={required} fullWidth />
    )}
  </FormControl>
);
  const CreateCustomerFrom = () => {
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    }
  return (
    <Box
      sx={{
        mt: { xs: "10%", md: "8%" },

        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Center the form
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: "100%", sm: "80%", md: "60%" }, // Adjust for mobile screens
          ml: { xs: "0%", sm: "15%", md: "0%" },
          // maxWidth: "600px", // Prevent it from being too wide
          boxShadow: "none",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              border: "2px solid #eee",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#72787F",
                textAlign: "start",
              }}
            >
              Customer Details
            </Typography>

            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12}>
                <InputLabel>Full Name*</InputLabel>
                <TextField
                  fullWidth
                  name="fullName"
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Email & Phone */}
              {["email", "phoneNumber"].map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <InputLabel>
                    {field === "email" ? "Email*" : "Phone Number*"}
                  </InputLabel>
                  <TextField
                    fullWidth
                    name={field}
                    variant="outlined"
                    required
                  />
                </Grid>
              ))}

              {/* Age & Sex */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Age*</InputLabel>
                <TextField fullWidth name="age" variant="outlined" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Sex*</InputLabel>
                <FormControl fullWidth>
                  <Select name="sex" displayEmpty>
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <InputLabel>Address Line 1*</InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="address1"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Address Line 2</InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="address2"
                  variant="outlined"
                />
              </Grid>

              {/* Refer By */}
              <Grid item xs={12}>
                <InputLabel>Refer by*</InputLabel>
                <TextField
                  fullWidth
                  name="referBy"
                  variant="outlined"
                  required
                />
              </Grid>

              {/* City & State */}
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="City*"
                  required
                  select
                  options={[{ label: "Select City", value: "" }]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="State*"
                  required
                  select
                  options={[{ label: "Select State", value: "" }]}
                />
              </Grid>

              {/* Postal Code */}
              <Grid item xs={12}>
                <CustomTextField label="Postal Code*" required />
              </Grid>
            </Grid>
          </Box>

          {/* Additional Details */}
          <Box sx={{ p: 3, borderRadius: 2, mt: 4, border: "2px solid #eee" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, textAlign: "center", mb: 1 }}
                >
                  Additional Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField label="Abhar No.*" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField label="Alias*" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Station*"
                  required
                  select
                  options={[{ label: "Select Station", value: "" }]}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField label="Medical Condition Note*" required />
              </Grid>
            </Grid>
          </Box>

          {/* Form Buttons */}
          <FormButtons />
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCustomerFrom;
