export enum UserRole {
  ROOT = 'ROOT',
  ROOT_STAFF = 'ROOT_STAFF',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER = 'USER',
}

export interface Account {
  id: string;
  loginId: string;
  password: string;
  roles: UserRole;
  status: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  messageId: string;
  messageType: string;
  data: {
    account: Account;
    tokens: Tokens;
  };
}

export interface LoginRequest {
  loginId: string;
  password: string;
  role: UserRole;
}
