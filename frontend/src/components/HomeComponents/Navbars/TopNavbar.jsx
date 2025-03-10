import React, { useState } from "react";
import {
  Box,
  Typography,

  IconButton,
  Badge,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import SearchComponent from "./SearchComponent";



const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
//  width:"20%",
  fontWeight: "600",
  fontFamily: '"Inter", sans-serif',
  padding: "6px 12px",
}));

const TopNavbar = ({ title, onSearch, buttontext, buttontext2 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New order has been placed",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      text: "Customer update completed",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      text: "Prescription uploaded successfully",
      time: "3 hours ago",
      read: true,
    },
  ]);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

 const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  

  const toggleNotificationDrawer = () => {
    setNotificationDrawerOpen(!notificationDrawerOpen);
    if (!notificationDrawerOpen) {
      // Mark all notifications as read when opening drawer
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Inter', sans-serif",
          p: "3% 0",
          borderBottom: "5px solid",
          borderColor: "rgba(0, 0, 0, 0.06)",
          backgroundColor: "#FFFFFF",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "64px", // Fixed navbar height
          zIndex: 900,
        //   ml: 10,
        }}
      >
        {/* Left side - Logo or Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              color: "#64748B",
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              ml:15
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Right side - Search, Buttons, Notifications */}
        <Box
          sx={{
            display: "flex",
            mr:3,
            // justifySelf:"flex-end",
            width: "60%",
            justifyContent: "end",
            alignItems: "center",
            gap: { xs: 1, sm: 1,lg:3 },
          }}
        >
            <SearchComponent handleSearchChange={handleSearchChange}/>

          {/* Track Orders Button */}
          <StyledButton
            variant="outlined"
            sx={{
              display: { xs: isMobile ? "none" : "flex", sm: "flex" },
              borderColor: "#E0E0E0",
              background:
                "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
              color: "#fff",
              fontSize: "0.875rem",
              backgroundColor: "#f5f5f5",
              "&:hover": {
                border: "none",
                borderColor:
                  "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
              },
            }}
          >
            {buttontext2}
          </StyledButton>

          {/* Create Customer Button */}
          <Link
            to="/create-customer"
            sx={{
              display: { xs: isMobile ? "none" : "flex", sm: "flex" },
            }}
          >
            <Typography
              sx={{
                color: "#64748B",
                textDecoration: "none",
                fontFamily: '"Inter", sans-serif',
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
            >
              {buttontext}
            </Typography>
          </Link>

          {/* Notifications Icon */}
          <IconButton
          href="/notifications"
            aria-label="notifications"
            onClick={toggleNotificationDrawer}
            sx={{ color: "#424242" }}
          >
            <Badge badgeContent={unreadNotifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 320 },
            px: 2,
            py: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: '"Inter", sans-serif' }}>
            Notifications
          </Typography>
          <IconButton onClick={() => setNotificationDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        <List>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  backgroundColor: notification.read
                    ? "transparent"
                    : alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                }}
              >
                <ListItemText
                  primary={notification.text}
                  secondary={notification.time}
                  primaryTypographyProps={{
                    fontWeight: notification.read ? 400 : 500,
                    fontFamily: '"Inter", sans-serif',
                  }}
                  secondaryTypographyProps={{
                    fontFamily: '"Inter", sans-serif',
                  }}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default TopNavbar;
