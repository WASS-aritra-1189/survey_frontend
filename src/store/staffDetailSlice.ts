import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { staffDetailService } from "@/services/staffDetailService";

interface StaffDetail {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  gender?: string;
  employeeId?: string;
  joiningDate?: string;
  accountId: string;
  designationId: string;
  account?: any;
  designation?: any;
  createdAt: string;
  updatedAt: string;
}

interface StaffDetailState {
  staffDetails: StaffDetail[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: StaffDetailState = {
  staffDetails: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchStaffDetails = createAsyncThunk(
  "staffDetail/fetchAll",
  async ({ token, page, limit, search }: { token: string; page?: number; limit?: number; search?: string }) => {
    const response = await staffDetailService.getAll(token, { page, limit, search });
    return response.data;
  }
);

export const updateStaffDetail = createAsyncThunk(
  "staffDetail/update",
  async ({ token, id, data }: { token: string; id: string; data: any }) => {
    const response = await staffDetailService.update(token, id, data);
    return { id, data: response.data };
  }
);

const staffDetailSlice = createSlice({
  name: "staffDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.staffDetails = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchStaffDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch staff details";
      })
      .addCase(updateStaffDetail.fulfilled, (state, action) => {
        const index = state.staffDetails.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.staffDetails[index] = { ...state.staffDetails[index], ...action.payload.data };
        }
      });
  },
});

export default staffDetailSlice.reducer;
