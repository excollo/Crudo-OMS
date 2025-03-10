import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LoginForm, RightSection } from "../../components/Auth-Component/LoginComponent";
import theme from "../../components/Theme/Theme";
import {Logo} from "../../components/Logo-component/Logo";


const Login = () => {
  

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
            <LoginForm />
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

export default Login;
