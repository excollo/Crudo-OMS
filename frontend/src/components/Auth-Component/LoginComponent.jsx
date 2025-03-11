import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import medicineImage from "../../assets/authpage-images/madicine.png";
import { clearError, loginUser } from "../../redux/slices/authSlice";
import { setAuthToken, isValidToken } from "../../utils/AuthUtils";
// Social login buttons component

export const SocialLoginButtons = () => {
  // ... existing code ...
  const socialIcons = [
    {
      name: "Google",
      svg: (
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Apple",
      color: "#000000",
      path: "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z",
    },
    {
      name: "Twitter",
      color: "#01A7E7",
      path: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z",
    },
  ];

  const handleSocialLogin = (provider) => {
    // In the future, this will be connected to authentication logic
    console.log(`Login with ${provider}`);
    // You would add the social login implementation here
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
      {socialIcons.map((social) => (
        <IconButton
          key={social.name}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "50%",
            p: 1.5,
            width: 40,
            height: 40,
            outline: "none",
            border: "none",
            "&:focus": { outline: "none" },
            "&:active": { outline: "none" },
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
          aria-label={`login with ${social.name}`}
          onClick={() => handleSocialLogin(social.name)}
        >
          {social.svg ? (
            social.svg
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 512 512"
              fill={social.color}
            >
              <path d={social.path} />
            </svg>
          )}
        </IconButton>
      ))}
    </Box>
  );
};

// Login Form Component
export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
const [Error,setError] = useState("")
  const { loading, error, twoFactorRequired, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
   const defaultPath = "/dashboard";

  // Reset password hint when typing a new password
  useEffect(() => {
    if (showPasswordHint) {
      setShowPasswordHint(false);
    }
  }, [formData.password]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
  // // Check if error contains password-related messages
  useEffect(() => {
    if (error) {
      const passwordErrors = [
        "incorrect password",
        "invalid password",
        "wrong password",
        "password doesn't match",
        "incorrect credentials",
      ];

      const hasPasswordError = passwordErrors.some((errText) =>
        error.toLowerCase().includes(errText)
      );

      if (hasPasswordError) {
        setPasswordAttempts((prev) => prev + 1);
        setShowPasswordHint(true);
      }
    }
  }, [error]);

const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(clearError());

  try {
    setError("");
    const result = await dispatch(
      loginUser({
        email: formData.email,
        password: formData.password,
      })
    ).unwrap();

    console.log("Login result:", result);

    if (result.requiresTwoFactor) {
      // User has 2FA enabled, redirect to OTP page
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          userId: result._id,
          tempToken: result.tempToken,
        },
        replace: true,
      });
    } else if (result.accessToken) {
      // Normal login successful
      setAuthToken(result.accessToken);
      navigate(defaultPath, { replace: true });
    } else {
      throw new Error("Invalid login response");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError(typeof err === "string" ? err : "Login failed. Please try again.");
    setPasswordAttempts((prev) => prev + 1);

    // Show password hint after multiple failed attempts
    if (passwordAttempts >= 2 && !showPasswordHint) {
      setShowPasswordHint(true);
    }
  }
};
  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/reset-password");
  };

  // Password hint message based on number of attempts
  const getPasswordHintMessage = () => {
    if (passwordAttempts === 1) {
      return "Incorrect password. Please try again.";
    } else if (passwordAttempts === 2) {
      return "Still incorrect. Remember passwords are case-sensitive.";
    } else {
      return "Multiple failed attempts. Try resetting your password.";
    }
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

      {error && !showPasswordHint && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="body1" sx={{ fontWeight: "600", mb: 1 }}>
        Email
      </Typography>
      <TextField
        name="email"
        placeholder="Your email"
        variant="outlined"
        fullWidth
        margin="dense"
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Typography variant="body1" sx={{ fontWeight: "600", mb: 1 }}>
        Password
      </Typography>
      <TextField
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Your password"
        variant="outlined"
        fullWidth
        margin="dense"
        value={formData.password}
        onChange={handleChange}
        error={showPasswordHint}
        helperText={showPasswordHint ? getPasswordHintMessage() : ""}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
                sx={{
                  outline: "none",
                  border: "none",
                  "&:focus": { outline: "none" },
                  "&:active": { outline: "none" },
                }}
                disableRipple
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          onClick={handleForgotPassword}
          sx={{
            textDecoration: "none",
            p: 0,
            background:
              "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textDecoration: "none",
            fontWeight: "700",
            cursor: "pointer",
            minWidth: "auto",
          }}
        >
          Forgot Password
        </Button>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || !formData.email || !formData.password}
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
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <Typography variant="h6">Log in</Typography>
        )}
      </Button>

      {/* other option to login  */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          my: 3,
        }}
      >
        <Divider sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: "#F5F5F5",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#72787F",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            OR
          </Typography>
        </Box>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Link
          component="button"
          onClick={() => navigate("/login-with-phone")}
          variant="body1"
          sx={{
            fontWeight: "600",
            color: "#081F5C",
            textDecoration: "none",
          }}
        >
          Log in with Phone
        </Link>
      </Box>

      <SocialLoginButtons />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Typography variant="body1" sx={{ color: "#72787F", mr: 1 }}>
          Don't have an account?
        </Typography>
        <Button
          onClick={() => navigate("/signup")}
          variant="body1"
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
          <Typography variant="body1" sx={{ fontWeight: "700" }}>
            Register
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

// export default LoginForm;

// right section
export const RightSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${medicineImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 75%",
        backgroundRepeat: "no-repeat",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "white",
          textAlign: "center",
          mb: 1,
          fontWeight: "700",
        }}
      >
        Manage orders and prescriptions
      </Typography>
      <Typography
        variant="h4"
        sx={{
          mb: "20%",
          color: "white",
          textAlign: "center",
          fontWeight: "700",
        }}
      >
        with ease on Crudo!
      </Typography>
    </Box>
  );
};
