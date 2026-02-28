import { BaseUrl } from "@/config/BaseUrl";

export const designationService = {
  getAll: async (token: string) => {
    const response = await fetch(`${BaseUrl}/designations`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch designations");
    }

    return response.json();
  },

  create: async (token: string, data: { name: string; description: string; priority: number; status: string; settingId: string }) => {
    const response = await fetch(`${BaseUrl}/designations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create designation");
    }

    return result;
  },

  update: async (token: string, id: string, data: { name: string; description: string; priority: number; status: string; settingId: string }) => {
    const response = await fetch(`${BaseUrl}/designations/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update designation");
    }

    return result;
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${BaseUrl}/designations/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete designation");
    }

    return result;
  },
};
