// components/PrescriptionUpload.js
import React, { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

const PrescriptionUpload = ({
  uploadedFile,
  uploadProgress,
  handleFileUpload,
  handleRemoveFile,
}) => {
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Grid item xs={12} sx={{ mt: 2 }}>
      <Paper
        elevation={3}
        sx={{
          ml: "13%",
          p: 3,
          width: "80%",
          borderRadius: "1%",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
          boxShadow: "none",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: "700", color: "#72787F", mb: 2 }}
        >
          Upload Prescription
        </Typography>

        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            p: 3,
            textAlign: "center",
            mb: 2,
            backgroundColor: "#fafafa",
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            accept="image/*,.pdf"
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: "#aaa" }} />
          </Box>

          <Typography variant="body1" color="textSecondary" gutterBottom>
            Attach the prescription provided by the customer
          </Typography>

          <Typography variant="body2" color="textSecondary" gutterBottom>
            Or
          </Typography>

          <Typography variant="body1" color="textSecondary" gutterBottom>
            Drag and drop the image here
          </Typography>

          <Button
            variant="outlined"
            onClick={handleBrowseClick}
            sx={{
              mt: 2,
              color: "#a67662",
              borderColor: "#a67662",
              "&:hover": {
                borderColor: "#8a614f",
                backgroundColor: "rgba(166, 118, 98, 0.04)",
              },
            }}
            startIcon={<CloudUploadIcon />}
          >
            Browse
          </Button>
        </Box>

        {uploadedFile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              border: "1px solid #eee",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                mr: 2,
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <img
                src="/api/placeholder/50/50"
                alt="file thumbnail"
                style={{ width: "100%", height: "auto" }}
              />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: "500" }}>
                {uploadedFile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {uploadedFile.size} KB
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 4,
                  backgroundColor: "#eee",
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    backgroundColor: "#a67662",
                    borderRadius: 2,
                  }}
                />
              </Box>
            </Box>

            <IconButton onClick={handleRemoveFile} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default PrescriptionUpload;
