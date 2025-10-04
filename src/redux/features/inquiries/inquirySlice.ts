import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios"; // आपका API इंस्टेंस
export interface Inquiry {
  _id: string;
  user: { _id: string; name: string; email: string };
  owner: { _id: string; name: string; email: string };
  property: { _id: string; title: string };
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "Pending" | "Contacted" | "Resolved";
  createdAt: string;
}

interface NewInquiryData {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface InquiryState {
  sent: Inquiry[];
  received: Inquiry[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}
const initialState: InquiryState = {
  sent: [],
  received: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};
export const createInquiry = createAsyncThunk<Inquiry, NewInquiryData>(
  "inquiry/create",
  async (inquiryData, { rejectWithValue }) => {
    try {
      const response = await API.post("/inquiries", inquiryData);
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Inquiry submission failed.";
      return rejectWithValue(message);
    }
  }
);

export const getMySentInquiries = createAsyncThunk<Inquiry[]>(
  "inquiry/getSent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/inquiries/sent");
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch sent inquiries.";
      return rejectWithValue(message);
    }
  }
);

export const getMyReceivedInquiries = createAsyncThunk<Inquiry[]>(
  "inquiry/getReceived",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/inquiries/received");
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch received inquiries.";
      return rejectWithValue(message);
    }
  }
);

export const updateInquiryStatus = createAsyncThunk<
  Inquiry,
  { id: string; status: string }
>("inquiry/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/inquiries/${id}/status`, { status });
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update status.";
    return rejectWithValue(message);
  }
});

export const deleteInquiry = createAsyncThunk<string, string>(
  "inquiry/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/inquiries/${id}`);
      return id; 
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete inquiry.";
      return rejectWithValue(message);
    }
  }
);

// 4. Inquiry Slice (Reducer Logic)
// ------------------------------------
export const inquirySlice = createSlice({
  name: "inquiry",
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

      .addCase(getMyReceivedInquiries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getMyReceivedInquiries.fulfilled,
        (state, action: PayloadAction<Inquiry[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.received = action.payload;
        }
      )

      .addCase(
        updateInquiryStatus.fulfilled,
        (state, action: PayloadAction<Inquiry>) => {
          state.isSuccess = true;
          const index = state.received.findIndex(
            (inq) => inq._id === action.payload._id
          );
          if (index !== -1) {
            state.received[index] = action.payload;
          }
        }
      )

      .addCase(
        deleteInquiry.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isSuccess = true;
          state.received = state.received.filter(
            (inq) => inq._id !== action.payload
          );
          state.sent = state.sent.filter((inq) => inq._id !== action.payload);
        }
      )

      // Create Inquiry
      .addCase(createInquiry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createInquiry.fulfilled,
        (state, action: PayloadAction<Inquiry>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.sent.push(action.payload);
        }
      )

      // Get Sent Inquiries
      .addCase(getMySentInquiries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getMySentInquiries.fulfilled,
        (state, action: PayloadAction<Inquiry[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.sent = action.payload;
        }
      )

      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload as string;
        }
      );
  },
});

// 5. Exports
// ------------------------------------
export const { reset } = inquirySlice.actions;
export default inquirySlice.reducer;
