import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import {
  EmailOutlined,
  PhoneOutlined,
  AccountCircleOutlined,
  ExitToAppOutlined,
  SearchOutlined,
  CameraAltOutlined,
} from "@mui/icons-material"; // Adjust the import path as needed
import AuthService from "../../../services/AuthServices/AuthServices";

// Profile Data Service (for profile-specific operations)
const ProfileService = {
  uploadProfileImage: async (file) => {
    // Simulate image upload to backend
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, this would be an API call
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Get user data from AuthService instead of separate ProfileService
        const userData = AuthService.getCurrentUser();

        if (!userData) {
          throw new Error("User data not found");
        }

        // Transform user data to match the expected profile format
        const profileData = {
          name: userData.fullName ,
          role: userData.role ,
          email: userData.email ,
          phoneNo: userData.phoneNo,
          adminId: userData._id ,
          profileImage: userData.profileImage || null,
        };

        setProfileData(profileData);
        setProfileImage(profileData.profileImage);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const uploadedImage = await ProfileService.uploadProfileImage(file);
        setProfileImage(uploadedImage);

        // Here you would typically update the user profile on the backend
        // For example: await API.put('/users/profile', { profileImage: uploadedImage });
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      // Redirect to login page or home page after logout
      window.location.href = "/signin"; // Or use React Router navigation
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;
  if (!profileData) return <Box>No profile data available</Box>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          borderBottom: "2px solid #eee",
          borderRadius: "7px",
          background: "#fff",
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 5,
            borderRadius: "7px 7px 0px 0px",
            background:
              "linear-gradient(99.09deg, #FFB8B8 2.64%, #A0616A 100%)",
          }}
        >
          <Avatar
            src={profileImage}
            sx={{
              width: 150,
              height: 150,
              mb: 2,
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                background: "white",
                "&:hover": { background: "#f0f0f0" },
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <CameraAltOutlined />
            </IconButton>
          </Avatar>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{profileData.name}</Typography>
          <Typography variant="subtitle1">{profileData.role}</Typography>
        </Box>
      </Box>

      {/* Profile Details */}
      <List
        sx={{
          overflowY: "auto",
          mt: 2,
          mb: 1,
          background: "#fff",
          borderRadius: 2,
          borderBottom: "2px solid #eee",
        }}
      >
        <ListItem sx={{ borderBottom: "2px solid #eee" }}>
          <ListItemIcon>
            <EmailOutlined />
          </ListItemIcon>
          <ListItemText primary="Email" secondary={profileData.email} />
        </ListItem>
        <ListItem sx={{ borderBottom: "2px solid #eee" }}>
          <ListItemIcon>
            <PhoneOutlined />
          </ListItemIcon>
          <ListItemText primary="Phone No." secondary={profileData.phoneNo} />
        </ListItem>
        <ListItem sx={{ borderBottom: "2px solid #eee" }}>
          <ListItemIcon>
            <AccountCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Admin ID" secondary={profileData.adminId} />
        </ListItem>
        {/* Fixed the ListItem to use component="button" instead of button={true} */}
        <ListItem
          component="div"
          onClick={handleLogout}
          sx={{
            p: 2,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          }}
        >
          <ListItemIcon>
            <ExitToAppOutlined />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItem>
      </List>
    </Box>
  );
};

export default ProfilePage;
