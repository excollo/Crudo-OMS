
import React, { useState } from "react";
import {
  Container,
  Grid,
  ThemeProvider,
} from "@mui/material";
import { Logo } from "../../components/Logo-component/Logo";
import ForgotPasswordForm from "../../components/Auth-Component/ForgetPassword";
import { RightSection } from "../../components/Auth-Component/LoginComponent";
import theme from "../../components/Theme/Theme";

// Forgot Password Page component
const ForgotPasswordPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Logo />

        <Grid container sx={{ height: "100%" }}>
          {/* Left Section - Form */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              bgcolor: "white",
            }}
          >
            <ForgotPasswordForm />
          </Grid>

          {/* Right Section - Image (same as in the original code) */}
          <Grid
            item
            md={6}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "relative",
              bgcolor: "#D3CFC1",
            }}
          >
            <RightSection/>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotPasswordPage;
