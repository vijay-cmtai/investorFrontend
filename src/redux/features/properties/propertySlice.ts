import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/axios";

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: { _id: string; name: string };
  createdAt: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  transaction_type: string;
  furnishingStatus: string;
  images?: string[];
  location: { city: string; fullAddress: string };
  status: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
  createdAt: string;
  reviews?: Review[];
  averageRating: number;
  numReviews: number;
}

interface UpdatePropertyPayload {
  title: string;
  description: string;
  price: number;
}

interface PropertyState {
  properties: Property[];
  property: Property | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: PropertyState = {
  properties: [],
  property: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

interface GetPropertiesFilters {
  isFeatured?: boolean;
  city?: string;
}

export const getProperties = createAsyncThunk<
  Property[],
  GetPropertiesFilters | void
>("properties/getAll", async (filters, thunkAPI) => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.isFeatured) params.append("isFeatured", "true");
      if (filters.city) params.append("city", filters.city);
    }
    const response = await API.get(`/properties?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch properties.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const getPropertyById = createAsyncThunk<Property, string>(
  "properties/getById",
  async (id, thunkAPI) => {
    try {
      const response = await API.get(`/properties/${id}`);
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch property details.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createProperty = createAsyncThunk<Property, FormData>(
  "properties/create",
  async (propertyData, thunkAPI) => {
    try {
      const response = await API.post("/properties", propertyData);
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create property.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProperty = createAsyncThunk<
  Property,
  { id: string; propertyData: UpdatePropertyPayload }
>("properties/update", async ({ id, propertyData }, thunkAPI) => {
  try {
    const response = await API.put(`/properties/${id}`, propertyData);
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update property.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const approveProperty = createAsyncThunk<Property, string>(
  "properties/approve",
  async (id, thunkAPI) => {
    try {
      const response = await API.put(`/properties/${id}/approve`);
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to approve property.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteProperty = createAsyncThunk<string, string>(
  "properties/delete",
  async (propertyId, thunkAPI) => {
    try {
      await API.delete(`/properties/${propertyId}`);
      return propertyId;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete property.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createReview = createAsyncThunk<
  Review,
  { propertyId: string; rating: number; comment: string }
>("properties/createReview", async (reviewData, { rejectWithValue }) => {
  try {
    const { propertyId, ...body } = reviewData;
    const response = await API.post(`/properties/${propertyId}/reviews`, body);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to submit review."
    );
  }
});

export const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.property = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getPropertyById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.property = action.payload;
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties.push(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.properties.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(approveProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.properties.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(approveProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = state.properties.filter(
          (prop) => prop._id !== action.payload
        );
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isSuccess = true;
        if (state.property && state.property.reviews) {
          state.property.reviews.unshift(action.payload);
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;
