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
  location: {
    city: string;
    fullAddress: string;
    district: string;
    area: string;
    pincode: string;
  };
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
  isFeatured: boolean;
  isHotDeal: boolean;
  isVerified: boolean;
  commission?: { percentage?: number; assignedAssociate?: string };
  yearBuilt?: number;
  floor?: number;
  totalFloors?: number;
  parkingSpaces?: number;
  amenities?: string[];
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
  isHotDeal?: boolean;
  city?: string;
  property_type?: string;
}

export const getProperties = createAsyncThunk<
  Property[],
  GetPropertiesFilters | void
>("properties/getAll", async (filters, thunkAPI) => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.isFeatured) params.append("isFeatured", "true");
      if (filters.isHotDeal) params.append("isHotDeal", "true");
      if (filters.city) params.append("city", filters.city);
      if (filters.property_type)
        params.append("property_type", filters.property_type);
    }
    const response = await API.get(`/properties?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch properties."
    );
  }
});

export const getPropertyById = createAsyncThunk<Property, string>(
  "properties/getById",
  async (id, thunkAPI) => {
    try {
      const response = await API.get(`/properties/${id}`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch property details."
      );
    }
  }
);

export const createProperty = createAsyncThunk<Property, FormData>(
  "properties/create",
  async (propertyData, thunkAPI) => {
    try {
      const response = await API.post("/properties", propertyData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create property."
      );
    }
  }
);

export const updateProperty = createAsyncThunk<
  Property,
  { id: string; propertyData: FormData }
>("properties/update", async ({ id, propertyData }, thunkAPI) => {
  try {
    const response = await API.put(`/properties/${id}`, propertyData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to update property."
    );
  }
});

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

export const deleteProperty = createAsyncThunk<string, string>(
  "properties/delete",
  async (propertyId, thunkAPI) => {
    try {
      await API.delete(`/properties/${propertyId}`);
      return propertyId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete property."
      );
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

export const toggleHotDeal = createAsyncThunk<Property, string>(
  "properties/toggleHotDeal",
  async (propertyId, thunkAPI) => {
    try {
      const response = await API.put(
        `/properties/${propertyId}/toggle-hotdeal`
      );
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update Hot Deal status."
      );
    }
  }
);

export const toggleFeatured = createAsyncThunk<Property, string>(
  "properties/toggleFeatured",
  async (propertyId, thunkAPI) => {
    try {
      const response = await API.put(
        `/properties/${propertyId}/toggle-featured`
      );
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update Featured status."
      );
    }
  }
);

export const toggleVerified = createAsyncThunk<Property, string>(
  "properties/toggleVerified",
  async (propertyId, thunkAPI) => {
    try {
      const response = await API.put(
        `/properties/${propertyId}/toggle-verified`
      );
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update Verified status."
      );
    }
  }
);

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
    const updatePropertyInState = (
      state: PropertyState,
      action: { payload: Property }
    ) => {
      state.isSuccess = true;
      const index = state.properties.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
    };

    builder
      .addCase(getProperties.fulfilled, (state, action) => {
        state.properties = action.payload;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.property = action.payload;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.properties.push(action.payload);
      })
      .addCase(updateProperty.fulfilled, updatePropertyInState)
      .addCase(approveProperty.fulfilled, updatePropertyInState)
      .addCase(toggleHotDeal.fulfilled, updatePropertyInState)
      .addCase(toggleFeatured.fulfilled, updatePropertyInState)
      .addCase(toggleVerified.fulfilled, updatePropertyInState)
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.properties = state.properties.filter(
          (prop) => prop._id !== action.payload
        );
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isSuccess = true;
        if (state.property && state.property.reviews) {
          state.property.reviews.unshift(action.payload);
        }
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
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
          state.isError = true;
          state.message = action.payload as string;
        }
      );
  },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;
