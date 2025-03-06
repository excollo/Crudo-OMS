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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { RightSection } from "../../components/Auth-Component/LoginComponent";
import { Logo } from "../../components/Logo-component/Logo";



const NewPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse token and email from URL (from the reset link)
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Parse query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    const emailParam = queryParams.get("email");

    // if (tokenParam && emailParam) {
    //   setToken(tokenParam);
    //   setEmail(emailParam);
    //   setLoading(false);
    // } else {
    //   setError(
    //     "Invalid or expired password reset link. Please request a new one."
    //   );
    //   setLoading(false);
    // }
    setLoading(false);
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

    try {
      // This would be your actual API call
      // const response = await api.resetPassword(token, email, password);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to login page with success message
      navigate("/login", {
        state: {
          message:
            "Password successfully reset. You can now login with your new password.",
        },
      });
    } catch (err) {
      setError("Failed to reset password. Please try again.");
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
          <Button
            variant="contained"
            onClick={() => navigate("/forgot-password")}
            sx={{
              backgroundColor: "#A26E6C",
              "&:hover": {
                backgroundColor: "#96616B",
              },
            }}
          >
            Request New Reset Link
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
              Enter a new password for {email}
            </Typography>

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

// ========================
// PASSWORD RESET FLOW LOGIC
// ========================

/*
Here's how the complete password reset flow works:

1. User Flow:
   a. User clicks "Forgot Password" on the login page
   b. User enters email on the ForgotPasswordForm
   c. After submission, user sees PasswordRecoveryConfirmation
   d. User receives email with reset link
   e. User clicks link in email, which opens NewPasswordPage with token/email in URL
   f. User sets new password on NewPasswordPage
   g. After successful reset, user is redirected to LoginPage with success message

2. Implementation Details:

   a. ForgotPasswordForm:
      - Makes API call to request password reset email
      - Redirects to PasswordRecoveryConfirmation on success
      
      // Example API call in ForgotPasswordForm
      const requestPasswordReset = async (email) => {
        try {
          const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          
          if (response.ok) {
            navigate('/password-recovery-confirmation', { state: { email } });
          } else {
            setError('Failed to send reset email');
          }
        } catch (err) {
          setError('Network error');
        }
      };

   b. Email Link Format:
      - The backend generates a secure token for password reset
      - Email contains link like: https://yourapp.com/reset-password?token=abc123&email=user@example.com
      
   c. NewPasswordPage:
      - Extracts token and email from URL parameters
      - Validates token with backend before allowing password reset
      - Makes API call to set new password when form is submitted
      
      // Example API call in NewPasswordPage
      const resetPassword = async (token, email, newPassword) => {
        try {
          const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, email, newPassword })
          });
          
          if (response.ok) {
            navigate('/login', { 
              state: { message: 'Password successfully reset. You can now login with your new password.' } 
            });
          } else {
            setError('Failed to reset password');
          }
        } catch (err) {
          setError('Network error');
        }
      };

3. Security Considerations:
   - Reset tokens should be single-use and time-limited (typically 1 hour)
   - Tokens should be securely generated with sufficient entropy
   - Password requirements should be enforced on both client and server side
   - Rate limiting should be implemented for reset requests
*/
// Last edited 6 minutes ago
