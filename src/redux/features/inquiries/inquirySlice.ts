// redux/features/inquiries/inquirySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

export interface InquiryNote {
  _id: string;
  note: string;
  addedBy: {
    _id: string;
    name: string;
    email: string;
    role?: string;
  };
  addedAt: string;
}

export interface Inquiry {
  _id: string;
  user: { _id: string; name: string; email: string };
  owner: { _id: string; name: string; email: string };
  property: { _id: string; title: string };
  assignedTo?: { _id: string; name: string; email: string; role: string };
  assignedBy?: { _id: string; name: string; email: string };
  name: string;
  email: string;
  phone: string;
  message: string;
  status:
    | "Pending"
    | "Assigned"
    | "In Progress"
    | "Contacted"
    | "Resolved"
    | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  notes: InquiryNote[];
  assignedAt?: string;
  createdAt: string;
}

interface NewInquiryData {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface AssignInquiryData {
  id: string;
  employeeId: string;
  priority?: string;
}

interface AddNoteData {
  id: string;
  note: string;
}

interface UpdatePriorityData {
  id: string;
  priority: string;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface InquiryState {
  sent: Inquiry[];
  received: Inquiry[];
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: InquiryState = {
  sent: [],
  received: [],
  employees: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Create Inquiry
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

// Get My Sent Inquiries
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

// Get My Received Inquiries
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

// Assign Inquiry (Admin Only)
export const assignInquiry = createAsyncThunk<Inquiry, AssignInquiryData>(
  "inquiry/assign",
  async ({ id, employeeId, priority }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/inquiries/${id}/assign`, {
        employeeId,
        priority,
      });
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to assign inquiry.";
      return rejectWithValue(message);
    }
  }
);

// Update Inquiry Status
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

// Add Note to Inquiry
export const addNoteToInquiry = createAsyncThunk<Inquiry, AddNoteData>(
  "inquiry/addNote",
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/inquiries/${id}/notes`, { note });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add note.";
      return rejectWithValue(message);
    }
  }
);

// Update Inquiry Priority (Admin only)
export const updateInquiryPriority = createAsyncThunk<
  Inquiry,
  UpdatePriorityData
>("inquiry/updatePriority", async ({ id, priority }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/inquiries/${id}/priority`, { priority });
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update priority.";
    return rejectWithValue(message);
  }
});

// Delete Inquiry
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

// Get Employees for Assignment (Admin only)
export const getEmployeesForAssignment = createAsyncThunk<Employee[]>(
  "inquiry/getEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/inquiries/employees/list");
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch employees.";
      return rejectWithValue(message);
    }
  }
);

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
      // Get Received Inquiries
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

      // Assign Inquiry
      .addCase(
        assignInquiry.fulfilled,
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

      // Update Status
      .addCase(
        updateInquiryStatus.fulfilled,
        (state, action: PayloadAction<Inquiry>) => {
          state.isSuccess = true;
          const receivedIndex = state.received.findIndex(
            (inq) => inq._id === action.payload._id
          );
          if (receivedIndex !== -1) {
            state.received[receivedIndex] = action.payload;
          }
          const sentIndex = state.sent.findIndex(
            (inq) => inq._id === action.payload._id
          );
          if (sentIndex !== -1) {
            state.sent[sentIndex] = action.payload;
          }
        }
      )

      // Add Note
      .addCase(
        addNoteToInquiry.fulfilled,
        (state, action: PayloadAction<Inquiry>) => {
          state.isSuccess = true;
          const receivedIndex = state.received.findIndex(
            (inq) => inq._id === action.payload._id
          );
          if (receivedIndex !== -1) {
            state.received[receivedIndex] = action.payload;
          }
        }
      )

      // Update Priority
      .addCase(
        updateInquiryPriority.fulfilled,
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

      // Delete Inquiry
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

      // Get Employees
      .addCase(
        getEmployeesForAssignment.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.employees = action.payload;
        }
      )

      // Error handling
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload as string;
        }
      );
  },
});

export const { reset } = inquirySlice.actions;
export default inquirySlice.reducer;
