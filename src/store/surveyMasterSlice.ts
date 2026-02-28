import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { surveyMasterService } from "@/services/surveyMasterService";
import { SurveyMaster } from "@/types/surveyMaster";

interface SurveyMasterState {
  data: SurveyMaster[];
  selectedMaster: SurveyMaster | null;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: SurveyMasterState = {
  data: [],
  selectedMaster: null,
  total: 0,
  isLoading: false,
  error: null,
};

export const fetchSurveyMasters = createAsyncThunk(
  "surveyMaster/fetchAll",
  async ({ limit, page, token }: { limit: number; page: number; token: string }) => {
    const response = await surveyMasterService.getAll(limit, page, token);
    return response.data;
  }
);

export const fetchSurveyMasterById = createAsyncThunk(
  "surveyMaster/fetchById",
  async ({ id, token }: { id: string; token: string }) => {
    const response = await surveyMasterService.getById(id, token);
    return response.data;
  }
);

export const createSurveyMaster = createAsyncThunk(
  "surveyMaster/create",
  async ({ data, token }: { data: { loginId: string; password: string; surveyLimit: number; settingId?: string }; token: string }) => {
    const response = await surveyMasterService.create(data, token);
    return response.data;
  }
);

export const updateSurveyMasterStatus = createAsyncThunk(
  "surveyMaster/updateStatus",
  async ({ id, status, token }: { id: string; status: string; token: string }) => {
    const response = await surveyMasterService.updateStatus(id, status, token);
    return { id, status };
  }
);

export const deleteSurveyMaster = createAsyncThunk(
  "surveyMaster/delete",
  async ({ id, token }: { id: string; token: string }) => {
    await surveyMasterService.delete(id, token);
    return id;
  }
);

export const updateSurveyMaster = createAsyncThunk(
  "surveyMaster/update",
  async ({ id, data, token }: { id: string; data: { loginId?: string; password?: string; surveyLimit?: number; settingId?: string }; token: string }) => {
    const response = await surveyMasterService.update(id, data, token);
    return response.data;
  }
);

export const resetSurveyMasterPassword = createAsyncThunk(
  "surveyMaster/resetPassword",
  async ({ id, data, token }: { id: string; data: { oldPassword: string; newPassword: string; confirmPassword: string }; token: string }) => {
    await surveyMasterService.resetPassword(id, data, token);
    return id;
  }
);

const surveyMasterSlice = createSlice({
  name: "surveyMaster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveyMasters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveyMasters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchSurveyMasters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch survey masters";
      })
      .addCase(fetchSurveyMasterById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveyMasterById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMaster = action.payload;
      })
      .addCase(fetchSurveyMasterById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch survey master";
      })
      .addCase(createSurveyMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSurveyMaster.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createSurveyMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create survey master";
      })
      .addCase(updateSurveyMasterStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSurveyMasterStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const master = state.data.find(m => m.id === action.payload.id);
        if (master) {
          master.status = action.payload.status;
        }
        if (state.selectedMaster?.id === action.payload.id) {
          state.selectedMaster.status = action.payload.status;
        }
      })
      .addCase(updateSurveyMasterStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update status";
      })
      .addCase(deleteSurveyMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSurveyMaster.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(m => m.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteSurveyMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete survey master";
      })
      .addCase(updateSurveyMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSurveyMaster.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.data.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.selectedMaster?.id === action.payload.id) {
          state.selectedMaster = action.payload;
        }
      })
      .addCase(updateSurveyMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update survey master";
      })
      .addCase(resetSurveyMasterPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetSurveyMasterPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetSurveyMasterPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to reset password";
      });
  },
});

export default surveyMasterSlice.reducer;
