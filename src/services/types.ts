// Shared API types used across all services

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  status: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: import("@/types").User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: import("@/types").PartnerRole;
  organizationName?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}
