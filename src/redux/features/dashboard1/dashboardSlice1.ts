// src/redux/features/dashboard/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios"; // Adjust path to your API instance

// --- Interfaces for the data we will fetch ---
interface DashboardStats {
  totalProperties: number;
  totalSalesMonth: number;
  newLeadsMonth: number;
  reportsGenerated: number;
}

// A simplified Property type for the dashboard list
interface RecentProperty {
  _id: string;
  title: string;
  location: { city: string };
  price: number;
  status: "Pending" | "Approved" | "Rejected" | "Sold";
}

// A simplified Lead type for the dashboard list
interface RecentLead {
  _id: string;
  customerName: string;
  property: {
    _id: string;
    title: string;
  } | null;
}

// --- The state for this slice ---
interface DashboardState {
  stats: DashboardStats;
  recentProperties: RecentProperty[];
  recentLeads: RecentLead[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: DashboardState = {
  stats: {
    totalProperties: 0,
    totalSalesMonth: 0,
    newLeadsMonth: 0,
    reportsGenerated: 0,
  },
  recentProperties: [],
  recentLeads: [],
  isLoading: false,
  isError: false,
  message: "",
};

// --- Async Thunks to fetch data from our new API endpoints ---
export const getDashboardStats = createAsyncThunk<DashboardStats>(
  "dashboard/getStats",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/dashboard1/stats");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to fetch dashboard stats.");
    }
  }
);

export const getRecentProperties = createAsyncThunk<RecentProperty[]>(
  "dashboard/getRecentProperties",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/dashboard1/recent-properties");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to fetch recent properties.");
    }
  }
);

export const getRecentLeads = createAsyncThunk<RecentLead[]>(
  "dashboard/getRecentLeads",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/dashboard1/recent-leads");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to fetch recent leads.");
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
      // Handle Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.isLoading = false;
          state.stats = action.payload;
        }
      )
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Handle Recent Properties
      .addCase(
        getRecentProperties.fulfilled,
        (state, action: PayloadAction<RecentProperty[]>) => {
          state.recentProperties = action.payload;
        }
      )
      // Handle Recent Leads
      .addCase(
        getRecentLeads.fulfilled,
        (state, action: PayloadAction<RecentLead[]>) => {
          state.recentLeads = action.payload;
        }
      );
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
