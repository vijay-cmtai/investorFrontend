import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";
import { Property } from "../properties/propertySlice";

// Interface for a single wishlist item received from the API
interface WishlistItem {
  _id: string;
  user: string;
  property: Property;
}

// Interface for the wishlist state in the Redux store
interface WishlistState {
  items: WishlistItem[]; // Holds the full wishlist item objects
  itemIds: string[]; // Holds only the property IDs for quick lookups
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: WishlistState = {
  items: [],
  itemIds: [],
  isLoading: false,
  isError: false,
  message: "",
};

// Async thunk to fetch the user's entire wishlist
export const getWishlist = createAsyncThunk<WishlistItem[]>(
  "wishlist/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/wishlist");
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch wishlist";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to add or remove a property from the wishlist
export const toggleWishlist = createAsyncThunk<{ propertyId: string }, string>(
  "wishlist/toggle",
  async (propertyId, thunkAPI) => {
    try {
      // The backend should handle adding/removing based on existence
      const response = await API.post("/wishlist", { propertyId });
      // We expect the backend to return the propertyId that was toggled
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update wishlist";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Resets the loading/error state
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for getWishlist
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getWishlist.fulfilled,
        (state, action: PayloadAction<WishlistItem[]>) => {
          state.isLoading = false;
          state.isError = false;
          state.message = "";
          state.items = action.payload;
          // Populate both items and itemIds for consistency
          state.itemIds = action.payload.map((item) => item.property._id);
        }
      )
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.items = []; // Clear items on failure
        state.itemIds = [];
      })

      // Case for toggleWishlist
      .addCase(
        toggleWishlist.fulfilled,
        (state, action: PayloadAction<{ propertyId: string }>) => {
          const { propertyId } = action.payload;
          const index = state.itemIds.indexOf(propertyId);

          if (index > -1) {
            // If propertyId exists, REMOVE it from both arrays for consistency
            state.itemIds.splice(index, 1);
            state.items = state.items.filter(
              (item) => item.property._id !== propertyId
            );
          } else {
            // If propertyId does not exist, ADD it.
            // Note: We can only add the ID here because we don't have the full 'Property' object.
            // The 'items' array will become fully consistent after the next 'getWishlist' call.
            state.itemIds.push(propertyId);
          }
        }
      );
    // Note: You might want to add a .addCase(toggleWishlist.rejected, ...) to handle errors,
    // for example, to show a toast message.
  },
});

export const { reset } = wishlistSlice.actions;
export default wishlistSlice.reducer;
