import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  enableTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
} from "../../redux/slices/authSlice";

const TwoFactorSetupComponent = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("initial"); // initial, verify, success
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [setupSecret, setSetupSecret] = useState("");

  // Check if 2FA is enabled based on twoFactorMethod field
  const isTwoFactorEnabled = (user) => {
    return user.twoFactorMethod !== "disabled";
  };

  // Local state to track 2FA status (for UI updates before API confirmation)
  const [localTwoFactorEnabled, setLocalTwoFactorEnabled] = useState(
    isTwoFactorEnabled(user)
  );
// console.log(localTwoFactorEnabled)
// console.log(user)
  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      const twoFAStatus = isTwoFactorEnabled(user);
      // console.log("User updated, 2FA status:", twoFAStatus);
      setLocalTwoFactorEnabled(twoFAStatus);
    }
  }, [user]);

  const handleOpenDialog = () => {
    setOpen(true);
    setStep("initial");
    setError("");
    setVerificationCode("");
  };

  const handleCloseDialog = () => {
    setOpen(false);
    // Reset state when closing dialog
    setError("");
    setVerificationCode("");
    setStep("initial");
  };

  const handleEnable2FA = async () => {
    setError("");
    try {
      const result = await dispatch(enableTwoFactor()).unwrap();
      // Make sure these are actually set based on your API response
      if (result?.qrCode) setQrCodeData(result.qrCode);
      if (result?.secret) setSetupSecret(result.secret);
      setStep("verify");
    } catch (err) {
      const errorMessage =
        err?.message ||
        (typeof err === "string"
          ? err
          : "Failed to enable 2FA. Please try again.");
      setError(errorMessage);
      console.error("Enable 2FA error:", err);
    }
  };

  const handleVerify2FA = async () => {
    setError("");
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    try {
      await dispatch(
        verifyTwoFactorSetup({
          token: verificationCode,
          secret: setupSecret,
        })
      ).unwrap();

      // Successfully verified, so update local state
      setLocalTwoFactorEnabled(true);
      setStep("success");
    } catch (err) {
      const errorMessage =
        err?.message ||
        (typeof err === "string"
          ? err
          : "Invalid verification code. Please try again.");
      setError(errorMessage);
      console.error("2FA verification error:", err);
    }
  };

  const handleDisable2FA = async () => {
    setError("");
     try {
       await dispatch(disableTwoFactor()).unwrap();
       // Immediately update local state
       setLocalTwoFactorEnabled(false);
       handleCloseDialog();
     } catch (err) {
       const errorMessage =
         err?.message ||
         (typeof err === "string"
           ? err
           : "Failed to disable 2FA. Please try again.");
       setError(errorMessage);
       console.error("Disable 2FA error:", err);
     }
  };

  // Toggle handler for the switch
  const handleToggleChange = () => {
    // Always open dialog, the action depends on current state
    handleOpenDialog();
  };

  // Render content based on state instead of conditional rendering inside Dialog
  const renderDialogContent = () => {
    if (localTwoFactorEnabled) {
      return (
        <Box sx={{ py: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Warning: Disabling two-factor authentication will reduce the
            security of your account.
          </Alert>
          <Typography variant="body1">
            Are you sure you want to disable two-factor authentication?
          </Typography>
        </Box>
      );
    }

    if (step === "initial") {
      return (
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" paragraph>
            Two-factor authentication adds an extra layer of security to your
            account by requiring more than just a password to sign in.
          </Typography>
          <Typography variant="body1" paragraph>
            When 2FA is enabled, you'll need to enter a verification code sent
            to your email after entering your password.
          </Typography>
        </Box>
      );
    }

    if (step === "verify") {
      return (
        <Box
          sx={{
            py: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" paragraph>
            A verification code has been sent to your email. Please enter the
            6-digit code below.
          </Typography>

          {qrCodeData && (
            <Box sx={{ my: 2 }}>
              <img
                src={qrCodeData}
                alt="QR Code for 2FA"
                style={{ maxWidth: "100%" }}
              />
            </Box>
          )}

          <TextField
            label="Verification Code"
            variant="outlined"
            fullWidth
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            inputProps={{ maxLength: 6 }}
            sx={{ mt: 2 }}
            autoFocus
          />
        </Box>
      );
    }

    if (step === "success") {
      return (
        <Box sx={{ py: 2 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Two-factor authentication has been enabled successfully!
          </Alert>
          <Typography variant="body1">
            Your account is now more secure. You will be required to enter a
            verification code when logging in.
          </Typography>
        </Box>
      );
    }

    return null;
  };

  // Render actions based on state
  const renderDialogActions = () => {
    if (localTwoFactorEnabled) {
      return (
        <>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDisable2FA}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Disable 2FA"}
          </Button>
        </>
      );
    }

    if (step === "initial") {
      return (
        <>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleEnable2FA}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Enable 2FA"}
          </Button>
        </>
      );
    }

    if (step === "verify") {
      return (
        <>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleVerify2FA}
            variant="contained"
            color="primary"
            disabled={loading || !verificationCode}
          >
            {loading ? <CircularProgress size={24} /> : "Verify"}
          </Button>
        </>
      );
    }

    if (step === "success") {
      return (
        <Button onClick={handleCloseDialog} variant="contained" color="primary">
          Done
        </Button>
      );
    }

    return null;
  };

  // Get the dialog title based on current state
  const getDialogTitle = () => {
    if (localTwoFactorEnabled) {
      return "Disable Two-Factor Authentication";
    }

    if (step === "success") {
      return "Two-Factor Authentication Enabled";
    }

    return "Enable Two-Factor Authentication";
  };

  // Display the current 2FA method if enabled
  const getTwoFactorMethodLabel = () => {
    if (!localTwoFactorEnabled) {
      return "Disabled";
    }

    const method = user?.twoFactorMethod || "";
    // Convert method name to proper case (e.g., "email" to "Email")
    return method === "disabled"
      ? "Enabled"
      : `Enabled `;
      // (${method.charAt(0).toUpperCase() + method.slice(1)})
  };

  return (
    <>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Two-Factor Authentication</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={localTwoFactorEnabled}
              onChange={handleToggleChange}
              disabled={loading}
            />
          }
          label={getTwoFactorMethodLabel()}
        />
      </Box>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="2fa-dialog-title"
        disablePortal={false}
        container={document.body}
      >
        <DialogTitle id="2fa-dialog-title">{getDialogTitle()}</DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {renderDialogContent()}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          {renderDialogActions()}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TwoFactorSetupComponent;
