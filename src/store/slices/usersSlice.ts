import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { usersAPI } from "../../services/api";
import { UsersState } from "../../types";
import { APP_CONSTANTS } from "../../constants";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    params: { skip?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const { skip = 0, limit = APP_CONSTANTS.PAGINATION_LIMIT } = params;
      const response = await usersAPI.getUsers(skip, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (
    params: { query: string; skip?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const {
        query,
        skip = 0,
        limit = APP_CONSTANTS.PAGINATION_LIMIT,
      } = params;
      const response = await usersAPI.searchUsers(query, skip, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search users");
    }
  }
);

export const loadMoreUsers = createAsyncThunk(
  "users/loadMoreUsers",
  async (params: { skip: number; limit?: number }, { rejectWithValue }) => {
    try {
      const { skip, limit = APP_CONSTANTS.PAGINATION_LIMIT } = params;
      const response = await usersAPI.getUsers(skip, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load more users");
    }
  }
);

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  hasMore: true,
  skip: 0,
  total: 0,
  searchQuery: "",
  filterGender: "",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.skip = 0;
      state.hasMore = true;
      state.total = 0;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterGender: (state, action: PayloadAction<string>) => {
      state.filterGender = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.skip = action.payload.skip + action.payload.limit;
        state.hasMore = state.skip < action.payload.total;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.skip = action.payload.skip + action.payload.limit;
        state.hasMore = state.skip < action.payload.total;
        state.error = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadMoreUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = [...state.users, ...action.payload.users];
        state.skip = action.payload.skip + action.payload.limit;
        state.hasMore = state.skip < action.payload.total;
        state.error = null;
      })
      .addCase(loadMoreUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsers, setSearchQuery, setFilterGender, clearError } =
  usersSlice.actions;
export default usersSlice.reducer;
