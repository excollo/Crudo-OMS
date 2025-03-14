import axios from "axios";

// Create axios instance with default config
const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 403 and we haven't tried refreshing yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/auth/refresh-token", {
          token: refreshToken,
        });

        const { newAccessToken, newRefreshToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Notify the app to redirect (will be handled by Redux)
        window.dispatchEvent(new CustomEvent("auth:sessionExpired"));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth service functions
const AuthService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await API.post("/auth/signup", userData);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login user
  // Update the login function in AuthService.js
  // Login user
  login: async (credentials) => {
    try {
      const response = await API.post("/auth/signin", credentials);
      const { data } = response.data;

      if (data?.authType === "2fa") {
        // Return 2FA required response with the temporary token
        console.log("2FA required, tempToken:", data.tempToken);

        return {
          requiresTwoFactor: true,
          email: credentials.email,
          userId: data.userId,
          tempToken: data.tempToken,
        };
      }

      // Regular login success
      const { user, tokens } = data;
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      return {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        success: true,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data?.message || "Login failed";
    }
  },
  // Verify 2FA token

  verifyTwoFactor: async (email, otp, tempToken) => {
    try {
      console.log("AuthService.verifyTwoFactor called with:", {
        email,
        otp,
        tempToken,
      });

      const response = await API.post("/auth/verify-2fa", {
        email,
        token: otp, // Send the OTP as "token" to the API
        tempToken, // Include the temporary token
      });

      console.log("Verification API response:", response.data);

      const { user, accessToken, refreshToken } = response.data;

      // Store tokens and user data
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error("Error in verifyTwoFactor:", error);
      console.error("Error response:", error.response?.data);
      throw error.response?.data?.message || "Verification failed";
    }
  },
  // Enable 2FA
  enableTwoFactor: async () => {
    try {
      const response = await API.post("/auth/enable-2fa");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify 2FA setup
  verifyTwoFactorSetup: async (email, token) => {
    try {
      const response = await API.post("/auth/verify-2fa-setup", {
        email,
        token,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Disable 2FA
  disableTwoFactor: async () => {
    try {
      const response = await API.post("/auth/disable-2fa");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await API.post("/auth/request-password-reset", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    console.log("Sending reset request with token:", token);

    try {
      const response = await API.post("/auth/reset-password", {
        token,
        newPassword,
      });
      console.log(token);
      console.log(newPassword);
      return response.data;
    } catch (error) {
      console.error("Reset password API error:", error);

      // Better error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Password reset failed";

        throw {
          status: error.response.status,
          message: errorMessage,
          details: error.response.data,
        };
      } else if (error.request) {
        // The request was made but no response was received
        throw {
          message:
            "No response from server. Please check your network connection.",
        };
      } else {
        // Something happened in setting up the request
        throw {
          message: error.message || "An error occurred during password reset.",
        };
      }
    }
  },

  // Refresh token
  refreshToken: async (token) => {
    try {
      const response = await API.post("/auth/refresh-token", { token });
      const { newAccessToken, newRefreshToken } = response.data;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await API.post("/auth/logout", { refreshToken });
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      // Clear local storage regardless of API success
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData || userData === "undefined" || userData === "null") {
        console.warn("No valid user data found in localStorage.");
        return null; // Prevents app from breaking
      }

      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user JSON:", error);
      return null; // Fails gracefully
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export default AuthService;
