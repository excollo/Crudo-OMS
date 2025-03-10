import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { X, Check } from "lucide-react";

const SuccessPopup = ({ open, onClose, onTrack }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          padding: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Download
        <IconButton onClick={onClose}>
          <X size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
          pb: 3,
        }}
      >
        <Box
          sx={{
            bgcolor: "#E6F5F3",
            borderRadius: "50%",
            width: 80,
            height: 80,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Check size={40} color="#10B981" />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Your Order has been Successfully Created
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              py: 1.5,
              color: "#6B7280",
              borderColor: "#E5E7EB",
              textTransform: "none",
              "&:hover": {
                borderColor: "#D1D5DB",
                bgcolor: "#F9FAFB",
              },
            }}
          >
            Back
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={onTrack}
            sx={{
              py: 1.5,
              bgcolor: "#A0616A",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#8D5560",
              },
            }}
          >
            Track
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessPopup;
