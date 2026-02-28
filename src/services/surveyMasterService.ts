import { BaseUrl } from "@/config/BaseUrl";
import { SurveyMastersResponse } from "@/types/surveyMaster";

export const surveyMasterService = {
  getAll: async (limit: number = 15, page: number = 1, token: string): Promise<SurveyMastersResponse> => {
    const response = await fetch(`${BaseUrl}/survey-masters?limit=${limit}&page=${page}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch survey masters");
    }

    return response.json();
  },

  getById: async (id: string, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-masters/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch survey master");
    }

    return response.json();
  },

  create: async (data: { loginId: string; password: string; surveyLimit: number; settingId?: string }, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-masters`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create survey master");
    }

    return response.json();
  },

  updateStatus: async (id: string, status: string, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-masters/${id}/status`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    return response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-masters/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete survey master");
    }

    return response.json();
  },

  update: async (id: string, data: { loginId?: string; password?: string; surveyLimit?: number; settingId?: string }, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-masters/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update survey master");
    }

    return response.json();
  },

  resetPassword: async (id: string, data: { oldPassword: string; newPassword: string; confirmPassword: string }, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-masters/${id}/reset-password`, {
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
};
