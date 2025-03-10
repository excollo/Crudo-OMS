import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset } from "../../redux/slices/authSlice";

// Forgot Password Form component with validation and backend integration
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidEmail) {
      try {
        await dispatch(requestPasswordReset(email)).unwrap();
        setIsSubmitted(true);
      } catch (err) {
        console.error("Password reset request error:", err);
        // Error is handled by the reducer and will be available in the error state
      }
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await dispatch(requestPasswordReset(email)).unwrap();
      // Success message could be displayed here
    } catch (err) {
      console.error("Resend password reset email error:", err);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/signin");
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

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

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
            disabled={!isValidEmail || loading}
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
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Typography variant="h6">Send a recovery link</Typography>
            )}
          </Button>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Back to
            </Typography>
            <Button
              onClick={handleBackToLogin}
              sx={{
                outline: "none",
                border: "none",
                "&:focus": { outline: "none" },
                "&:active": { outline: "none" },
                color: "#081F5C",
                textDecoration: "none",
                p: 0.1,
                fontWeight:700,
                background:
                  "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Login
            </Button>
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
              <Button
                onClick={handleBackToLogin}
                sx={{
                  outline: "none",
                  border: "none",
                  "&:focus": { outline: "none" },
                  "&:active": { outline: "none" },
                  color: "#081F5C",
                  textDecoration: "none",
                  p: 0,
                  background:
                    "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ForgotPasswordForm;
