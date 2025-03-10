import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme, CssBaseline } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/HomeComponents/Navbars/Sidebar";
import TopNavbar from "../../components/HomeComponents/Navbars/TopNavbar";

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

const HomePage = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [pageTitle, setPageTitle] = useState({
    title: "Dashboard",
    buttonText: "Add Widget",
    buttonText2: "View Reports",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Width of the sidebar
  const sidebarWidth = { xs: 80, sm: 120 };

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

  return (
    <Box
      sx={{
        overflowX: "hidden",
        // display: "flex",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar />

      {/* TopNavbar - Full width, positioned fixed */}
      <TopNavbar
        title={pageTitle.title}
        onSearch={handleSearch}
        buttontext={pageTitle.buttonText}
        buttontext2={pageTitle.buttonText2} // ✅ Passing second button text
      />

      {/* Main content area */}
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: `${sidebarWidth.xs}px`, sm: `${sidebarWidth.sm}px` },
          width: { sm: `calc(100% - ${sidebarWidth.sm}px)` },
          minHeight: "100vh",
          bgcolor: "#F9F9F9",
          overflow: "auto",
          pt: "64px", // To account for fixed navbar height
        }}
      > */}
      {/* Page content */}
      {/* <Box
          sx={{ p: isMobile ? 2 : 3, display: "flex", flexDirection: "column" }}
        >
          {children}
        </Box>
      </Box> */}
    </Box>
  );
};

export default HomePage;
