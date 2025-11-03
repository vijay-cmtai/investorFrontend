import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/axios";
import { updateProfile } from "../users/userSlice";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Associate" | "Company" | "Admin";
  phone?: string;
  profileImage?: string;
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  status: "idle" | "loading" | "succeeded" | "failed" | "verification_pending";
}

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  status: "idle",
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: any, thunkAPI) => {
    try {
      const response = await API.post("/auth/register", userData);
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData: { email: string; otp: string }, thunkAPI) => {
    try {
      const response = await API.post("/auth/verify-otp", otpData);
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: any, thunkAPI) => {
    try {
      const response = await API.post("/auth/login", userData);
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: { email: string }, thunkAPI) => {
    try {
      const response = await API.post("/auth/forgot-password", email);
      return response.data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send reset link"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { token: string; password: string }, thunkAPI) => {
    try {
      const { token, password } = data;
      const response = await API.put(`/auth/reset-password/${token}`, {
        password,
      });
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      if (state.status !== "verification_pending") {
        state.status = "idle";
      }
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    };
    const handleRejected = (state: AuthState, action: any) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.status = "failed";
    };
    const handleLoginSuccess = (state: AuthState, action: any) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.message = action.payload.message;
      state.status = "succeeded";
    };

    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.status = "succeeded";
        } else {
          state.status = "verification_pending";
        }
        state.message = action.payload.message;
      })
      .addCase(register.rejected, handleRejected)
      .addCase(verifyOtp.pending, handlePending)
      .addCase(verifyOtp.fulfilled, handleLoginSuccess)
      .addCase(verifyOtp.rejected, handleRejected)
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, handleLoginSuccess)
      .addCase(login.rejected, handleRejected)
      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, handleRejected)
      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, handleLoginSuccess)
      .addCase(resetPassword.rejected, handleRejected)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = action.payload;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
