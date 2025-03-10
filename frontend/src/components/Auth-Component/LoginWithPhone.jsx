import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  Link,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {RightSection } from "./LoginComponent";
import theme from "../Theme/Theme";
import { Logo } from "../Logo-component/Logo";

// Array of countries with their codes and flag URLs
const countriesList = [
  {
    code: "+91",
    name: "India",
    flag: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
  },
  {
    code: "+971",
    name: "United Arab Emirates",
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg",
  },
  {
    code: "+1",
    name: "United States",
    flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
  },
  {
    code: "+44",
    name: "United Kingdom",
    flag: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
  },
  {
    code: "+61",
    name: "Australia",
    flag: "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg",
  },
  {
    code: "+86",
    name: "China",
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
  },
  {
    code: "+33",
    name: "France",
    flag: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
  },
  {
    code: "+49",
    name: "Germany",
    flag: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg",
  },
  {
    code: "+81",
    name: "Japan",
    flag: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg",
  },
  {
    code: "+82",
    name: "South Korea",
    flag: "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg",
  },
  {
    code: "+966",
    name: "Saudi Arabia",
    flag: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg",
  },
  {
    code: "+65",
    name: "Singapore",
    flag: "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Singapore.svg",
  },
  {
    code: "+27",
    name: "South Africa",
    flag: "https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg",
  },
  {
    code: "+55",
    name: "Brazil",
    flag: "https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg",
  },
  {
    code: "+7",
    name: "Russia",
    flag: "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg",
  },
];



// Phone Login Form Component
const PhoneLoginForm = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: "+91", // Default to India country code
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Allow only numbers
      const numbersOnly = value.replace(/[^\d]/g, "");

      // Limit to 10 digits
      const truncated = numbersOnly.slice(0, 10);

      setFormData({
        ...formData,
        [name]: truncated,
      });

      // Set error message if user tries to enter more than 10 digits
      if (numbersOnly.length > 10) {
        setError("Phone number must be 10 digits");
      } else if (numbersOnly.length < 10 && numbersOnly.length > 0) {
        setError("Phone number must be 10 digits");
      } else {
        setError("");
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phone login form submission logic will be added here
    console.log("Phone login form submitted:", formData);
    // This would trigger sending verification code in a real implementation
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        color: "#26282B",
        fontFamily: "Inter,sans-serif",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "350px",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "700", mb: 3, mt: "20%" }}>
        Log in
      </Typography>

      <Typography variant="body" sx={{ mb: 2 }}>
        We'll send you a verification code you can use to log in
      </Typography>

      <Typography variant="body" sx={{ fontWeight: "600", mb: 1 }}>
        Phone number
      </Typography>
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <FormControl sx={{ minWidth: "100px", border: "none" }}>
          <Select
            value={formData.countryCode}
            name="countryCode"
            onChange={handleChange}
            displayEmpty
            variant="standard"
            disableUnderline
            sx={{
              height: "56px",
              pl: 1,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                pl: 1,
                pr: 0,
              },
            }}
            renderValue={(value) => {
              const country = countriesList.find((c) => c.code === value);
              return (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    style={{ width: 20, marginRight: 8 }}
                  />
                  {value}
                </Box>
              );
            }}
          >
            {countriesList.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    style={{ width: 20, marginRight: 8 }}
                  />
                  {country.code} ({country.name})
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="phoneNumber"
          placeholder="Phone number"
          variant="standard"
          fullWidth
          value={formData.phoneNumber}
          onChange={handleChange}
          type="tel"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            pl: 1,
            "& .MuiInputBase-input": {
              height: "38px",
              p: 1,
            },
          }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 1,
          mb: 3,
          py: 1.5,
          textTransform: "none",
          backgroundColor: "#A26E6C",
          outline: "none",
          border: "none",
          "&:focus": { outline: "none" },
          "&:active": { outline: "none" },
          "&:hover": {
            backgroundColor: "#96616B",
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "500" }}>
          Log in
        </Typography>
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Typography variant="body" sx={{ color: "#72787F", mr: 1 }}>
          Don't have an account?
        </Typography>
        <Link
          component="button"
          onClick={() => navigate("/signup")}
          variant="body2"
          sx={{
            fontWeight: "700",
            color: "#081F5C",
            textDecoration: "none",
          }}
        >
          Register
        </Link>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Link
          component="button"
          onClick={() => navigate("/login")}
          variant="body"
          sx={{
            fontWeight: "500",
            color: "#081F5C",
            textDecoration: "none",
          }}
        >
          Back to email login
        </Link>
      </Box>
    </Box>
  );
};




// Main Phone Login Page component
const PhoneLoginPageComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Logo />
      </Box>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          fontFamily: "'Inter',sans-serif",
          height: "100vh",
          width: "100vw",
          display: "flex",
          backgroundColor: "white",
        }}
      >
        <Grid container sx={{ height: "100%" }}>
          {/* Left Section - Form */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              position: "relative",
              bgcolor: "#F5F5F5",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              bgcolor: "white",
            }}
          >
            <PhoneLoginForm />
          </Grid>

          {/* Right Section - Image */}
          <Grid
            item
            md={6}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "relative",
              bgcolor: "#D3CFC1",
            }}
          >
            <RightSection />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default PhoneLoginPageComponent;
