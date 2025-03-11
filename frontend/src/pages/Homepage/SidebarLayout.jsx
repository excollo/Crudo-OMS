import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import TopNavbar from "../../components/HomeComponents/Navbars/TopNavbar";
import Sidebar from "../../components/HomeComponents/Navbars/Sidebar";
import ProfilePage from "../../components/HomeComponents/Profile/ProfileComponent";
// Routes that don't display the sidebar
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Updated pageTitles with buttonText2
const pageTitles = {
  "/dashboard": {
    title: "Dashboard",
    buttonText: "Add Widget",
    buttonText2: "View Reports",
  },
  "/analytics": {
    title: "Analytics",
    buttonText: "Export Data",
    buttonText2: "Generate PDF",
  },
  "/prescriptions": {
    title: "Prescription Management",
    buttonText: "Add Prescription",
    buttonText2: "Upload File",
  },
  "/create-order": {
    title: "Create Order",
    buttonText: "Create Customer",
    buttonText2: "Track Orders",
  },
  "/track-order": {
    title: "Track Order",
    buttonText: "Refresh",
    buttonText2: "create Order",
  },
  "/notifications": {
    title: "Notifications",
    buttonText: "",
    buttonText2: "create Order",
  },
  "/audit": {
    title: "Audit Log",
    buttonText: "Download Logs",
    buttonText2: "View Changes",
  },
  "/create-customer": {
    title: "Create Customer",
    buttonText: "",
    buttonText2: "Track orders",
  },
  "/customers": {
    title: "Customers",
    buttonText: "Add Customer",
    buttonText2: "Import Data",
  },
  "/settings": {
    title: "Settings",
    buttonText: "Save Changes",
    buttonText2: "Reset Defaults",
  },
};

const SidebarLayout = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [pageTitle, setPageTitle] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    const currentPage = pageTitles[path] || {
      title: "Dashboard",
      buttonText: "Add Widget",
      buttonText2: "View Reports",
    };
    setPageTitle(currentPage);
    document.title = `${currentPage.title} | CRUDO`;
  }, [location]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",

        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        backgroundColor: "#F9F9F9",
      }}
    >
      {!isAuthRoute && <Sidebar />}
      <Box sx={{ml:10, width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default SidebarLayout;
