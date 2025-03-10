import React from "react";
import ProfilePage from "../../../components/HomeComponents/Profile/ProfileComponent";
import { Box, Button, CssBaseline, Typography } from "@mui/material";
import SearchComponent from "../../../components/HomeComponents/Navbars/SearchComponent";

const Profile = () => {
  const handleEditProfile = () => {
    // Implement edit profile logic
    console.log("Editing profile");
  };
  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        // height: "100vh",
        fontFamily: '"Inter", sans-serif',
        background: "rgb(247, 248, 250)",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            color: "#64748B",
            fontWeight: 700,
            ml: 10,
          }}
        >
          Profile
        </Typography>

        <Box sx={{ width: "60%", display: "flex", justifyContent: "end" }}>
          <Button
            onClick={handleEditProfile}
            sx={{
              //   display: { xs: isMobile ? "none" : "flex", sm: "flex" },
              borderColor: "#E0E0E0",
              background:
                "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
              color: "#fff",

              fontSize: "0.875rem",
              fontWeight: 700,
              padding: "0.8rem 1rem",
              borderRadius: 2,
              "&:hover": {
                border: "none",
                borderColor:
                  "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
              }}
            >
              Edit Profile
            </Typography>
          </Button>

          <SearchComponent handleSearchChange={handleSearchChange} />
        </Box>
      </Box>
      <Box
        sx={{
          width: "70%",
          m: "auto",
          // height: "100%",

          //   border: "2px solid #eee",
          borderRadius: 2,
          mt: 8,
          
        }}
      >
        <ProfilePage />
      </Box>
    </Box>
  );
};

export default Profile;
