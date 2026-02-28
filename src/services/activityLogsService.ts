import { BaseUrl } from "@/config/BaseUrl";

export const activityLogsService = {
  getAll: async (token: string, params: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${BaseUrl}/activity-logs?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch activity logs");
    }

    return response.json();
  },
};
