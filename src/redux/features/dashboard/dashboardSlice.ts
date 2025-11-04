import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/axios"; 
import { RootState } from "@/redux/store";

// Interfaces
interface DashboardStats {
  totalProperties?: number;
  totalSalesMonth?: number;
  newLeadsMonth?: number;
  reportsGenerated?: number;
  totalSalesValue?: number;
  totalUsers?: number;
  activeLeads?: number;
  monthlyRevenue?: { _id: string; total: number }[];
  recentSales?: {
    _id: string;
    buyer: { name: string; email: string };
    salePrice: number;
  }[];
}

interface Property {
  _id: string;
  title: string;
  location: { city: string };
  price: number;
  status: string;
}

interface Lead {
  _id: string;
  customerName: string;
  property?: { title: string };
}

interface DashboardState {
  companyStats: DashboardStats | null;
  adminStats: DashboardStats | null;
  recentProperties: Property[];
  recentLeads: Lead[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  companyStats: null,
  adminStats: null,
  recentProperties: [],
  recentLeads: [],
  isLoading: false,
  error: null,
};

// Async Thunks
export const getAdminDashboardStats = createAsyncThunk(
  "dashboard/getAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/dashboard/admin/stats");
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const getCompanyDashboardStats = createAsyncThunk(
  "dashboard/getCompanyStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/dashboard/company/stats");
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);
// ... baaki thunks waise hi rehne dein, agar zaroorat ho toh.

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminStats = action.payload;
      })
      .addCase(getAdminDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getCompanyDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCompanyDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companyStats = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
