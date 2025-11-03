import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../../api/axios";

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

interface RoleState {
  roles: Role[];
  permissionsList: string[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: RoleState = {
  roles: [],
  permissionsList: [
    "View Dashboard",
    "Manage Properties",
    "Manage Users",
    "Manage Leads",
    "Manage Commissions",
    "Access Reports",
    "Manage Settings",
  ],
  isLoading: false,
  isError: false,
};

export const getRoles = createAsyncThunk<Role[]>(
  "roles/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/roles");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch roles.");
    }
  }
);

// --- YEH NAYA THUNK ADD KAREIN ---
export const initializeRoles = createAsyncThunk<Role[]>(
  "roles/initialize",
  async (_, thunkAPI) => {
    try {
      const response = await API.post("/roles/initialize");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to initialize roles.");
    }
  }
);

export const updateRole = createAsyncThunk<
  Role,
  { id: string; permissions: string[] }
>("roles/update", async ({ id, permissions }, thunkAPI) => {
  try {
    const response = await API.put(`/roles/${id}`, { permissions });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to update role.");
  }
});

export const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.isLoading = false;
        state.roles = action.payload;
      })
      .addCase(getRoles.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // --- NAYE CASES ADD KAREIN ---
      .addCase(initializeRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        initializeRoles.fulfilled,
        (state, action: PayloadAction<Role[]>) => {
          state.isLoading = false;
          state.roles = action.payload;
        }
      )
      // ---
      .addCase(updateRole.pending, (state) => {
        /* Optionally handle loading state for updates */
      })
      .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
        const index = state.roles.findIndex(
          (role) => role._id === action.payload._id
        );
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state) => {
        state.isError = true;
      });
  },
});

export default roleSlice.reducer;
