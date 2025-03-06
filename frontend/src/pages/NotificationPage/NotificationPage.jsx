import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";
import Notifications from "../../components/NotificationComponents/Notification";

const NotificationPage = () => {
  return (
    <Box
      sx={{
        width: "88vw",
       
        height: "85vh",
        mt:{xs:"12vh",md:"13vh"},
        ml: { xs: "0vw", sm: "15vw", md: "12vw", lg: "8vw" },

        backgroundColor: "#fff",
      }}
    >
      <CssBaseline />

      <Notifications  />
    </Box>
  );
};

export default NotificationPage;
