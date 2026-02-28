import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { surveyTypeService, SurveyType } from "@/services/surveyTypeService";

interface SurveyTypeState {
  surveyTypes: SurveyType[];
  loading: boolean;
  error: string | null;
}

const initialState: SurveyTypeState = {
  surveyTypes: [],
  loading: false,
  error: null,
};

export const fetchSurveyTypes = createAsyncThunk(
  "surveyTypes/fetchAll",
  async (token: string) => {
    const response = await surveyTypeService.getAll(token);
    return response.data;
  }
);

export const createSurveyType = createAsyncThunk(
  "surveyTypes/create",
  async ({ data, token }: { data: { name: string; templateQuestions?: any[] }; token: string }) => {
    const response = await surveyTypeService.create(data, token);
    return response.data;
  }
);

export const updateSurveyType = createAsyncThunk(
  "surveyTypes/update",
  async ({ id, data, token }: { id: string; data: { name?: string; templateQuestions?: any[] }; token: string }) => {
    const response = await surveyTypeService.update(id, data, token);
    return response.data;
  }
);

export const deleteSurveyType = createAsyncThunk(
  "surveyTypes/delete",
  async ({ id, token }: { id: string; token: string }) => {
    await surveyTypeService.delete(id, token);
    return id;
  }
);

export const updateSurveyTypeStatus = createAsyncThunk(
  "surveyTypes/updateStatus",
  async ({ id, isActive, token }: { id: string; isActive: boolean; token: string }) => {
    const response = await surveyTypeService.updateStatus(id, isActive, token);
    return response.data;
  }
);

const surveyTypeSlice = createSlice({
  name: "surveyTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveyTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurveyTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.surveyTypes = action.payload;
      })
      .addCase(fetchSurveyTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch";
      })
      .addCase(createSurveyType.fulfilled, (state, action) => {
        state.surveyTypes.push(action.payload);
      })
      .addCase(updateSurveyType.fulfilled, (state, action) => {
        const index = state.surveyTypes.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.surveyTypes[index] = action.payload;
      })
      .addCase(deleteSurveyType.fulfilled, (state, action) => {
        state.surveyTypes = state.surveyTypes.filter((t) => t.id !== action.payload);
      })
      .addCase(updateSurveyTypeStatus.fulfilled, (state, action) => {
        const index = state.surveyTypes.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.surveyTypes[index] = action.payload;
      });
  },
});

export default surveyTypeSlice.reducer;
