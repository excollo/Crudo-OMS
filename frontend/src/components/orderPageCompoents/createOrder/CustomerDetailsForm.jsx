// components/CustomerDetailsForm.js
import React from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";

const CustomerDetailsForm = ({ formData = {}, handleChange }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        ml: "13%",
        p: 3,
        width: "80%",
        height: "100%",
        borderRadius: "1%",
        boxShadow: "none", // ✅ Removed duplicate
      }}
    >
      <Grid container spacing={2}>
        <Box
          mb={3}
          sx={{
            width: "100%",
            p: "2%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: "700", color: "#72787F" }}
          >
            Customer Details
          </Typography>
          <Button
            variant="contained"
            sx={{
              fontWeight: "700",
              color: "#72787F",
              bgcolor: "#E8EBED",
              "&:hover": { bgcolor: "#e0e0e0" },
            }}
          >
            Update Customer
          </Button>
        </Box>

        {/* Full Name */}
        <Grid item xs={12}>
          <InputLabel htmlFor="fullName" sx={{ mb: 1 }}>
            Full name
          </InputLabel>
          <TextField
            id="fullName"
            name="fullName"
            fullWidth
            variant="outlined"
            value={formData.fullName || ""}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Email and Phone */}
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="email" sx={{ mb: 1 }}>
            Email
          </InputLabel>
          <TextField
            id="email"
            name="email"
            fullWidth
            variant="outlined"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="phoneNumber" sx={{ mb: 1 }}>
            Phone Number
          </InputLabel>
          <TextField
            id="phoneNumber"
            name="phoneNumber"
            fullWidth
            variant="outlined"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Age and Sex */}
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="age" sx={{ mb: 1 }}>
            Age
          </InputLabel>
          <TextField
            id="age"
            name="age"
            fullWidth
            variant="outlined"
            value={formData.age || ""}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="sex" sx={{ mb: 1 }}>
            Sex
          </InputLabel>
          <FormControl fullWidth>
            <Select
              id="sex"
              name="sex"
              value={formData.sex || ""}
              onChange={handleChange}
              required
              displayEmpty
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <InputLabel htmlFor="address" sx={{ mb: 1 }}>
            Address
          </InputLabel>
          <TextField
            id="address"
            name="address"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.address || ""}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Refer by */}
        <Grid item xs={12}>
          <InputLabel htmlFor="referBy" sx={{ mb: 1 }}>
            Refer by
          </InputLabel>
          <TextField
            id="referBy"
            name="referBy"
            fullWidth
            variant="outlined"
            value={formData.referBy || ""}
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CustomerDetailsForm;
