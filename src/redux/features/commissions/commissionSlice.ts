import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

interface Commission {
  _id: string;
  user: { name: string; email: string };
  sale: { property: { title: string } };
  amount: number;
  status: "Paid" | "Pending" | "Cancelled";
  createdAt: string;
}

interface CommissionState {
  commissions: Commission[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: CommissionState = {
  commissions: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const getCommissions = createAsyncThunk<Commission[]>(
  "commissions/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/commissions");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch commissions"
      );
    }
  }
);

export const updateCommissionStatus = createAsyncThunk<
  Commission,
  { id: string; status: Commission["status"] }
>("commissions/updateStatus", async ({ id, status }, thunkAPI) => {
  try {
    const response = await API.put(`/commissions/${id}/status`, { status });
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update status"
    );
  }
});

export const commissionSlice = createSlice({
  name: "commissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getCommissions.fulfilled,
        (state, action: PayloadAction<Commission[]>) => {
          state.isLoading = false;
          state.commissions = action.payload;
        }
      )
      .addCase(getCommissions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(
        updateCommissionStatus.fulfilled,
        (state, action: PayloadAction<Commission>) => {
          const index = state.commissions.findIndex(
            (c) => c._id === action.payload._id
          );
          if (index !== -1) {
            state.commissions[index] = action.payload;
          }
        }
      );
  },
});

export default commissionSlice.reducer;
