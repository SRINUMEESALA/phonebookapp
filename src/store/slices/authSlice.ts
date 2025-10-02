import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../../services/api";
import { AuthState, LoginRequest, LoginResponse } from "../../types";
import { APP_CONSTANTS } from "../../constants";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);

      await AsyncStorage.setItem(
        APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN,
        response.accessToken
      );
      await AsyncStorage.setItem(
        APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN,
        response.refreshToken
      );
      await AsyncStorage.setItem(
        APP_CONSTANTS.STORAGE_KEYS.USER_DATA,
        JSON.stringify(response)
      );

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await AsyncStorage.getItem(
        APP_CONSTANTS.STORAGE_KEYS.USER_DATA
      );
      if (userData) {
        return JSON.parse(userData);
      }
      throw new Error("No user data found");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get profile");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);
});

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProfile.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
          state.error = null;
        }
      )
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
