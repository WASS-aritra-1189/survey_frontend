import { BaseUrl } from "@/config/BaseUrl";

export interface Device {
  id: string;
  deviceName: string;
  deviceId: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "DELETED";
  battery: number;
  location: string;
  assignedTo: string | null;
  surveyMaster: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceListResponse {
  success: boolean;
  data: {
    data: Device[];
    total: number;
  };
}

export interface DeviceResponse {
  success: boolean;
  data: Device;
}

export interface CreateDeviceData {
  deviceName: string;
  deviceId: string;
  battery: number;
  location: string;
}

export const deviceService = {
  getAll: async (token: string): Promise<DeviceListResponse> => {
    const response = await fetch(`${BaseUrl}/devices`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch devices");
    }

    return result;
  },

  create: async (token: string, data: CreateDeviceData): Promise<{ success: boolean }> => {
    const response = await fetch(`${BaseUrl}/devices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create device");
    }

    return result;
  },

  getById: async (token: string, id: string): Promise<DeviceResponse> => {
    const response = await fetch(`${BaseUrl}/devices/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch device");
    }

    return result;
  },

  update: async (token: string, id: string, data: Partial<CreateDeviceData>): Promise<{ success: boolean }> => {
    const response = await fetch(`${BaseUrl}/devices/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update device");
    }

    return result;
  },

  updateStatus: async (token: string, id: string, status: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${BaseUrl}/devices/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update device status");
    }

    return result;
  },

  assignDevice: async (token: string, id: string, surveyMasterId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${BaseUrl}/devices/${id}/assign`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyMasterId }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to assign device");
    }

    return result;
  },

  unassignDevice: async (token: string, id: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${BaseUrl}/devices/${id}/unassign`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to unassign device");
    }

    return result;
  },

  delete: async (token: string, id: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${BaseUrl}/devices/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete device");
    }

    return result;
  },
};
