import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

interface PropertyReportData {
  _id: string; // City name
  count: number;
  averagePrice: number;
}
interface LeadReportData {
  _id: string; // Status name
  count: number;
}
interface SaleReportData {
  _id: { year: number; month: number };
  totalSalesValue: number;
  numberOfSales: number;
}
interface ReportState {
  propertyReports: PropertyReportData[];
  leadPerformance: LeadReportData[];
  salesPerformance: SaleReportData[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}
const initialState: ReportState = {
  propertyReports: [],
  leadPerformance: [],
  salesPerformance: [],
  isLoading: false,
  isError: false,
  message: "",
};
export const getPropertyReports = createAsyncThunk(
  "reports/getPropertyReports",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/reports/properties/by-location");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to fetch property reports");
    }
  }
);
export const getLeadPerformanceReport = createAsyncThunk(
  "reports/getLeadPerformance",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/reports/leads/performance");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to fetch lead reports");
    }
  }
);

export const getSalesPerformanceReport = createAsyncThunk(
  "reports/getSalesPerformance",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/reports/sales/performance");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to fetch sales reports");
    }
  }
);

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPropertyReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPropertyReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.propertyReports = action.payload;
      })
      .addCase(getLeadPerformanceReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeadPerformanceReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leadPerformance = action.payload;
      })
      .addCase(getSalesPerformanceReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSalesPerformanceReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesPerformance = action.payload;
      })
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
export default reportsSlice.reducer;
