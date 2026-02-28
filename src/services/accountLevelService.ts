import { BaseUrl } from "@/config/BaseUrl";

export const accountLevelService = {
  getAll: async (token: string) => {
    const response = await fetch(`${BaseUrl}/account-levels`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account levels");
    }

    return response.json();
  },

  create: async (token: string, data: { name: string; priority: number; settingId: string }) => {
    const response = await fetch(`${BaseUrl}/account-levels`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create account level");
    }

    return result;
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${BaseUrl}/account-levels/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete account level");
    }

    return result;
  },

  changeStatus: async (token: string, id: string, status: string) => {
    const response = await fetch(`${BaseUrl}/account-levels/${id}/${status}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to change status");
    }

    return result;
  },

  update: async (token: string, id: string, data: { name: string; priority: number; settingId: string }) => {
    const response = await fetch(`${BaseUrl}/account-levels/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update account level");
    }

    return result;
  },
};
