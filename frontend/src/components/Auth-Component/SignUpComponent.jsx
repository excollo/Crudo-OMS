import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Link,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Terms and Conditions Modal
export const TermsModal = ({
  open,
  handleClose,
  handleAgree,
  checked,
  onChange,
}) => {
  const termsCheckboxRef = useRef(null); // Create a ref

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEnforceFocus // Prevents unwanted focus restrictions
      disableRestoreFocus // Stops MUI from forcing focus back
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        component="div" // 👈 Prevents nesting issues
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="700">
          Terms and Conditions
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body1" paragraph>
          Terms and conditions outline what users can and cannot do with your
          website, products, and services. They lay out the rules to protect you
          in case of misuse and enable you to take action if it becomes
          necessary.
        </Typography>
        <Typography variant="body1" paragraph>
          It's also referred to by other names such as terms of service (ToS)
          and terms of use (ToU). Even though they have different names, in fact
          – there is no difference.
        </Typography>
        <Typography variant="body1" paragraph>
          In order to use your website, products, or services, your customers
          usually must agree to abide by your terms and conditions first.
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              inputRef={termsCheckboxRef} // 👈 Set focus here
              checked={checked}
              onChange={onChange}
              size="small"
            />
          }
          label={
            <Typography variant="body1">
              I have read and agree to these Terms and Conditions
            </Typography>
          }
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 2, px: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#B27777",
            color: "#B27777",
            borderRadius: 0.5,
            px: 3,
            py: 1,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAgree}
          variant="contained"
          disabled={!checked}
          sx={{
            bgcolor: "#A26E6C",
            color: "white",
            "&:hover": { bgcolor: "#96616B" },
            borderRadius: 0.5,
            px: 3,
            py: 1,
            textTransform: "none",
          }}
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [modalChecked, setModalChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    termsError: false,
    nameError: "",
    emailError: "",
    passwordError: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  let navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear errors when user types
    if (formErrors[`${e.target.name}Error`]) {
      setFormErrors({
        ...formErrors,
        [`${e.target.name}Error`]: "",
      });
    }
  };

  const termsCheckboxRef = useRef(null); // Create a ref

  const handleTermsClick = () => {
    setModalChecked(false);
    setTermsOpen(true);

    setTimeout(() => {
      termsCheckboxRef.current?.focus(); // Move focus to checkbox
    }, 0);
  };

  const handleTermsClose = () => {
    setTermsOpen(false);
    setModalChecked(false);
    setTermsChecked(false); // If user closes without agreeing, uncheck the main checkbox
  };

  const handleModalCheckboxChange = (e) => {
    setModalChecked(e.target.checked);
  };

  const handleTermsAgree = () => {
    if (modalChecked) {
      setTermsChecked(true);
      setFormErrors({ ...formErrors, termsError: false });
    }
    setTermsOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.nameError = "Name is required";
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.emailError = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.emailError = "Email is invalid";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.passwordError = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.passwordError = "Password must be at least 8 characters";
      valid = false;
    }

    // Terms validation
    if (!termsChecked) {
      newErrors.termsError = true;
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  // Function to send OTP to user's email
  const sendOtpEmail = async (email) => {
    // In a real implementation, this would be an API call to your backend
    try {
      // Example API call
      // const response = await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body1: JSON.stringify({ email }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to send OTP');
      // }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return { success: true };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send OTP to user's email
      const otpResult = await sendOtpEmail(formData.email);

      if (otpResult.success) {
        // Store registration data in localStorage or sessionStorage for later use
        // In a real app, you might want to store this data securely or in a state management system
        sessionStorage.setItem("registrationData", JSON.stringify(formData));

        // Redirect to OTP verification page with the email
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        // Handle error
        throw new Error(otpResult.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Show error message to user
      alert("Failed to register: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        color: "#26282B",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "350px",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "700" }}>
        Create Account
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        Fill your information below or register with your social account
      </Typography>

      <TextField
        name="name"
        placeholder="Your name"
        variant="outlined"
        fullWidth
        margin="dense"
        value={formData.name}
        onChange={handleChange}
        error={!!formErrors.nameError}
        helperText={formErrors.nameError}
        sx={{ mb: formErrors.nameError ? 0 : 2 }}
      />

      <TextField
        name="email"
        placeholder="Your email"
        variant="outlined"
        fullWidth
        margin="dense"
        value={formData.email}
        onChange={handleChange}
        error={!!formErrors.emailError}
        helperText={formErrors.emailError}
        sx={{ mb: formErrors.emailError ? 0 : 2 }}
      />

      <TextField
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Your password"
        variant="outlined"
        fullWidth
        margin="dense"
        value={formData.password}
        onChange={handleChange}
        error={!!formErrors.passwordError}
        helperText={formErrors.passwordError}
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
        sx={{ mb: formErrors.passwordError ? 0 : 3 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={termsChecked}
            onChange={handleTermsClick} // Open modal on click
            size="small"
            sx={{ mb: 3 }}
          />
        }
        label={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body1" component="span">
              I agree with
            </Typography>
            <Button
              variant="body1"
              onClick={handleTermsClick}
              sx={{
                fontWeight: "700",
                outline: "none",
                border: "none",
                "&:focus": { outline: "none" },
                "&:active": { outline: "none" },
                textTransform: "none",
                p: "0 4px",
                minWidth: "auto",
              }}
            >
              Privacy Policy and Terms
            </Button>
            <Typography variant="body1" component="span">
              and
            </Typography>

            <Typography variant="body1" component="span">
              Conditions
            </Typography>
          </Box>
        }
        sx={{ mb: 1 }}
      />

      {formErrors.termsError && (
        <FormHelperText error sx={{ mb: 2, ml: 2 }}>
          You must agree to the Terms and Conditions
        </FormHelperText>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={{
          mt: 2,
          mb: 2,
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
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <Typography variant="h6">Sign up</Typography>
        )}
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Typography variant="body1" sx={{ color: "#72787F", mr: 1 }}>
          Already have an account?
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

      <TermsModal
        open={termsOpen}
        handleClose={handleTermsClose}
        handleAgree={handleTermsAgree}
        checked={modalChecked}
        onChange={handleModalCheckboxChange}
      />
    </Box>
  );
};
