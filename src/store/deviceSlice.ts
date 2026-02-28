import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deviceService, Device, CreateDeviceData } from "@/services/deviceService";

interface DeviceState {
  data: Device[];
  total: number;
  selectedDevice: Device | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  data: [],
  total: 0,
  selectedDevice: null,
  isLoading: false,
  error: null,
};

export const fetchDevices = createAsyncThunk(
  "device/fetchDevices",
  async (token: string) => {
    const response = await deviceService.getAll(token);
    return response.data;
  }
);

export const createDevice = createAsyncThunk(
  "device/createDevice",
  async ({ token, data }: { token: string; data: CreateDeviceData }) => {
    await deviceService.create(token, data);
  }
);

export const fetchDeviceById = createAsyncThunk(
  "device/fetchDeviceById",
  async ({ token, id }: { token: string; id: string }) => {
    const response = await deviceService.getById(token, id);
    return response.data;
  }
);

export const updateDevice = createAsyncThunk(
  "device/updateDevice",
  async ({ token, id, data }: { token: string; id: string; data: Partial<CreateDeviceData> }) => {
    await deviceService.update(token, id, data);
  }
);

export const updateDeviceStatus = createAsyncThunk(
  "device/updateDeviceStatus",
  async ({ token, id, status }: { token: string; id: string; status: string }) => {
    await deviceService.updateStatus(token, id, status);
  }
);

export const assignDevice = createAsyncThunk(
  "device/assignDevice",
  async ({ token, id, surveyMasterId }: { token: string; id: string; surveyMasterId: string }) => {
    await deviceService.assignDevice(token, id, surveyMasterId);
  }
);

export const unassignDevice = createAsyncThunk(
  "device/unassignDevice",
  async ({ token, id }: { token: string; id: string }) => {
    await deviceService.unassignDevice(token, id);
  }
);

export const deleteDevice = createAsyncThunk(
  "device/deleteDevice",
  async ({ token, id }: { token: string; id: string }) => {
    await deviceService.delete(token, id);
  }
);

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch devices";
      })
      .addCase(createDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDevice.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create device";
      })
      .addCase(fetchDeviceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeviceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDevice = action.payload;
      })
      .addCase(fetchDeviceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch device";
      })
      .addCase(updateDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDevice.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update device";
      })
      .addCase(updateDeviceStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDeviceStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateDeviceStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update device status";
      })
      .addCase(assignDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignDevice.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(assignDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to assign device";
      })
      .addCase(unassignDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unassignDevice.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(unassignDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to unassign device";
      })
      .addCase(deleteDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDevice.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete device";
      });
  },
});

export default deviceSlice.reducer;
