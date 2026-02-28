import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { responseService, SurveyResponse } from "@/services/responseService";

interface ResponseState {
  data: SurveyResponse[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: ResponseState = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export const fetchResponses = createAsyncThunk(
  "response/fetchAll",
  async ({
    token,
    surveyId,
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
  }: {
    token: string;
    surveyId: string;
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await responseService.getAll(token, surveyId, page, limit, search, startDate, endDate);
    return response.data;
  }
);

export const submitResponse = createAsyncThunk(
  "response/submit",
  async ({ surveyId, responses }: { surveyId: string; responses: { questionId: string; answer: any }[] }) => {
    return await responseService.create(surveyId, responses);
  }
);

const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    clearResponses: (state) => {
      state.data = [];
      state.total = 0;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResponses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchResponses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch responses";
      })
      .addCase(submitResponse.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitResponse.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(submitResponse.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || "Failed to submit response";
      });
  },
});

export const { clearResponses } = responseSlice.actions;
export default responseSlice.reducer;
