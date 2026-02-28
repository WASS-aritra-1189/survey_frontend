import { BaseUrl } from "@/config/BaseUrl";

export const staffDetailService = {
  getAll: async (token: string, params: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    
    const response = await fetch(`${BaseUrl}/staff-details?${searchParams.toString()}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch staff details");
    }

    return response.json();
  },

  getOne: async (token: string, id: string) => {
    const response = await fetch(`${BaseUrl}/staff-details/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch staff detail");
    }

    return response.json();
  },

  update: async (token: string, id: string, data: any) => {
    const response = await fetch(`${BaseUrl}/staff-details/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update staff detail");
    }

    return result;
  },
};
