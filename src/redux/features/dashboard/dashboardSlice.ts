import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

interface StatsData {
  totalUsers: number;
  totalProperties: number;
  totalInquiries: number;
  pendingPropertiesCount: number;
  users: {
    total: number;
    roles: { [key: string]: number };
  };
  properties: {
    total: number;
    pending: number;
  };
  inquiries: {
    total: number;
    statuses: { [key: string]: number };
  };
}

interface DashboardState {
  stats: StatsData | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  isError: false,
  message: "",
};

export const getDashboardStats = createAsyncThunk<StatsData>(
  "dashboard/getStats",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/dashboard/stats");
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Could not fetch stats.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getDashboardStats.fulfilled,
        (state, action: PayloadAction<StatsData>) => {
          state.isLoading = false;
          state.stats = action.payload;
        }
      )
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
