// src/redux/features/properties/propertySlice.js

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

// Interface for a single property
export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    district: string;
    area: string;
    fullAddress: string;
    pincode: string;
  };
  property_type: string;
  transaction_type: "sale" | "rent" | "lease";
  status: "Pending" | "Approved" | "Rejected";
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  user?: {
    _id: string;
    name: string;
    role: string;
  };
}

// Interface for the update function payload
interface UpdatePropertyPayload {
  id: string;
  propertyData: FormData;
}

// Interface for the entire slice's state
interface PropertyState {
  properties: Property[];
  property: Property | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

// The initial state for the slice
const initialState: PropertyState = {
  properties: [],
  property: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// --- ASYNC THUNKS ---

// Thunk to get ALL properties (For Admin)
export const getProperties = createAsyncThunk<Property[], void>(
  "properties/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/properties");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch properties."
      );
    }
  }
);

// =========================================================================
// UPDATED CODE STARTS HERE: New thunk for brokers
// Thunk to get ONLY the logged-in user's properties (For Broker)
export const getMyProperties = createAsyncThunk<Property[], void>(
  "properties/getMyProperties",
  async (_, thunkAPI) => {
    try {
      // This endpoint '/properties/my-properties' is defined in your routes
      const response = await API.get("/properties/my-properties");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch your properties."
      );
    }
  }
);
// UPDATED CODE ENDS HERE
// =========================================================================

// Thunk to get a single property by its ID
export const getPropertyById = createAsyncThunk<Property, string>(
  "properties/getById",
  async (id, thunkAPI) => {
    try {
      const response = await API.get(`/properties/${id}`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch property."
      );
    }
  }
);

// Thunk to create a new property
export const createProperty = createAsyncThunk<Property, FormData>(
  "properties/create",
  async (propertyData, thunkAPI) => {
    try {
      const response = await API.post("/properties", propertyData);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create property."
      );
    }
  }
);

// Thunk to update an existing property
export const updateProperty = createAsyncThunk<Property, UpdatePropertyPayload>(
  "properties/update",
  async ({ id, propertyData }, thunkAPI) => {
    try {
      const response = await API.put(`/properties/${id}`, propertyData);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update property."
      );
    }
  }
);

// Thunk to delete a property
export const deleteProperty = createAsyncThunk<string, string>(
  "properties/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/properties/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete property."
      );
    }
  }
);

// Thunk to approve a property (Admin only)
export const approveProperty = createAsyncThunk<Property, string>(
  "properties/approve",
  async (id, thunkAPI) => {
    try {
      const response = await API.put(`/properties/${id}/approve`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to approve property."
      );
    }
  }
);

// --- THE SLICE ITSELF ---
export const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    // Resets the state to its initial values, except for data
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  // Handles actions from async thunks
  extraReducers: (builder) => {
    builder
      // Cases for getting ALL properties (Admin)
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getProperties.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.properties = action.payload;
        }
      )

      // =========================================================================
      // UPDATED CODE STARTS HERE: New cases for broker's properties
      // Cases for getting MY properties (Broker)
      .addCase(getMyProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getMyProperties.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.properties = action.payload; // Updates the same state array
        }
      )
      // UPDATED CODE ENDS HERE
      // =========================================================================

      // Cases for getting a single property
      .addCase(getPropertyById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getPropertyById.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.property = action.payload;
        }
      )

      // Cases for creating a property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })

      // Cases for deleting a property
      .addCase(
        deleteProperty.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isSuccess = true;
          state.properties = state.properties.filter(
            (p) => p._id !== action.payload
          );
        }
      )

      // Cases for updating a property
      .addCase(
        updateProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.isSuccess = true;
          state.properties = state.properties.map((p) =>
            p._id === action.payload._id ? action.payload : p
          );
        }
      )

      // Cases for approving a property
      .addCase(
        approveProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.isSuccess = true;
          state.properties = state.properties.map((p) =>
            p._id === action.payload._id ? action.payload : p
          );
        }
      )

      // A general matcher to handle all rejected thunks
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

// Exporting the reset action and the reducer
export const { reset } = propertySlice.actions;
export default propertySlice.reducer;
