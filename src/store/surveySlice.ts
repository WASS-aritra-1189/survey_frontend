import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { surveyService } from "@/services/surveyService";
import { Survey } from "@/types/survey";

interface SurveyState {
  data: Survey[];
  currentSurvey: Survey | null;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: SurveyState = {
  data: [],
  currentSurvey: null,
  total: 0,
  isLoading: false,
  error: null,
};

export const fetchSurveys = createAsyncThunk(
  "survey/fetchAll",
  async ({ token, limit = 50, page = 1 }: { token: string; limit?: number; page?: number }) => {
    const response = await surveyService.getAll(token, limit, page);
    return response.data;
  }
);

export const fetchSurveyById = createAsyncThunk(
  "survey/fetchById",
  async ({ token, id }: { token: string; id: string }) => {
    const response = await surveyService.getById(token, id);
    return response.data;
  }
);

export const createSurvey = createAsyncThunk(
  "survey/create",
  async ({ data, token }: { data: Survey; token: string }) => {
    const response = await surveyService.create(data, token);
    return response.data;
  }
);

export const updateSurvey = createAsyncThunk(
  "survey/update",
  async ({ id, data, token }: { id: string; data: Partial<Survey>; token: string }) => {
    const response = await surveyService.update(id, data, token);
    return response.data;
  }
);

export const updateSurveyStatus = createAsyncThunk(
  "survey/updateStatus",
  async ({ id, status, token }: { id: string; status: string; token: string }) => {
    const response = await surveyService.updateStatus(id, status, token);
    return response.data;
  }
);

export const bulkAssignSurvey = createAsyncThunk(
  "survey/bulkAssign",
  async ({ id, surveyMasterIds, token }: { id: string; surveyMasterIds: string[]; token: string }) => {
    await surveyService.bulkAssign(id, surveyMasterIds, token);
    return id;
  }
);

export const deleteSurvey = createAsyncThunk(
  "survey/delete",
  async ({ id, token }: { id: string; token: string }) => {
    await surveyService.delete(id, token);
    return id;
  }
);

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveys.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchSurveys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch surveys";
      })
      .addCase(fetchSurveyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSurvey = action.payload;
      })
      .addCase(fetchSurveyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch survey";
      })
      .addCase(createSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.push(action.payload);
      })
      .addCase(createSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create survey";
      })
      .addCase(updateSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.data.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.currentSurvey?.id === action.payload.id) {
          state.currentSurvey = action.payload;
        }
      })
      .addCase(updateSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update survey";
      })
      .addCase(updateSurveyStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSurveyStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.data.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.currentSurvey?.id === action.payload.id) {
          state.currentSurvey = action.payload;
        }
      })
      .addCase(updateSurveyStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update survey status";
      })
      .addCase(bulkAssignSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkAssignSurvey.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(bulkAssignSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to assign survey";
      })
      .addCase(deleteSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(s => s.id !== action.payload);
        if (state.currentSurvey?.id === action.payload) {
          state.currentSurvey = null;
        }
      })
      .addCase(deleteSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete survey";
      });
  },
});

export default surveySlice.reducer;
