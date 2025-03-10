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
  login: async (email, password) => {
    try {
      const response = await API.post("/auth/signin", { email, password });

      console.log("API Response:", response.data); // Check what the backend returns

      if (response.data.requiresTwoFactor) {
        return {
          requiresTwoFactor: true,
          userId: response.data.userId,
          email,
        };
      }

      // Handling possible API response structures
      const user = response.data.user || response.data.data?.user;
      const accessToken =
        response.data.accessToken || response.data.data?.tokens?.accessToken;
      const refreshToken =
        response.data.refreshToken || response.data.data?.tokens?.refreshToken;

      if (!accessToken || !refreshToken || !user) {
        console.error("Invalid API response:", response.data);
        throw new Error("Missing accessToken, refreshToken, or user from API");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken };
    } catch (error) {
      console.error("Login API Error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  // Verify 2FA token
  verifyTwoFactor: async (email, token) => {
    try {
      const response = await API.post("/auth/verify-2fa", { email, token });
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens and user data
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken };
    } catch (error) {
      throw error.response?.data || error;
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
    try {
      const response = await API.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
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
