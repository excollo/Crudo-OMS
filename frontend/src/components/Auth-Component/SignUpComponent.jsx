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
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";

// Terms and Conditions Modal
export const TermsModal = ({
  open,
  handleClose,
  handleAgree,
  checked,
  onChange,
  checkboxRef,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: "80vh" },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Terms and Conditions
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body1" paragraph>
          Welcome to our platform. Please read these terms and conditions
          carefully before using our service.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing or using our service, you agree to be bound by these
          Terms. If you disagree with any part of the terms, you may not access
          the service.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          2. Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          Your use of our service is also subject to our Privacy Policy, which
          outlines how we collect, use, and protect your personal information.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          3. User Accounts
        </Typography>
        <Typography variant="body1" paragraph>
          When you create an account with us, you must provide accurate and
          complete information. You are responsible for safeguarding the
          password and for all activities that occur under your account.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          4. Content and Conduct
        </Typography>
        <Typography variant="body1" paragraph>
          You may not use our service for any illegal or unauthorized purpose.
          You must not violate any laws in your jurisdiction.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          5. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          The service and its original content, features, and functionality are
          owned by the company and are protected by international copyright,
          trademark, and other intellectual property laws.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          6. Termination
        </Typography>
        <Typography variant="body1" paragraph>
          We may terminate or suspend your account immediately, without prior
          notice or liability, for any reason, including without limitation if
          you breach the Terms.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          7. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          In no event shall the company be liable for any indirect, incidental,
          special, consequential or punitive damages, including without
          limitation, loss of profits, data, use, goodwill, or other intangible
          losses.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={onChange}
                inputRef={checkboxRef}
              />
            }
            label="I have read and agree to the Terms and Conditions and Privacy Policy"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#A26E6C",
            color: "#A26E6C",
            "&:hover": {
              borderColor: "#96616B",
              backgroundColor: "rgba(162, 110, 108, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAgree}
          disabled={!checked}
          variant="contained"
          sx={{
            backgroundColor: "#A26E6C",
            "&:hover": {
              backgroundColor: "#96616B",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(162, 110, 108, 0.3)",
            },
          }}
        >
          I Agree
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
    fullName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    termsError: false,
    nameError: "",
    emailError: "",
    passwordError: "",
  });

  // Get auth state from Redux
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const termsCheckboxRef = useRef(null);

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

  const handleTermsClick = () => {
    setModalChecked(false);
    setTermsOpen(true);

    setTimeout(() => {
      termsCheckboxRef.current?.focus();
    }, 0);
  };

  const handleTermsClose = () => {
    setTermsOpen(false);
    setModalChecked(false);
    setTermsChecked(false);
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
    if (!formData.fullName.trim()) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Dispatch the register action
      const resultAction = await dispatch(registerUser(formData));

      if (registerUser.fulfilled.match(resultAction)) {
        // Registration successful
        navigate("/signin");
      } else {
        // Registration failed, handle error
        // The error is already handled in the authSlice reducer
      }
    } catch (err) {
      console.error("Registration error:", err);
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

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        name="fullName"
        placeholder="Your fullName"
        variant="outlined"
        fullWidth
        margin="dense"
        value={formData.fullName}
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
            onChange={handleTermsClick}
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
        disabled={loading}
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
        {loading ? (
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
        checkboxRef={termsCheckboxRef}
      />
    </Box>
  );
};
