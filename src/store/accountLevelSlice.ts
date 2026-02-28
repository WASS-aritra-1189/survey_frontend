import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { accountLevelService } from "@/services/accountLevelService";

interface AccountLevel {
  id: string;
  name: string;
  priority: number;
  status: string;
  settingId: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountLevelState {
  levels: AccountLevel[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: AccountLevelState = {
  levels: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchAccountLevels = createAsyncThunk(
  "accountLevel/fetchAll",
  async (token: string) => {
    const response = await accountLevelService.getAll(token);
    return response.data;
  }
);

export const createAccountLevel = createAsyncThunk(
  "accountLevel/create",
  async ({ token, data }: { token: string; data: { name: string; priority: number; settingId: string } }) => {
    const response = await accountLevelService.create(token, data);
    return response.data;
  }
);

export const deleteAccountLevel = createAsyncThunk(
  "accountLevel/delete",
  async ({ token, id }: { token: string; id: string }) => {
    await accountLevelService.delete(token, id);
    return id;
  }
);

export const changeAccountLevelStatus = createAsyncThunk(
  "accountLevel/changeStatus",
  async ({ token, id, status }: { token: string; id: string; status: string }) => {
    await accountLevelService.changeStatus(token, id, status);
    return { id, status };
  }
);

export const updateAccountLevel = createAsyncThunk(
  "accountLevel/update",
  async ({ token, id, data }: { token: string; id: string; data: { name: string; priority: number; settingId: string } }) => {
    const response = await accountLevelService.update(token, id, data);
    return { id, data: response.data };
  }
);

const accountLevelSlice = createSlice({
  name: "accountLevel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.levels = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchAccountLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch account levels";
      })
      .addCase(createAccountLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccountLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.levels.push(action.payload);
        state.total += 1;
      })
      .addCase(createAccountLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create account level";
      })
      .addCase(deleteAccountLevel.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccountLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.levels = state.levels.filter(level => level.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteAccountLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete account level";
      })
      .addCase(changeAccountLevelStatus.fulfilled, (state, action) => {
        const level = state.levels.find(l => l.id === action.payload.id);
        if (level) {
          level.status = action.payload.status;
        }
      })
      .addCase(updateAccountLevel.fulfilled, (state, action) => {
        const index = state.levels.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.levels[index] = { ...state.levels[index], ...action.payload.data };
        }
      });
  },
});

export default accountLevelSlice.reducer;
