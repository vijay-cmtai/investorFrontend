// File: /src/redux/features/dashboard/dashboardSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/redux/store";

const API_URL = "/api/dashboard";
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
  [key: string]: any;
}

interface Lead {
  _id: string;
  customerName: string;
  property?: { title: string };
  [key: string]: any;
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
const getToken = (getState: () => RootState) => {
  const {
    user: { userInfo },
  } = getState();
  return userInfo?.token;
};

export const getCompanyDashboardStats = createAsyncThunk<
  DashboardStats,
  void,
  { state: RootState }
>("dashboard/getCompanyStats", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const { data } = await axios.get(`${API_URL}/company/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const getAdminDashboardStats = createAsyncThunk<
  DashboardStats,
  void,
  { state: RootState }
>("dashboard/getAdminStats", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const { data } = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const getRecentProperties = createAsyncThunk<
  Property[],
  void,
  { state: RootState }
>("dashboard/getRecentProperties", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const {
      user: { userInfo },
    } = getState();
    const url =
      userInfo?.role === "admin"
        ? `${API_URL}/admin/recent-properties`
        : `${API_URL}/company/recent-properties`;
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const getRecentLeads = createAsyncThunk<
  Lead[],
  void,
  { state: RootState }
>("dashboard/getRecentLeads", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const {
      user: { userInfo },
    } = getState();
    const url =
      userInfo?.role === "admin"
        ? `${API_URL}/admin/recent-leads`
        : `${API_URL}/company/recent-leads`;
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyDashboardStats.fulfilled, (state, action) => {
        state.companyStats = action.payload;
      })
      .addCase(getAdminDashboardStats.fulfilled, (state, action) => {
        state.adminStats = action.payload;
      })
      .addCase(getRecentProperties.fulfilled, (state, action) => {
        state.recentProperties = action.payload;
      })
      .addCase(getRecentLeads.fulfilled, (state, action) => {
        state.recentLeads = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export default dashboardSlice.reducer;
