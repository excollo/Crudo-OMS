import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Link,
} from "@mui/material";
import {
  Home,
  BarChart2,
  FileText,
  ShoppingCart,
  ClipboardList,
  Settings,
  User,
} from "lucide-react";
import { Logo } from "../../Logo-component/Logo";

const Sidebar = () => {
  // State to track the currently selected menu item based on the current URL path
  const [selected, setSelected] = useState(window.location.pathname);

  // Define the list of menu items with their icons, labels, and paths
  const menuItems = [
    { icon: <Home size={24} />, label: "Dashboard", path: "/dashboard" },
    { icon: <BarChart2 size={24} />, label: "Analytics", path: "/analytics" },
    {
      icon: <FileText size={24} />,
      label: "Prescription Management",
      path: "/prescriptions",
    },
    {
      icon: <ShoppingCart size={24} />,
      label: "Order Management",
      path: "/create-order",
    },
    { icon: <ClipboardList size={24} />, label: "Audit Log", path: "/audit" },
    { icon: <Settings size={24} />, label: "Settings", path: "/settings" },
  ];

  return (
    <Box
      sx={{
        // Sidebar styling: responsive width, full height, fixed position
        width: { xs: "10%", sm: "10%", lg: "7.5%" },
        height: "100vh",
        maxHeight: "900px",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",

        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          margin: "10% 0",
          display: "flex",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Logo />
      </Box>

      {/* Menu List */}
      <List
        sx={{
          my: "50%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 2,
          px: 2,
        }}
      >
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component="a"
              href={item.path} // Link to the menu item's path
              onClick={() => setSelected(item.path)} // Update selected state on click
              sx={{
                // Styling for the button, including hover and active states
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "0.75rem 0.5rem",
                borderRadius: 1,
                transition: "all 0.2s ease-in-out",
                bgcolor:
                  selected === item.path ? "action.hover" : "transparent", // Highlight if selected
                color: selected === item.path ? "#926B6B" : "text.secondary",
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "#926B6B",
                },
              }}
            >
              {/* Icon Section */}
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  color: selected === item.path ? "#926B6B" : "text.secondary",
                  "&:hover": { color: "#926B6B" },
                  marginBottom: 0.5,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {/* Label Section */}
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  whiteSpace: "normal",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Divider to separate menu and footer */}
      <Divider />

      {/* Footer Section with User Avatar */}
      <Link
        component="a"
        href="/profile"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 2,
          mt: "auto",
        }}
      >
        <Avatar
          component="a"
          href="/profile"
          sx={{ bgcolor: "grey.300", cursor: "pointer" }}
        >
          <User size={24} />
        </Avatar>
      </Link>
    </Box>
  );
};

export default Sidebar;
