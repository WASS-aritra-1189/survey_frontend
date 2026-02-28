import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionsService } from '../services/permissionsService';

export const fetchAccountPermissions = createAsyncThunk(
  'permissions/fetchAccount',
  async ({ token, accountId }: { token: string; accountId: string }) => {
    const result = await permissionsService.getPermissionsByAccountId(token, accountId);
    return result.data;
  }
);

export const fetchAllPermissions = createAsyncThunk(
  'permissions/fetchAll',
  async (token: string) => {
    const result = await permissionsService.getAllPermissions(token);
    return result.data;
  }
);

export const updateAccountPermissions = createAsyncThunk(
  'permissions/updateAccount',
  async ({ token, permissions }: { token: string; permissions: Array<{ accountId: string; menuId: string; permissionId: string; status: boolean }> }) => {
    const result = await permissionsService.updateAccountPermissions(token, permissions);
    return result.data;
  }
);

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    accountPermissions: [] as any[],
    allPermissions: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearAccountPermissions: (state) => {
      state.accountPermissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.accountPermissions = action.payload;
      })
      .addCase(fetchAccountPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permissions';
      })
      .addCase(fetchAllPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.allPermissions = action.payload;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch all permissions';
      })
      .addCase(updateAccountPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccountPermissions.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAccountPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update permissions';
      });
  },
});

export const { clearAccountPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
