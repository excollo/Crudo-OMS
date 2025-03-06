// components/FormButtons.js
import React from "react";
import { Button, Divider, Grid, Typography } from "@mui/material";

const FormButtons = () => {
  return (
    <Grid
      item
      xs={12}
      sx={{
        mt: 5,
        mb: 2,
        p: 3,
        borderTop: "2px solid #E6E6E6",
        borderRadius: 2,
        bgcolor: "#fff",

        // width: "75vw",
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
      }}
    >
      <Divider />
      <Button
        variant="contained"
        sx={{
          px: 5,
          py: 2,
          backgroundColor: "#c5aba6",
          color: "white",
          borderRadius: "8px",
          textTransform: "none",
          
            outline: "none",
            border: "none",
            "&:focus": { outline: "none" },
            "&:active": { outline: "none" },
          fontWeight: "500",
          "&:hover": {
            backgroundColor: "#b59c96",
          },
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {" "}
          Cancel
        </Typography>
      </Button>
      <Button
        type="submit"
        variant="contained"
        sx={{
          px: 5,
          py: 1.5,
          background: "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
          color: "#fff",
          borderRadius: "8px",
          textTransform: "none",

          outline: "none",
          border: "none",
          "&:focus": { outline: "none" },
          "&:active": { outline: "none" },
          fontWeight: "500",
          "&:hover": {
            backgroundColor: "#d37979",
          },
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {" "}
          Save
        </Typography>
      </Button>
    </Grid>
  );
};

export default FormButtons;
