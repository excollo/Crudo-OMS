import React, { useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { RightSection } from "./LoginComponent";


// Logo component
const Logo = () => (
  <Typography
    variant="h6"
    sx={{
      fontWeight: "bold",
      color: "#8B0000",
      position: "absolute",
      top: 20,
      left: 20,
    }}
  >
    CRUDO.
  </Typography>
);

// Terms and Conditions Modal
const TermsModal = ({ open, handleClose, handleAgree, checked, onChange }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 1, p: 1 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="medium">
          Terms and Conditions
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" paragraph>
          Terms and conditions outline what users can and cannot do with your
          website, products, and services. They lay out the rules to protect you
          in case of misuse and enable you to take action if it becomes
          necessary.
        </Typography>
        <Typography variant="body2" paragraph>
          It's also referred to by other names such as terms of service (ToS)
          and terms of use (ToU). Even though they have different names, in fact
          – there is no difference.
        </Typography>
        <Typography variant="body2" paragraph>
          In order to use your website, products, or services, your customers
          usually must agree to abide by your terms and conditions first.
        </Typography>

        <FormControlLabel
          control={
            <Checkbox checked={checked} onChange={onChange} size="small" />
          }
          label={
            <Typography variant="body2">
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

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [modalChecked, setModalChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({ termsError: false });

  let navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTermsClick = () => {
    setModalChecked(false); // Reset modal checkbox
    setTermsOpen(true);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!termsChecked) {
      setFormErrors({ ...formErrors, termsError: true });
      return;
    }

    console.log("Register form submitted:", formData);
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

      <Typography variant="body" sx={{ mb: 3, color: "text.secondary" }}>
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
        sx={{ mb: 2 }}
      />

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

      <TextField
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Your password"
        variant="outlined"
        fullWidth
        margin="dense"
        value={formData.password}
        onChange={handleChange}
        sx={{ mb: 3 }}
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
            <Typography variant="body" component="span">
              I agree with
            </Typography>
            <Button
              variant="body"
              onClick={handleTermsClick}
              sx={{
                fontWeight:"700",
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
            <Typography variant="body" component="span">
              and
            </Typography>

            <Typography variant="body" component="span">
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
        <Typography variant="h6">Sign up</Typography>
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Typography variant="body" sx={{ color: "#72787F", mr: 1 }}>
          Already have an account?
        </Typography>
        <Button
          onClick={() => navigate("/login")}
          variant="text"
          sx={{
            outline: "none",
            border: "none",
            "&:focus": { outline: "none" },
            "&:active": { outline: "none" },
            fontWeight: "700",
            color: "#081F5C",
            textDecoration: "none",
            p: 0,
          }}
        >
          Log in
        </Button>
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

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#B27777",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Main App component
const SignUpPageComponent = () => {
  const [currentPage, setCurrentPage] = useState("login"); // 'login' or 'register'

  return (
    <ThemeProvider theme={theme}>
          <Box sx={{width:"100%"}}>
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

export default SignUpPageComponent;
