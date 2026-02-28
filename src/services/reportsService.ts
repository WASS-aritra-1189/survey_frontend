import { BaseUrl } from '@/config/BaseUrl';

export const reportsService = {
  getWeeklyResponses: async (token: string) => {
    const response = await fetch(`${BaseUrl}/reports/weekly-responses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch weekly responses');
    return response.json();
  },

  getTopSurveys: async (token: string) => {
    const response = await fetch(`${BaseUrl}/reports/top-surveys`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch top surveys');
    return response.json();
  },

  getUserActivity: async (token: string) => {
    const response = await fetch(`${BaseUrl}/reports/user-activity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user activity');
    return response.json();
  },
};
