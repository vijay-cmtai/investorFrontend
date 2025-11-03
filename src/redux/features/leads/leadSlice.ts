import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios"; // Apna API import path aavashyakta anusaar theek karein
export interface Lead {
  _id: string;
  property: { _id: string; title: string };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status:
    | "New"
    | "Allocated"
    | "Contacted"
    | "Follow-up"
    | "Converted"
    | "Dropped";
  source: string;
  assignedTo?: { _id: string; name: string; email: string }; // Optional ho sakta hai
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}
interface NewLeadData {
  propertyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
}
interface LeadState {
  allLeads: Lead[]; // Admin/Company ke liye
  myLeads: Lead[]; // Assigned Associate ke liye
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: LeadState = {
  allLeads: [],
  myLeads: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// 3. Async Thunks ko Lead Endpoints ke anusaar banayein

// Koi bhi user lead create kar sakta hai
export const createLead = createAsyncThunk<Lead, NewLeadData>(
  "leads/create",
  async (leadData, { rejectWithValue }) => {
    try {
      // Backend ke route (`/`) ke anusaar POST request
      const response = await API.post("/leads", leadData);
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Lead submission failed.";
      return rejectWithValue(message);
    }
  }
);

// Admin/Company sabhi leads dekhega
export const getAllLeads = createAsyncThunk<Lead[]>(
  "leads/getAll",
  async (_, { rejectWithValue }) => {
    try {
      // Backend ke route (`/`) ke anusaar GET request
      const response = await API.get("/leads");
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch leads.";
      return rejectWithValue(message);
    }
  }
);

// Assigned associate apne leads dekhega
export const getMyLeads = createAsyncThunk<Lead[]>(
  "leads/getMy",
  async (_, { rejectWithValue }) => {
    try {
      // Backend ke route (`/my`) ke anusaar GET request
      const response = await API.get("/leads/my");
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch my leads.";
      return rejectWithValue(message);
    }
  }
);

// Lead ko kisi associate ko assign karna
export const assignLead = createAsyncThunk<
  Lead,
  { leadId: string; associateId: string }
>("leads/assign", async ({ leadId, associateId }, { rejectWithValue }) => {
  try {
    // Backend ke route (`/:id/assign`) ke anusaar PUT request
    const response = await API.put(`/leads/${leadId}/assign`, { associateId });
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to assign lead.";
    return rejectWithValue(message);
  }
});

// Lead ka status update karna
export const updateLeadStatus = createAsyncThunk<
  Lead,
  { leadId: string; status: string }
>("leads/updateStatus", async ({ leadId, status }, { rejectWithValue }) => {
  try {
    // Backend ke route (`/:id/status`) ke anusaar PUT request
    const response = await API.put(`/leads/${leadId}/status`, { status });
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update status.";
    return rejectWithValue(message);
  }
});

// Lead delete karna
export const deleteLead = createAsyncThunk<string, string>(
  "leads/delete",
  async (leadId, { rejectWithValue }) => {
    try {
      await API.delete(`/leads/${leadId}`);
      return leadId;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete lead.";
      return rejectWithValue(message);
    }
  }
);

export const leadSlice = createSlice({
  name: "leads", // Slice ka naam 'leads' rakhein
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
      // Cases for creating a lead
      .addCase(createLead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Naya lead 'allLeads' mein add karein taaki Admin ko turant dikhe
        state.allLeads.unshift(action.payload);
      })

      // Cases for getting all leads (Admin/Company)
      .addCase(getAllLeads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllLeads.fulfilled,
        (state, action: PayloadAction<Lead[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.allLeads = action.payload;
        }
      )

      // Cases for getting my leads (Associate)
      .addCase(getMyLeads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyLeads.fulfilled, (state, action: PayloadAction<Lead[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myLeads = action.payload;
      })

      // Cases for updating status or assigning
      .addCase(
        updateLeadStatus.fulfilled,
        (state, action: PayloadAction<Lead>) => {
          state.isSuccess = true;
          // Dono arrays mein update karein agar lead मौजूद hai
          const indexAll = state.allLeads.findIndex(
            (lead) => lead._id === action.payload._id
          );
          if (indexAll !== -1) state.allLeads[indexAll] = action.payload;

          const indexMy = state.myLeads.findIndex(
            (lead) => lead._id === action.payload._id
          );
          if (indexMy !== -1) state.myLeads[indexMy] = action.payload;
        }
      )
      .addCase(assignLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.isSuccess = true;
        // Dono arrays mein update karein
        const indexAll = state.allLeads.findIndex(
          (lead) => lead._id === action.payload._id
        );
        if (indexAll !== -1) state.allLeads[indexAll] = action.payload;

        const indexMy = state.myLeads.findIndex(
          (lead) => lead._id === action.payload._id
        );
        if (indexMy !== -1) state.myLeads[indexMy] = action.payload;
      })

      // Case for deleting a lead
      .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSuccess = true;
        // Dono arrays se filter karke nikal dein
        state.allLeads = state.allLeads.filter(
          (lead) => lead._id !== action.payload
        );
        state.myLeads = state.myLeads.filter(
          (lead) => lead._id !== action.payload
        );
      })

      // Generic rejected case
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

export const { reset } = leadSlice.actions;
export default leadSlice.reducer;
