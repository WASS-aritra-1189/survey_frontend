import { BaseUrl } from "@/config/BaseUrl";

export interface SurveyType {
  id: string;
  name: string;
  isActive: boolean;
  templateQuestions?: any[];
  surveyCount?: number;
}

export const surveyTypeService = {
  getAll: async (token: string) => {
    const response = await fetch(`${BaseUrl}/survey-types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch survey types");
    return response.json();
  },

  create: async (data: { name: string; templateQuestions?: any[] }, token: string) => {
    console.log('Service sending:', JSON.stringify(data, null, 2));
    const response = await fetch(`${BaseUrl}/survey-types`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create survey type");
    return response.json();
  },

  update: async (id: string, data: { name?: string; templateQuestions?: any[] }, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-types/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update survey type");
    return response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-types/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete survey type");
    return response.json();
  },

  updateStatus: async (id: string, isActive: boolean, token: string) => {
    const response = await fetch(`${BaseUrl}/survey-types/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) throw new Error("Failed to update status");
    return response.json();
  },
};
