// components/OrderSummary.js
import React from "react";
import { Box, Typography, TextField, Card, CardContent } from "@mui/material";

const OrderSummary = ({ formData, handleChange, calculateMRPTotal }) => {
  return (
    <Card elevation={3} sx={{ width: "70%", p: 1, borderRadius: "3%" }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
          Order Summary
        </Typography>

        <Box mb={2}>
          <Typography variant="body1" gutterBottom>
            <strong>Customer Name:</strong> {formData.fullName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Phone Number:</strong> {formData.phoneNumber}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {formData.email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Address:</strong> {formData.address}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>MRP Total:</strong> ${calculateMRPTotal()}
          </Typography>
        </Box>

        <Typography variant="body1" gutterBottom>
          <strong>Additional Note (Optional)</strong>
        </Typography>
        <TextField
          name="additionalNote"
          placeholder="Add notes here..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={formData.additionalNote}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#eee",
              },
              "&:hover fieldset": {
                borderColor: "#ccc",
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
