import { BaseUrl } from "@/config/BaseUrl";

export const permissionsService = {
  getPermissionsByAccountId: async (token: string, accountId: string) => {
    const response = await fetch(`${BaseUrl}/account-permissions/${accountId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch permissions");
    }

    return result;
  },

  getAllPermissions: async (token: string) => {
    const response = await fetch(`${BaseUrl}/permissions`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch permissions");
    }

    return result;
  },

  updateAccountPermissions: async (token: string, permissions: Array<{ accountId: string; menuId: string; permissionId: string; status: boolean }>) => {
    const response = await fetch(`${BaseUrl}/account-permissions`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permissions),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update permissions");
    }

    return result;
  },
};
