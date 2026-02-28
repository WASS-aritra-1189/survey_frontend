import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { statsService, SurveyStats } from "@/services/statsService";

interface StatsState {
  data: SurveyStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchSurveyStats = createAsyncThunk(
  "stats/fetchSurveyStats",
  async ({ token, surveyId }: { token: string; surveyId: string }) => {
    const response = await statsService.getSurveyStats(token, surveyId);
    return response.data;
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    clearStats: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveyStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveyStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchSurveyStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch stats";
      });
  },
});

export const { clearStats } = statsSlice.actions;
export default statsSlice.reducer;
