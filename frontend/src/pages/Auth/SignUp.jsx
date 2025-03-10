import React, { useState } from "react";
import {Logo} from "../../components/Logo-component/Logo";

import { ThemeProvider } from "@mui/material/styles";
import { Box, Container, Grid } from "@mui/material";
import theme from "../../components/Theme/Theme";
import { RegisterForm } from "../../components/Auth-Component/SignUpComponent";
import { RightSection } from "../../components/Auth-Component/LoginComponent";

const SignUp = () => {

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Logo />
      </Box>
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
            <RegisterForm />
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

export default SignUp;
