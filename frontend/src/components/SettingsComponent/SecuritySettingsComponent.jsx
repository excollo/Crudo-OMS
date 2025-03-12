import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { useSelector } from "react-redux";
import TwoFactorSetupComponent from "../Auth-Component/TwoFactorSetupComponent";

const SecuritySettingsComponent = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        p: 3,
        mb: 3,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "700", mb: 2 }}>
        Security Settings
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        <ListItem disableGutters>
          <ListItemText
            primary={
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  Password
                </Typography>
              </Box>
            }
            secondary={
              <Typography variant="body2" color="textSecondary">
                Change your password regularly to keep your account secure.
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Box
              component="button"
              onClick={() => {
                /* implement password change */
              }}
              sx={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#A26E6C",
                fontWeight: "600",
              }}
            >
              Change
            </Box>
          </ListItemSecondaryAction>
        </ListItem>

        <Divider sx={{ my: 2 }} />

        <ListItem disableGutters sx={{ display: "block" }}>
          <Box sx={{ width: "100%" }}>
            <TwoFactorSetupComponent />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Two-factor authentication adds an extra layer of security to your
              account by requiring a verification code in addition to your
              password when you log in.
            </Typography>
          </Box>
        </ListItem>

        <Divider sx={{ my: 2 }} />

        <ListItem disableGutters>
          <ListItemText
            primary={
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  Active Sessions
                </Typography>
              </Box>
            }
            secondary={
              <Typography variant="body2" color="textSecondary">
                View and manage your active login sessions across different
                devices.
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Box
              component="button"
              onClick={() => {
                /* implement view sessions */
              }}
              sx={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#A26E6C",
                fontWeight: "600",
              }}
            >
              View
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Paper>
  );
};

export default SecuritySettingsComponent;
