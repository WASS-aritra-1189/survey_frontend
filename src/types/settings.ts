export interface Setting {
  id: string;
  title: string;
  userDomain: string;
  adminDomain: string;
  mobileDomain: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  message: string;
  userSetting: Record<string, any>;
  adminSetting: Record<string, any>;
  mobileSetting: Record<string, any>;
  userMaintenanceMode: boolean;
  adminMaintenanceMode: boolean;
  mobileMaintenanceMode: boolean;
  userLoginLogo: string | null;
  adminLoginLogo: string | null;
  mobileLoginLogo: string | null;
  userRegisterLogo: string | null;
  adminRegisterLogo: string | null;
  mobileRegisterLogo: string | null;
  userLoginBackground: string | null;
  adminLoginBackground: string | null;
  mobileLoginBackground: string | null;
  userRegisterBackground: string | null;
  adminRegisterBackground: string | null;
  mobileRegisterBackground: string | null;
  accountLevel: number;
  multiDeviceLogin: boolean;
  currency: string;
  partnerCommissionType: string;
}

export interface SettingsResponse {
  success: boolean;
  messageId: string;
  messageType: string;
  data: {
    data: Setting[];
    total: number;
    page: number;
    limit: number;
  };
}
