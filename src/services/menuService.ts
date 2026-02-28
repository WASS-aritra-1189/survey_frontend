import { BaseUrl } from "@/config/BaseUrl";

export const menuService = {
  getAll: async (token: string, params: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${BaseUrl}/menu/list?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch menus");
    }

    return response.json();
  },

  create: async (token: string, data: { name: string; title: string; description: string }) => {
    const response = await fetch(`${BaseUrl}/menu`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create menu");
    }

    return result;
  },

  update: async (token: string, id: string, data: { name?: string; title?: string; description?: string }) => {
    const response = await fetch(`${BaseUrl}/menu/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update menu");
    }

    return result;
  },

  updateStatus: async (token: string, id: string, status: string) => {
    const response = await fetch(`${BaseUrl}/menu/${id}/${status}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update status");
    }

    return result;
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${BaseUrl}/menu/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete menu");
    }

    return result;
  },
};
