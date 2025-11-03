// src/redux/features/sales/saleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios"; // Adjust this path if needed

// FIX: Added 'export' so this interface can be imported in other files
export interface Sale {
  _id: string;
  property: { title: string } | null; // Allow property to be null
  buyer: { name: string; email: string } | null; // Allow buyer to be null
  sellerAssociate: { name: string };
  salePrice: number;
  saleDate: string;
  createdAt: string;
}

interface SaleData {
  property: string;
  buyer: { name: string; email: string };
  salePrice: number;
}

interface SaleState {
  sales: Sale[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: SaleState = {
  sales: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const createSale = createAsyncThunk(
  "sales/create",
  async (saleData: SaleData, thunkAPI) => {
    try {
      const response = await API.post("/sales", saleData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to record sale."
      );
    }
  }
);

export const getAllSales = createAsyncThunk<Sale[]>(
  "sales/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/sales");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales."
      );
    }
  }
);

export const saleSlice = createSlice({
  name: "sales",
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
      .addCase(createSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.sales.unshift(action.payload.data);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getAllSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllSales.fulfilled,
        (state, action: PayloadAction<Sale[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.sales = action.payload;
        }
      )
      .addCase(getAllSales.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = saleSlice.actions;
export default saleSlice.reducer;
