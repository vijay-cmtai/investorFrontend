import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

// Form se aane wale data ka type
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Slice ki state ka type
interface ContactState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: ContactState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// API call ke liye async thunk
export const submitContactForm = createAsyncThunk<string, ContactFormData>(
  "contact/submit",
  async (formData, thunkAPI) => {
    try {
      const response = await API.post("/contact/submit", formData);
      return response.data.message; // Success message return karein
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    // State ko reset karne ke liye
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        submitContactForm.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.message = action.payload;
        }
      )
      .addCase(
        submitContactForm.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      );
  },
});

export const { reset } = contactSlice.actions;
export default contactSlice.reducer;
