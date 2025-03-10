// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../services/AuthServices/AuthServices";


// Get initial auth state from localStorage
const user = AuthService.getCurrentUser();
const initialState = {
  user: user,
  isAuthenticated: !!user,
  loading: false,
  error: null,
  twoFactorRequired: false,
  tempEmail: null,
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
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const verifyTwoFactor = createAsyncThunk(
  "auth/verifyTwoFactor",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyTwoFactor(email, token);
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
      return rejectWithValue(error.message || "Failed to enable 2FA");
    }
  }
);

export const verifyTwoFactorSetup = createAsyncThunk(
  "auth/verifyTwoFactorSetup",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyTwoFactorSetup(email, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to verify 2FA setup");
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
      return rejectWithValue(error.message || "Failed to disable 2FA");
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.requiresTwoFactor) {
          state.twoFactorRequired = true;
          state.tempEmail = action.payload.email;
        } else {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.twoFactorRequired = false;
          state.tempEmail = null;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Two-factor verification cases
      .addCase(verifyTwoFactor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTwoFactor.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.twoFactorRequired = false;
        state.tempEmail = null;
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.twoFactorRequired = false;
        state.tempEmail = null;
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
        state.loading = true;
        state.error = null;
      })
      .addCase(enableTwoFactor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(enableTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify 2FA setup cases
      .addCase(verifyTwoFactorSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTwoFactorSetup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyTwoFactorSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Disable 2FA cases
      .addCase(disableTwoFactor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disableTwoFactor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(disableTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setTempEmail } = authSlice.actions;
export default authSlice.reducer;
