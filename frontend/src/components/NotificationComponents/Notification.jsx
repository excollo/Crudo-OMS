import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Stack,
  CssBaseline,
} from "@mui/material";
import { MoreVertical, Check, Bell } from "lucide-react";

// Mock data service (replace with actual API call)
const NotificationService = {
  async getNotifications() {
    // Simulating API call
    return [
      {
        id: 1,
        type: "customer-support",
        avatar: "/path/to/avatar.jpg", // Replace with actual avatar
        name: "Megan-Customer support",
        message: "The order has been double checked. Indeed is arriving today",
        time: "4h",
        isRead: false,
      },
      {
        id: 2,
        type: "order-update",
        message:
          "Your order #1982345 is on it's way. Expected delivery 1-2 days.",
        time: "4d",
        isRead: false,
      },
      // Duplicate notifications to show scrolling
      {
        id: 3,
        type: "order-update",
        message: "Your order #1982346 is being processed.",
        time: "2d",
        isRead: false,
      },
      {
        id: 4,
        type: "order-update",
        message: "Your order #1982347 has been shipped.",
        time: "1d",
        isRead: false,
      },
    ];
  },

  markAllAsRead(notifications) {
    return notifications.map((note) => ({ ...note, isRead: true }));
  },
};

const NotificationMenu = ({ anchorEl, onClose }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={onClose}>Mark as Read</MenuItem>
      <MenuItem onClick={onClose}>Delete</MenuItem>
    </Menu>
  );
};

const Notifications = ({ fullPage = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const fetchedNotifications = await NotificationService.getNotifications();
      setNotifications(fetchedNotifications);
    };
    fetchNotifications();
  }, []);

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications =
      NotificationService.markAllAsRead(notifications);
    setNotifications(updatedNotifications);
  };

  const renderNotificationIcon = (type) => {
    const iconMap = {
      "customer-support": (
        <Avatar sx={{ bgcolor: "#A0616A" }}>
          <Bell />
        </Avatar>
      ),
      "order-update": <Bell color="#A0616A" />,
    };
    return iconMap[type] || <Bell />;
  };

  return (
    <Box
      sx={{
        width: "100%",
       
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Notifications
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mr: 2, cursor: "pointer" }}
            onClick={handleMarkAllAsRead}
          >
            <Check size={16} style={{ marginRight: 4 }} />
            Mark all as read
          </Typography>
        </Box>
      </Stack>

      <List
        sx={{
          overflowY: "auto",
          maxHeight: fullPage ? "calc(100vh - 200px)" : "400px",
        }}
      >
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={(e) => handleMenuOpen(e, notification)}
                >
                  <MoreVertical />
                </IconButton>
              }
              sx={{
                bgcolor: !notification.isRead ? "#FFF5F5" : "transparent",
                "&:hover": {
                  bgcolor: !notification.isRead ? "#FFF0F0" : "#F9FAFB",
                },
              }}
            >
              <ListItemAvatar>
                {notification.avatar ? (
                  <Avatar src={notification.avatar} />
                ) : (
                  renderNotificationIcon(notification.type)
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    fontWeight={!notification.isRead ? 600 : 400}
                  >
                    {notification.name || "Order update"}
                  </Typography>
                }
                secondary={
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: "80%" }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
            {index < notifications.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>

      <NotificationMenu anchorEl={anchorEl} onClose={handleMenuClose} />
    </Box>
  );
};

export default Notifications;
