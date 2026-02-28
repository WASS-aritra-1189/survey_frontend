import { BaseUrl } from "@/config/BaseUrl";

export const staffService = {
  register: async (token: string, data: {
    loginId: string;
    password: string;
    roleIds: string;
    settingId: string;
    accountLevelId: string;
  }) => {
    const response = await fetch(`${BaseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to register staff");
    }

    return result;
  },

  getAccountLevels: async (token: string) => {
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
};
