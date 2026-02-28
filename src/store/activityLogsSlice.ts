import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { activityLogsService } from '../services/activityLogsService';

export const fetchActivityLogs = createAsyncThunk(
  'activityLogs/fetchAll',
  async ({ token, ...params }: { token: string; page?: number; limit?: number }) => {
    const result = await activityLogsService.getAll(token, params);
    return result.data;
  }
);

const activityLogsSlice = createSlice({
  name: 'activityLogs',
  initialState: {
    logs: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activity logs';
      });
  },
});

export default activityLogsSlice.reducer;
