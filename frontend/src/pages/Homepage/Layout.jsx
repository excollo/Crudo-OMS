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
// Add these constants for consistent spacing
const NAVBAR_HEIGHT = "7%";
const SIDEBAR_WIDTH = "7%";
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
const Layout = () => {
  const location = useLocation();
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
        height: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* {!isAuthRoute && <Sidebar />} */}
      <Box>
        <Sidebar />
      </Box>
      <Box
        sx={{
          marginLeft: !isAuthRoute ? SIDEBAR_WIDTH : 0,
          minHeight: "100vh",
          // display: "flex",
          height:"100%",
    
        }}
      >
        {/* TopNavbar - fixed position */}
        <Box
          sx={{
            height: NAVBAR_HEIGHT,
            // position: "fixed",
            top: 0,
            right: 0,
            left: !isAuthRoute ? SIDEBAR_WIDTH : 0,
            // zIndex: 900,
          }}
        >
          <TopNavbar
            title={pageTitle.title}
            onSearch={handleSearch}
            buttontext={pageTitle.buttonText}
            buttontext2={pageTitle.buttonText2}
          />
        </Box>
        {/* Outlet content area */}
        <Box
          sx={{
            flexGrow: 1,
            marginTop: NAVBAR_HEIGHT,
            padding: 3,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
export default Layout;
