import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  InputBase,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { RightSection } from "../../components/Auth-Component/LoginComponent";
import { Logo } from "../../components/Logo-component/Logo";

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Parse email from URL or location state
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    } else if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        // Changed to 5 for 6 digits
        inputRefs[index + 1].current.focus();
      }
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP verification
const handleVerify = async (e) => {
  e.preventDefault();
  const otpValue = otp.join("");

  if (otpValue.length !== 6) {
    // Changed to 6
    setError("Please enter a valid 6-digit code");
    return;
  }

  setIsSubmitting(true);

  try {
    const result = await dispatch(
      verifyTwoFactor({
        email,
        otp: otpValue,
        tempToken: location.state?.tempToken,
      })
    ).unwrap();

    if (result.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard", { replace: true });
    }
  } catch (err) {
    setError(err.message || "Invalid verification code");
  } finally {
    setIsSubmitting(false);
  }
};
 // Add resend OTP functionality
 const handleResend = async () => {
   setLoading(true);
   try {
     await dispatch(requestPasswordReset(email));
     setOtp(["", "", "", ""]);
     inputRefs[0].current.focus();
   } catch (err) {
     setError("Failed to resend code. Please try again.");
   } finally {
     setLoading(false);
   }
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
            justifyContent: "center",
            alignItems: "center",
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
              Verify OTP
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

            {error && (
              <Typography
                variant="body1"
                color="error"
                sx={{ fontWeight: "600", mb: 2 }}
              >
                {error}
              </Typography>
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
              onClick={() => navigate("/login")}
              sx={{ fontWeight: "600", color: "#666", textTransform: "none" }}
            >
              <Typography variant="body1">Go back</Typography>
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
