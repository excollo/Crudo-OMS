// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../services/AuthServices/AuthServices";

// Get initial auth state from localStorage
// const user = AuthService.getCurrentUser();
const initialState = {
  user: AuthService.getCurrentUser(),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  otpValue: "",
  twoFactorRequired: false,
  tempEmail: null,// Add this line
  twoFactorSetup: {
    loading: false,
    error: null,
  },
};

// Async thunks for authentication actions
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const verifyTwoFactor = createAsyncThunk(
  "auth/verifyTwoFactor",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyTwoFactor(email, otp);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Verification failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await AuthService.requestPasswordReset(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Password reset request failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await AuthService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Password reset failed");
    }
  }
);

export const enableTwoFactor = createAsyncThunk(
  "auth/enableTwoFactor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.enableTwoFactor();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// In authSlice.js
export const verifyTwoFactorSetup = createAsyncThunk(
  "auth/verifyTwoFactorSetup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyTwoFactorSetup(data);
      return response;
    } catch (error) {
      // Properly extract error message for rejection
      const errorMessage = error?.message || 
                           (typeof error === 'string' ? error : 
                           'Verification failed');
      return rejectWithValue(errorMessage);
    }
  }
);

export const disableTwoFactor = createAsyncThunk(
  "auth/disableTwoFactor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.disableTwoFactor();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
    clearTwoFactorState: (state) => {
      state.twoFactorRequired = false;
      state.tempEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login cases
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requiresTwoFactor) {
          state.twoFactorRequired = true;
          state.tempEmail = action.payload.email;
          state.token = action.payload.otp; // Store the temporary token
          state.isAuthenticated = false;

          // Log for debugging
          console.log("2FA required, stored tempToken:", action.payload.otp);
        } else {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.twoFactorRequired = false;
          state.tempEmail = null;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Two-factor verification cases
      // Two-factor verification cases
      .addCase(verifyTwoFactor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // In authSlice.js, update the verifyTwoFactor.fulfilled handler
      .addCase(verifyTwoFactor.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.twoFactorRequired = false;
        state.tempEmail = null;
        state.error = null;
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Verification failed";
        // Don't clear tempEmail and tempToken in case they want to retry
      })

      // Password reset request cases
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Password reset cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Enable 2FA cases
      .addCase(enableTwoFactor.pending, (state) => {
        state.twoFactorSetup.loading = true;
        state.twoFactorSetup.error = null;
      })
      .addCase(enableTwoFactor.fulfilled, (state, action) => {
        state.twoFactorSetup.loading = false;
      })
      .addCase(enableTwoFactor.rejected, (state, action) => {
        state.twoFactorSetup.loading = false;
        state.twoFactorSetup.error = action.payload;
      })

      // Verify 2FA setup cases
      .addCase(verifyTwoFactorSetup.pending, (state) => {
        state.twoFactorSetup.loading = true;
        state.twoFactorSetup.error = null;
      })
      .addCase(verifyTwoFactorSetup.fulfilled, (state, action) => {
        state.twoFactorSetup.loading = false;
        if (state.user) {
          state.user.twoFactorEnabled = true;
        }
      })
      .addCase(verifyTwoFactorSetup.rejected, (state, action) => {
        state.twoFactorSetup.loading = false;
        state.twoFactorSetup.error = action.payload;
      })

      // Disable 2FA cases
      .addCase(disableTwoFactor.pending, (state) => {
        state.twoFactorSetup.loading = true;
        state.twoFactorSetup.error = null;
      })
      .addCase(disableTwoFactor.fulfilled, (state) => {
        state.twoFactorSetup.loading = false;
        if (state.user) {
          state.user.twoFactorEnabled = false;
        }
      })
      .addCase(disableTwoFactor.rejected, (state, action) => {
        state.twoFactorSetup.loading = false;
        state.twoFactorSetup.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.twoFactorRequired = false;
        state.tempEmail = null;
        state.tempToken = null;
      });
  },
});

export const { clearError, setTempEmail, clearTwoFactorState } =
  authSlice.actions;
export default authSlice.reducer;
