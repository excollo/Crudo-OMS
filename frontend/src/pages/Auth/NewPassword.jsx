import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { RightSection } from "../../components/Auth-Component/LoginComponent";
import { Logo } from "../../components/Logo-component/Logo";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../redux/slices/authSlice"; // Adjust path as needed

const NewPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Parse token from URL (from the reset link)
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  // Password states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation states
  const [validations, setValidations] = useState({
    hasCapital: false,
    hasLowercase: false,
    hasNumber: false,
    hasMinLength: false,
    passwordsMatch: false,
  });

  // Extract and clean the token from the URL
  useEffect(() => {
    let foundToken = null;

    // Log for debugging
    console.log("Current pathname:", location.pathname);
    setDebugInfo(`Current pathname: ${location.pathname}`);

    // Check if we're on the password-recovery-confirmation route
    if (
      location.pathname.includes(
        "/password-recovery-confirmation/reset-password/"
      )
    ) {
      // Extract token from URL path
      const pathSegments = location.pathname.split("/");
      // The token should be the last segment in the URL
      foundToken = pathSegments[pathSegments.length - 1];
      console.log("Token extracted from path:", foundToken);
      setDebugInfo((prev) => `${prev}\nToken from path: ${foundToken}`);
    }
    // Check if we're on the reset-password route
    else if (location.pathname.includes("/reset-password/")) {
      const pathSegments = location.pathname.split("/reset-password/");
      if (pathSegments.length > 1) {
        foundToken = pathSegments[1];
        console.log("Token extracted from reset-password path:", foundToken);
        setDebugInfo(
          (prev) => `${prev}\nToken from reset-password path: ${foundToken}`
        );
      }
    }

    // If not found in paths, check query parameters
    if (!foundToken) {
      const queryParams = new URLSearchParams(location.search);
      foundToken = queryParams.get("token");
      const emailParam = queryParams.get("email");

      console.log("Token from query params:", foundToken);
      setDebugInfo((prev) => `${prev}\nToken from query: ${foundToken}`);

      if (emailParam) {
        setEmail(emailParam);
        console.log("Email from query:", emailParam);
        setDebugInfo((prev) => `${prev}\nEmail: ${emailParam}`);
      }
    }

    if (foundToken) {
      // Remove any trailing slashes or special characters
      foundToken = foundToken.replace(/[/\s]/g, "");
      setToken(foundToken);
      console.log("Final token set:", foundToken);
      setDebugInfo((prev) => `${prev}\nFinal token: ${foundToken}`);
      setLoading(false);
    } else {
      setError(
        "Invalid or expired password reset link. Please request a new one."
      );
      setLoading(false);
    }
  }, [location]);

  // Validate password on change
  useEffect(() => {
    setValidations({
      hasCapital: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasMinLength: password.length >= 8,
      passwordsMatch: password === confirmPassword && password !== "",
    });
  }, [password, confirmPassword]);

  // Check if all validations pass
  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) return;

    setIsSubmitting(true);
    setError("");

    try {
      console.log("Submitting with token:", token);
      setDebugInfo((prev) => `${prev}\nSubmitting with token: ${token}`);

      // Call the redux action to reset the password
      const result = await dispatch(
        resetPassword({
          token,
          newPassword: password,
        })
      ).unwrap();

      console.log("Reset password result:", result);
      setDebugInfo(
        (prev) => `${prev}\nAPI Response: ${JSON.stringify(result)}`
      );

      // Redirect to login page with success message
      navigate("/signin", {
        state: {
          message:
            "Password successfully reset. You can now login with your new password.",
        },
      });
    } catch (err) {
      console.error("Password reset error:", err);
      setDebugInfo((prev) => `${prev}\nError: ${JSON.stringify(err)}`);

      // Handle specific error cases
      if (err && typeof err === "object") {
        setError(
          err.message ||
            "Password reset failed. The token may be invalid or expired."
        );
      } else {
        setError("Password reset failed. Please request a new reset link.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: isValid ? "#96616B" : "#757575",
        mb: 0.5,
      }}
    >
      {isValid ? (
        <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: "#96616B" }} />
      ) : (
        <ErrorIcon fontSize="small" sx={{ mr: 1, color: "#757575" }} />
      )}
      <Typography variant="body1">{text}</Typography>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth={false} disableGutters sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth={false}
        disableGutters
        sx={{ backgroundColor: "#fff", height: "100vh" }}
      >
        <Logo />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            p: 2,
            
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "700", mb: 2, color: "#d32f2f" }}
          >
            Error
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
            {error}
          </Typography>
          {debugInfo && (
            <Alert
              severity="info"
              sx={{ mb: 3, width: "100%", maxWidth: "600px" }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {debugInfo}
              </Typography>
            </Alert>
          )}
          <Button
            variant="contained"
            onClick={() => navigate("/reset-password")}
            sx={{
              backgroundColor: "#A26E6C",
              "&:hover": {
                backgroundColor: "#96616B",
              },
            }}
          >
            REQUEST NEW RESET LINK
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundColor: "#fff",
        fontFamily: "'Inter', sans-serif",
        color: "#26282B",
        height: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >
      <Logo />

      <Grid container sx={{ mt: 5, height: "100%" }}>
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
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "700", mb: 2 }}>
              New password
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
              {email
                ? `Enter a new password for ${email}`
                : "Enter your new password"}
            </Typography>

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{ whiteSpace: "pre-wrap" }}
                >
                  Token being used: {token}
                </Typography>
              </Alert>
            )}

            <Typography variant="body1" sx={{ fontWeight: "700", mb: 1 }}>
              New Password
            </Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="Your new password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Typography variant="body1" sx={{ fontWeight: "700", mb: 1 }}>
              Confirm New Password
            </Typography>
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Typography variant="body1" sx={{ mb: 1, fontWeight: "700" }}>
              Your password must contain
            </Typography>

            <Box sx={{ mb: 3 }}>
              <ValidationItem
                isValid={validations.hasCapital}
                text="At least one capital letter"
              />
              <ValidationItem
                isValid={validations.hasLowercase}
                text="At least one lowercase letter"
              />
              <ValidationItem
                isValid={validations.hasNumber}
                text="At least one number"
              />
              <ValidationItem
                isValid={validations.hasMinLength}
                text="Minimum character length is 8 characters"
              />
              {confirmPassword.length > 0 && (
                <ValidationItem
                  isValid={validations.passwordsMatch}
                  text="Passwords match"
                />
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!isPasswordValid || isSubmitting}
              sx={{
                mt: 1,
                mb: 3,
                py: 1.5,
                backgroundColor: "#A26E6C",
                "&:hover": {
                  backgroundColor: "#96616B",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                <Typography variant="h6">Set new password</Typography>
              )}
            </Button>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: "700", mr: 1 }}>
                Back to
              </Typography>
              <Box
                component="a"
                href="/login"
                sx={{
                  background:
                    "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textDecoration: "none",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Login
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Section - Image */}
        <Grid
          item
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#D3CFC1",
            position: "relative",
          }}
        >
          <RightSection />
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewPasswordPage;
