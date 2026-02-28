import { BaseUrl } from "@/config/BaseUrl";

export const dashboardService = {
  getStats: async (token: string) => {
    const response = await fetch(`${BaseUrl}/dashboard/stats`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return response.json();
  },
};
