import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesState } from "../../types";
import { APP_CONSTANTS } from "../../constants";

export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await AsyncStorage.getItem(
        APP_CONSTANTS.STORAGE_KEYS.FAVORITES
      );
      if (favorites) {
        return JSON.parse(favorites);
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load favorites");
    }
  }
);

export const addToFavorites = createAsyncThunk(
  "favorites/addToFavorites",
  async (userId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const currentFavorites = state.favorites.favoriteUserIds || [];

      if (currentFavorites.includes(userId)) {
        throw new Error("User is already in favorites");
      }

      const newFavorites = [...currentFavorites, userId];
      await AsyncStorage.setItem(
        APP_CONSTANTS.STORAGE_KEYS.FAVORITES,
        JSON.stringify(newFavorites)
      );

      return newFavorites;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add to favorites");
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorites/removeFromFavorites",
  async (userId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const currentFavorites = state.favorites.favoriteUserIds || [];

      const newFavorites = currentFavorites.filter(
        (id: number) => id !== userId
      );
      await AsyncStorage.setItem(
        APP_CONSTANTS.STORAGE_KEYS.FAVORITES,
        JSON.stringify(newFavorites)
      );

      return newFavorites;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to remove from favorites"
      );
    }
  }
);

const initialState: FavoritesState = {
  favoriteUserIds: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadFavorites.fulfilled,
        (state, action: PayloadAction<number[]>) => {
          state.loading = false;
          state.favoriteUserIds = action.payload;
          state.error = null;
        }
      )
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addToFavorites.fulfilled,
        (state, action: PayloadAction<number[]>) => {
          state.loading = false;
          state.favoriteUserIds = action.payload;
          state.error = null;
        }
      )
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFromFavorites.fulfilled,
        (state, action: PayloadAction<number[]>) => {
          state.loading = false;
          state.favoriteUserIds = action.payload;
          state.error = null;
        }
      )
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
