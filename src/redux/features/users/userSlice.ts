import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "Customer" | "Associate" | "Company" | "Admin";
  isActive: boolean;
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

export const getAllUsers = createAsyncThunk<User[]>(
  "users/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/users");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const getAssociates = createAsyncThunk<User[]>(
  "users/getAssociates",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/users/associates");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch associates"
      );
    }
  }
);

export const createUser = createAsyncThunk<User, Partial<User>>(
  "users/create",
  async (userData, thunkAPI) => {
    try {
      const response = await API.post("/users", userData);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: string; userData: Partial<Pick<User, "name" | "role" | "isActive">> }
>("users/update", async ({ id, userData }, thunkAPI) => {
  try {
    const response = await API.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update user"
    );
  }
});

export const deleteUser = createAsyncThunk<string, string>(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/users/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// <<< --- YAHAN 'EXPORT' ADD KAR DIYA GAYA HAI --- >>>
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: FormData, thunkAPI) => {
    try {
      const response = await API.put("/users/profile", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// <<< --- YAHAN BHI 'EXPORT' ADD KAR DIYA GAYA HAI --- >>>
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData: any, thunkAPI) => {
    try {
      const response = await API.put("/users/change-password", passwordData);
      return response.data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.users = action.payload;
        }
      )
      .addCase(
        getAssociates.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.users = action.payload;
        }
      )
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Profile updated successfully!";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      );
  },
});
export const { reset } = userSlice.actions;
export default userSlice.reducer;
