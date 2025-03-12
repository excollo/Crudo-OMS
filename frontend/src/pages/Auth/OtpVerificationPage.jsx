import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Button,
  Typography,
  Grid,
  CircularProgress,
  InputBase,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyTwoFactor,
  clearTwoFactorState,
} from "../../redux/slices/authSlice";
import { RightSection } from "../../components/Auth-Component/LoginComponent";
import { Logo } from "../../components/Logo-component/Logo";

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error, tempEmail, tempToken } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Updated to 6 digits
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [token, setToken] = useState(""); // Added state for token
  // Create refs for each input
  const inputRefs = Array(6)
    .fill()
    .map(() => useRef(null));

  // Parse email from URL, location state, or Redux state
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    } else if (location.state?.email) {
      setEmail(location.state.email);
    } else if (tempEmail) {
      setEmail(tempEmail);
    } else {
      // No email found, redirect to login
      navigate("/signin", { replace: true });
    }

    // Set token from location state or Redux state
    const tokenFromState = location.state?.tempToken || tempToken;
    if (tokenFromState) {
      setToken(tokenFromState);
    } else {
      console.error("No token found in location state or Redux state");
    }
  }, [location, tempEmail,tempToken, navigate]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // If a digit is entered and there's a next input, focus it
      if (value !== "" && index < otp.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs[index - 1].current.focus();
      } else if (otp[index] !== "") {
        // If current input has a value, clear it but don't move focus
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle OTP verification
 const handleVerify = async (e) => {
   e.preventDefault();
   const otpValue = otp.join("");

   if (otpValue.length !== 6) {
     setLocalError("Please enter a valid 6-digit code");
     return;
   }

   setIsSubmitting(true);
   setLocalError("");

   try {
     // Get tempToken from Redux state or location state
     const currentTempToken = tempToken || location.state?.tempToken;

     if (!currentTempToken) {
       console.warn("No temp token found, proceeding with verification anyway");
     }

     console.log("Using tempToken:", currentTempToken);
     console.log("Using OTP:", otpValue);

     const result = await dispatch(
       verifyTwoFactor({
         email,
         otp: otpValue,
         tempToken: currentTempToken,
       })
     ).unwrap();

     console.log("Verification result:", result);

     // Success, redirect to dashboard
     navigate("/dashboard", { replace: true });
   } catch (err) {
     console.error("Verification error:", err);
     setLocalError(typeof err === "string" ? err : "Invalid verification code");
   } finally {
     setIsSubmitting(false);
   }
 };

  // Handle resend OTP
  const handleResend = async () => {
    // Implement resend logic here
    // For now, just reset the OTP fields
    setOtp(Array(6).fill(""));
    inputRefs[0].current.focus();
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundColor: "#fff",
        color: "#26282B",
        height: "100vh",
        width: "100vw",
        display: "flex",
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
            flexDirection: "column",
            p: 2,
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Logo />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: 400,
              mx: "auto",
              width: "100%",
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: "700", mb: 2, textAlign: "center" }}
            >
              Two-Factor Authentication
            </Typography>

            <Typography
              variant="body1"
              sx={{ fontWeight: "600", mb: 3, textAlign: "center" }}
            >
              Enter Verification Code
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontWeight: "600",
                mb: 4,
                color: "#A26E6C",
                textAlign: "center",
              }}
            >
              {email}
            </Typography>

            {/* OTP Input Fields */}
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}
            >
              {otp.map((digit, index) => (
                <InputBase
                  key={index}
                  inputRef={inputRefs[index]}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "24px",
                      padding: "10px",
                      width: "40px",
                      height: "40px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    },
                  }}
                />
              ))}
            </Box>

            {(localError || error) && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {localError || error}
              </Alert>
            )}

            <Typography
              variant="body1"
              sx={{
                fontWeight: "600",
                mb: 3,
                display: "flex",
                alignItems: "center",
              }}
            >
              Didn't receive code?{" "}
              <Button
                variant="text"
                onClick={handleResend}
                disabled={loading || isSubmitting}
                sx={{
                  fontWeight: "600",
                  ml: 1,
                  color: "#A26E6C",
                  textTransform: "none",
                }}
              >
                <Typography variant="body1">Resend</Typography>
              </Button>
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={isSubmitting || otp.some((digit) => digit === "")}
              sx={{
                fontWeight: "700",
                py: 1.5,
                backgroundColor: "#A26E6C",
                "&:hover": {
                  backgroundColor: "#96616B",
                },
                mb: 2,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Typography variant="h6">Verify</Typography>
              )}
            </Button>

            <Button
              variant="text"
              onClick={() => {
                dispatch(clearTwoFactorState());
                navigate("/login");
              }}
              sx={{ fontWeight: "600", color: "#666", textTransform: "none" }}
            >
              <Typography variant="body1">Back to Login</Typography>
            </Button>
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

export default OTPVerificationPage;
