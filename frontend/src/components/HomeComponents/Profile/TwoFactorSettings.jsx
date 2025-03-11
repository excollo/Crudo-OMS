import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disableTwoFactor, enableTwoFactor } from "../../../redux/slices/authSlice";
import { Alert, Box, CircularProgress, Switch, Typography } from "@mui/material";

const TwoFactorSettings = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");

  useEffect(() => {
    // Sync with user's 2FA status from Redux state
    if (user && user.twoFactorMethod && user.twoFactorMethod !== "disabled") {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [user]);

  const handleToggle2FA = async () => {
    setLoading(true);
    setError("");

    try {
      if (isEnabled) {
        // Disable 2FA
        const result = await dispatch(disableTwoFactor()).unwrap();
        console.log(result);
        if (result.success) {
          setIsEnabled(false);
          setShowQRCode(false);
        }
      } else {
        // Enable 2FA - Just update the setting, don't generate or verify OTP yet
        const result = await dispatch(enableTwoFactor()).unwrap();
           console.log(result);
        if (result.success) {
          setIsEnabled(true);
          // If your backend returns QR code data for setup, handle it here
          if (result.qrCode) {
            setQRCodeData(result.qrCode);
            setShowQRCode(true);
          }
        }
      }
    } catch (err) {
      setError(
        err.message || `Failed to ${isEnabled ? "disable" : "enable"} 2FA`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Two-Factor Authentication
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Switch
          checked={isEnabled}
          onChange={handleToggle2FA}
          disabled={loading || authLoading}
        />
        <Typography sx={{ ml: 1 }}>
          {isEnabled ? "Enabled" : "Disabled"}
        </Typography>
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {isEnabled
          ? "Two-factor authentication is enabled. You'll be required to enter a verification code when you log in."
          : "Enable two-factor authentication for additional security. This will add an extra verification step during login."}
      </Typography>

      {/* Show QR code if applicable */}
      {showQRCode && qrCodeData && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Scan this QR code with your authenticator app
          </Typography>
          <img
            src={qrCodeData}
            alt="QR Code for 2FA setup"
            style={{ maxWidth: "200px" }}
          />
        </Box>
      )}
    </Box>
  );
};
export default TwoFactorSettings