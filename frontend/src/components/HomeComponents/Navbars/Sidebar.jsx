
import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Home,
  BarChart2,
  FileText,
  ShoppingCart,
  ClipboardList,
  Settings,
  User,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import { Logo } from "../../Logo-component/Logo";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(window.location.pathname);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // Get theme to use breakpoints
  const theme = useTheme();
  // Media queries for responsive design
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdScreen = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLgScreen = useMediaQuery(theme.breakpoints.up("lg"));
  // Calculate icon size based on screen size
  const [iconSize, setIconSize] = useState(24);
  // Update icon size based on screen dimensions and aspect ratio
  useEffect(() => {
    const updateIconSize = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      if (isXsScreen) {
        // Smaller screens get smaller icons
        setIconSize(Math.min(20, Math.floor(20 * aspectRatio)));
      } else if (isMdScreen) {
        // Medium screens
        setIconSize(Math.min(24, Math.floor(24 * aspectRatio)));
      } else if (isLgScreen) {
        // Larger screens can have bigger icons
        setIconSize(Math.min(28, Math.floor(26 * aspectRatio)));
      } else {
        // Default size
        setIconSize(24);
      }
    };
    // Initial calculation
    updateIconSize();
    // Add event listener for window resize
    window.addEventListener("resize", updateIconSize);
    // Cleanup
    return () => window.removeEventListener("resize", updateIconSize);
  }, [isXsScreen, isMdScreen, isLgScreen]);
  // Define the list of menu items with their icons, labels, and paths
  const menuItems = [
    { icon: <Home size={iconSize} />, label: "Dashboard", path: "/dashboard" },
    {
      icon: <BarChart2 size={iconSize} />,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: <FileText size={iconSize} />,
      label: "Prescription Management",
      path: "/prescriptions",
    },
    {
      icon: <ShoppingCart size={iconSize} />,
      label: "Order Management",
      path: "/create-order",
    },
    {
      icon: <ClipboardList size={iconSize} />,
      label: "Audit Log",
      path: "/audit",
    },
    {
      icon: <Settings size={iconSize} />,
      label: "Settings",
      path: "/settings",
    },
  ];
  const MobileMenuToggle = () => (
    <IconButton
      onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      sx={{
        position: "fixed",
        top: isMobileSidebarOpen ? -5 : 10,
        left: isMobileSidebarOpen ? 60 : 10,
        height: 10,
        zIndex: isMobileSidebarOpen ? 1001 : 999,
        display: { xs: "block", sm: "none" },
        bgcolor: "background.paper",
        // boxShadow: 2,
      }}
    >
      {isMobileSidebarOpen ? <CloseIcon /> : <MenuIcon />}
    </IconButton>
  );
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <MobileMenuToggle />
      {/* Sidebar Container */}
      <Box
        sx={{
          // Sidebar styling: responsive width, full height, fixed position
          width: { xs: 100, sm: 100 }, // Wider on mobile
          height: "100%",
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
          left: {
            xs: isMobileSidebarOpen ? 0 : "-250px", // Hide/Show on mobile
            sm: 0, // Always visible on larger screens
          },
          zIndex: 1000,
          overflowX: "scroll",
          transition: "left 0.3s ease-in-out", // Smooth transition
          boxShadow: {
            xs: isMobileSidebarOpen ? 3 : "none", // Add shadow when open on mobile
          },
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
            mt: "50%",
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
                href={item.path}
                onClick={() => {
                  setSelected(item.path);
                  // Close mobile sidebar when an item is selected
                  if (window.innerWidth < 600) {
                    setIsMobileSidebarOpen(false);
                  }
                }}
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0.75rem 0.5rem",
                  borderRadius: 1,
                  transition: "all 0.2s ease-in-out",
                  bgcolor:
                    selected === item.path ? "action.hover" : "transparent",
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
                    color:
                      selected === item.path ? "#926B6B" : "text.secondary",
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
            mt: "auto",
          }}
        >
          <Avatar
            onClick={() => navigate("/profile")}
            sx={{ bgcolor: "grey.300", cursor: "pointer" }}
          >
            <User size={24} />
          </Avatar>
        </Box>
      </Box>
    </>
  );
};
export default Sidebar;
