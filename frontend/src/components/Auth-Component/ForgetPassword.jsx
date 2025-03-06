import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// Forgot Password Form component with validation
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [isResending, setIsResending] = useState(false);

  // Email validation using regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate email whenever it changes
  useEffect(() => {
    if (!email) {
      setIsValidEmail(false);
      setEmailError("");
    } else if (!validateEmail(email)) {
      setIsValidEmail(false);
      setEmailError("Please enter a valid email address");
    } else {
      setIsValidEmail(true);
      setEmailError("");
    }
  }, [email]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidEmail) {
      // Password recovery logic will be added here in the future
      console.log("Recovery email sent to:", email);
      setIsSubmitted(true);
    }
  };

  const handleResendEmail = () => {
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
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
      {!isSubmitted ? (
        <>
          <Typography variant="h5" sx={{ fontWeight: "700", mb: 3 }}>
            Forgot Password
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            No worries, we'll send a recovery link to your email.
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "600", mb: 1 }}>
            Email
          </Typography>
          <TextField
            name="email"
            placeholder="Enter email"
            variant="outlined"
            fullWidth
            margin="dense"
            value={email}
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isValidEmail}
            sx={{
              mt: 1,
              mb: 1,
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
              "&.Mui-disabled": {
                backgroundColor: "#cccccc",
                color: "#666666",
              },
            }}
          >
            <Typography variant="h6">Send a recovery link</Typography>
          </Button>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Back to
            </Typography>
            <Link
              style={{
                fontWeight: "600",
                color: "#334EAC",
                textDecoration: "none",
                padding: 0,
              }}
              to="/login"
            >
              Login
            </Link>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h5" sx={{ fontWeight: "700", mb: 3 }}>
            Password recovery
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "700", mb: 1 }}>
            Check your email
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            We have sent a password reset link to
            <br />
            {email}
          </Typography>
          {/* Button row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              width: "100%",
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              mb: 2,
              ml: { xs: "auto", sm: -1.5 },
            }}
          >
            {/* Resend button */}
            <Button
              variant="outlined"
              disabled={isResending}
              onClick={handleResendEmail}
              sx={{
                mb: { xs: 2, sm: 0 },
                textTransform: "none",
                outline: "none",
                border: "none",
                "&:focus": { outline: "none" },
                "&:active": { outline: "none" },
                color: "text.secondary",
                "&:hover": {
                  color: "#26282B",
                },
                height: "40px",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "700",
                  textTransform: "none",
                  outline: "none",
                  border: "none",
                  "&:focus": { outline: "none" },
                  "&:active": { outline: "none" },
                }}
              >
                {" "}
                {isResending ? "Sending..." : "Resend e-mail"}
              </Typography>
            </Button>

            {/* Back to login link */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-end" },
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                Back to
              </Typography>
              <Link
                to="/login"
                style={{
                  background:
                    "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  textDecoration: "none",
                  fontWeight: "700",
                  display: "inline-block", // Needed for the gradient text to display properly
                }}
              >
                Login
              </Link>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ForgotPasswordForm;
