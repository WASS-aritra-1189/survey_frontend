import { BaseUrl } from "@/config/BaseUrl";
import { Survey, SurveyResponse, SurveyListResponse } from "@/types/survey";

export const surveyService = {
  getAll: async (token: string, limit: number = 50, page: number = 1): Promise<SurveyListResponse> => {
    const response = await fetch(`${BaseUrl}/surveys?limit=${limit}&page=${page}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch surveys");
    }

    return response.json();
  },

  getById: async (token: string, id: string): Promise<SurveyResponse> => {
    const response = await fetch(`${BaseUrl}/surveys/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch survey");
    }

    return response.json();
  },

  create: async (data: Survey, token: string): Promise<SurveyResponse> => {
    const response = await fetch(`${BaseUrl}/surveys`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create survey");
    }

    return response.json();
  },

  update: async (id: string, data: Partial<Survey>, token: string): Promise<SurveyResponse> => {
    const response = await fetch(`${BaseUrl}/surveys/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update survey");
    }

    return response.json();
  },

  delete: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${BaseUrl}/surveys/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        
      },
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete survey");
    }
  },

  updateStatus: async (id: string, status: string, token: string): Promise<SurveyResponse> => {
    const response = await fetch(`${BaseUrl}/surveys/${id}/status`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update survey status");
    }

    return result;
  },

  bulkAssign: async (id: string, surveyMasterIds: string[], token: string): Promise<{ success: boolean; message?: string }> => {
    const response = await fetch(`${BaseUrl}/surveys/${id}/bulk-assign`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyMasterIds }),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to assign survey");
    }

    return result;
  },

  assignWithLocation: async (id: string, surveyMasterId: string, locationConstraint: any, token: string) => {
    const response = await fetch(`${BaseUrl}/surveys/${id}/assign`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyMasterId, locationConstraint }),
    });

    if (!response.ok) {
      throw new Error("Failed to assign survey");
    }

    return response.json();
  },

  getLocationConstraint: async (surveyId: string, surveyMasterId: string, token: string) => {
    const response = await fetch(`${BaseUrl}/surveys/${surveyId}/location/${surveyMasterId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch location constraint");
    }

    return response.json();
  },

  updateLocationConstraint: async (surveyId: string, surveyMasterId: string, constraint: any, token: string) => {
    const response = await fetch(`${BaseUrl}/surveys/${surveyId}/location/${surveyMasterId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(constraint),
    });

    if (!response.ok) {
      throw new Error("Failed to update location constraint");
    }

    return response.json();
  },

  removeLocationConstraint: async (surveyId: string, surveyMasterId: string, token: string) => {
    const response = await fetch(`${BaseUrl}/surveys/${surveyId}/location/${surveyMasterId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove location constraint");
    }

    return response.json();
  },

  getQuestions: async (token: string, surveyId: string) => {
    const response = await fetch(`${BaseUrl}/surveys/${surveyId}/questions`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    return response.json();
  },
};
