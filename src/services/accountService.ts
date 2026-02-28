import { BaseUrl } from "@/config/BaseUrl";

export const accountService = {
  getAll: async (token: string, params: { page?: number; limit?: number; search?: string; roles?: string[] }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.roles) {
      params.roles.forEach(role => searchParams.append('roles', role));
    }
    
    const response = await fetch(`${BaseUrl}/accounts?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }

    return response.json();
  },

  resetPassword: async (token: string, id: string, data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    const response = await fetch(`${BaseUrl}/accounts/${id}/reset-password`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to reset password");
    }

    return result;
  },

  changeStatus: async (token: string, id: string, status: string) => {
    const response = await fetch(`${BaseUrl}/accounts/${id}/status/${status}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        // "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to change status");
    }

    return result;
  },

  update: async (token: string, id: string, data: { loginId: string }) => {
    const response = await fetch(`${BaseUrl}/accounts/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update account");
    }

    return result;
  },
};
