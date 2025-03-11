import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import { getAuthToken, isValidToken, removeAuthToken } from "../../utils/AuthUtils";


const ProtectedRoute = () => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const token = getAuthToken();
      const tokenIsValid = isValidToken(token);

      if (!tokenIsValid) {
        removeAuthToken();
      }

      setIsValid(tokenIsValid);
      setIsChecking(false);
    };

    validateAuth();
  }, []);

  if (isChecking) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isValid) {
    // Save the attempted URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
