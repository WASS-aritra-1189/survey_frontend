import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuService } from '../services/menuService';

export const fetchMenus = createAsyncThunk(
  'menus/fetchAll',
  async ({ token, ...params }: { token: string; page?: number; limit?: number }) => {
    const result = await menuService.getAll(token, params);
    return result.data;
  }
);

export const createMenu = createAsyncThunk(
  'menus/create',
  async ({ token, data }: { token: string; data: { name: string; title: string; description: string } }) => {
    const result = await menuService.create(token, data);
    return result.data;
  }
);

export const updateMenu = createAsyncThunk(
  'menus/update',
  async ({ token, id, data }: { token: string; id: string; data: { name?: string; title?: string; description?: string } }) => {
    const result = await menuService.update(token, id, data);
    return result.data;
  }
);

export const updateMenuStatus = createAsyncThunk(
  'menus/updateStatus',
  async ({ token, id, status }: { token: string; id: string; status: string }) => {
    await menuService.updateStatus(token, id, status);
    return { id, status };
  }
);

export const deleteMenu = createAsyncThunk(
  'menus/delete',
  async ({ token, id }: { token: string; id: string }) => {
    await menuService.delete(token, id);
    return id;
  }
);

const menuSlice = createSlice({
  name: 'menus',
  initialState: {
    menus: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menus';
      })
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menus.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create menu';
      })
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.menus.findIndex((m: any) => m.id === action.payload.id);
        if (index !== -1) {
          state.menus[index] = action.payload;
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update menu';
      })
      .addCase(updateMenuStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuStatus.fulfilled, (state, action) => {
        state.loading = false;
        const menu = state.menus.find((m: any) => m.id === action.payload.id);
        if (menu) {
          (menu as any).status = action.payload.status;
        }
      })
      .addCase(updateMenuStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update status';
      })
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = state.menus.filter((m: any) => m.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete menu';
      });
  },
});

export default menuSlice.reducer;
