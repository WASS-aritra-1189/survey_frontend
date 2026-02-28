import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { designationService } from "@/services/designationService";

interface Designation {
  id: string;
  name: string;
  description: string;
  priority: number;
  status: string;
  settingId: string;
  createdAt: string;
  updatedAt: string;
}

interface DesignationState {
  designations: Designation[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: DesignationState = {
  designations: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchDesignations = createAsyncThunk(
  "designation/fetchAll",
  async (token: string) => {
    const response = await designationService.getAll(token);
    return response.data;
  }
);

export const createDesignation = createAsyncThunk(
  "designation/create",
  async ({ token, data }: { token: string; data: { name: string; description: string; priority: number; status: string; settingId: string } }) => {
    const response = await designationService.create(token, data);
    return response.data;
  }
);

export const updateDesignation = createAsyncThunk(
  "designation/update",
  async ({ token, id, data }: { token: string; id: string; data: { name: string; description: string; priority: number; status: string; settingId: string } }) => {
    const response = await designationService.update(token, id, data);
    return { id, data: response.data };
  }
);

export const deleteDesignation = createAsyncThunk(
  "designation/delete",
  async ({ token, id }: { token: string; id: string }) => {
    await designationService.delete(token, id);
    return id;
  }
);

const designationSlice = createSlice({
  name: "designation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch designations";
      })
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.designations.push(action.payload);
        state.total += 1;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        const index = state.designations.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.designations[index] = { ...state.designations[index], ...action.payload.data };
        }
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.designations = state.designations.filter(d => d.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default designationSlice.reducer;
