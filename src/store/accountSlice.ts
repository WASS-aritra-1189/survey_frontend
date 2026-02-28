import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountService } from '../services/accountService';

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAll',
  async ({ token, ...params }: { token: string; page?: number; limit?: number; search?: string; roles?: string[] }) => {
    console.log('fetchAccounts called with:', params);
    const result = await accountService.getAll(token, params);
    console.log('Service returned:', result);
    return result.data;
  }
);

export const resetPassword = createAsyncThunk(
  'accounts/resetPassword',
  async ({ token, id, data }: { token: string; id: string; data: { oldPassword: string; newPassword: string; confirmPassword: string } }) => {
    await accountService.resetPassword(token, id, data);
    return id;
  }
);

export const changeStatus = createAsyncThunk(
  'accounts/changeStatus',
  async ({ token, id, status }: { token: string; id: string; status: string }) => {
    await accountService.changeStatus(token, id, status);
    return { id, status };
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/update',
  async ({ token, id, data }: { token: string; id: string; data: { loginId: string } }) => {
    await accountService.update(token, id, data);
    return { id, data };
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState: {
    accounts: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        console.log('fetchAccounts fulfilled with:', action.payload);
        state.loading = false;
        state.accounts = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch accounts';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reset password';
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const account = state.accounts.find((a: any) => a.id === action.payload.id);
        if (account) {
          (account as any).status = action.payload.status;
        }
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to change status';
      })
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const account = state.accounts.find((a: any) => a.id === action.payload.id);
        if (account) {
          (account as any).loginId = action.payload.data.loginId;
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update account';
      });
  },
});

export default accountSlice.reducer;
