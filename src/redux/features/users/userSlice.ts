import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

// TypeScript के लिए User का टाइप
interface User {
  _id: string;
  name: string;
  email: string;
  agency?: string;
  status: "Active" | "Inactive";
  role: string;
  createdAt: string;
}

interface UserState {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// --- Async Thunks ---

// **getUsers को वापस जोड़ा गया है**
export const getUsers = createAsyncThunk<User[]>(
  "users/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/users");
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// getBrokers (ManageBrokers पेज के लिए)
export const getBrokers = createAsyncThunk<User[]>(
  "users/getBrokers",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/users/brokers");
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk<string, string>(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/users/${id}`);
      return id;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: string; userData: Partial<User> }
>("users/update", async ({ id, userData }, thunkAPI) => {
  try {
    const response = await API.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getBrokers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBrokers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isSuccess = true;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSuccess = true;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload as string;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isError = false;
          state.isSuccess = false;
        }
      );
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
