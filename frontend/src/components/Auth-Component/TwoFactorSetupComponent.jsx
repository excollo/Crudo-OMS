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

  const twoFactorEnabled = user?.twoFactorEnabled || false;

  const handleOpenDialog = () => {
    setOpen(true);
    setStep("initial");
    setError("");
    setVerificationCode("");
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleEnable2FA = async () => {
    setError("");
    try {
      const result = await dispatch(enableTwoFactor()).unwrap();
      // setQrCodeData(result.qrCode);
      // setSetupSecret(result.secret);
      setStep("verify");
    } catch (err) {
      setError(err || "Failed to enable 2FA. Please try again.");
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
      setStep("success");
    } catch (err) {
      setError(err || "Invalid verification code. Please try again.");
    }
  };

  const handleDisable2FA = async () => {
    setError("");
    try {
      await dispatch(disableTwoFactor()).unwrap();
      handleCloseDialog();
    } catch (err) {
      setError(err || "Failed to disable 2FA. Please try again.");
    }
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
              checked={twoFactorEnabled}
              onChange={handleOpenDialog}
              disabled={loading}
            />
          }
          label={twoFactorEnabled ? "Enabled" : "Disabled"}
        />
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {twoFactorEnabled
            ? "Disable Two-Factor Authentication"
            : "Enable Two-Factor Authentication"}
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!twoFactorEnabled && step === "initial" && (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" paragraph>
                Two-factor authentication adds an extra layer of security to
                your account by requiring more than just a password to sign in.
              </Typography>
              <Typography variant="body1" paragraph>
                When 2FA is enabled, you'll need to enter a verification code
                sent to your email after entering your password.
              </Typography>
            </Box>
          )}

          {!twoFactorEnabled && step === "verify" && (
            <Box
              sx={{
                py: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" paragraph>
                A verification code has been sent to your email. Please enter
                the 6-digit code below.
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
              />
            </Box>
          )}

          {!twoFactorEnabled && step === "success" && (
            <Box sx={{ py: 2 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Two-factor authentication has been enabled successfully!
              </Alert>
              <Typography variant="body1">
                Your account is now more secure. You will be required to enter a
                verification code when logging in.
              </Typography>
            </Box>
          )}

          {twoFactorEnabled && (
            <Box sx={{ py: 2 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Warning: Disabling two-factor authentication will reduce the
                security of your account.
              </Alert>
              <Typography variant="body1">
                Are you sure you want to disable two-factor authentication?
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>

          {!twoFactorEnabled && step === "initial" && (
            <Button
              onClick={handleEnable2FA}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Enable 2FA"}
            </Button>
          )}

          {!twoFactorEnabled && step === "verify" && (
            <Button
              onClick={handleVerify2FA}
              variant="contained"
              color="primary"
              disabled={loading || !verificationCode}
            >
              {loading ? <CircularProgress size={24} /> : "Verify"}
            </Button>
          )}

          {!twoFactorEnabled && step === "success" && (
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              color="primary"
            >
              Done
            </Button>
          )}

          {twoFactorEnabled && (
            <Button
              onClick={handleDisable2FA}
              variant="contained"
              color="error"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Disable 2FA"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TwoFactorSetupComponent;
