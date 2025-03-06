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
} from "@mui/icons-material";

// Profile Data Service (simulating backend call)
const ProfileService = {
  getProfileData: async () => {
    return {
      name: "Yatharth Verma",
      role: "Pharmacy Manager",
      email: "alma.lawson@example.com",
      phoneNo: "9892345",
      adminId: "#123456",
      profileImage: null,
    };
  },

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
  const [searchTerm, setSearchTerm] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await ProfileService.getProfileData();
        setProfileData(data);
        setProfileImage(data.profileImage);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
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
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };



  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out");
  };

  if (!profileData) return <Box>Loading...</Box>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // height: "100%",
      }}
    >
      {/* Header */}

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
            {/* {profileData.name.charAt(0)} */}
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
          //   flex: 1,
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
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            p: 2,

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
