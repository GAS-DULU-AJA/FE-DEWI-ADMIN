import type { User } from "@/types";
import type {
  ApiResponse,
  AuthResponse,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
} from "./types";
import { apiClient, setAccessToken } from "./api-client";

export interface IAuthService {
  login(dto: LoginDto): Promise<ApiResponse<AuthResponse>>;
  register(dto: RegisterDto): Promise<ApiResponse<AuthResponse>>;
  logout(): Promise<void>;
  refresh(dto: RefreshTokenDto): Promise<ApiResponse<AuthResponse>>;
  getMe(): Promise<ApiResponse<User>>;
  updateMe(dto: Partial<User>): Promise<ApiResponse<User>>;
}

export class AuthService implements IAuthService {
  async login(dto: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient<ApiResponse<AuthResponse>>("/auth/login", {
      method: "POST",
      body: dto,
    });
    setAccessToken(res.data.accessToken);
    return res;
  }

  async register(dto: RegisterDto): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient<ApiResponse<AuthResponse>>("/auth/register", {
      method: "POST",
      body: dto,
    });
    setAccessToken(res.data.accessToken);
    return res;
  }

  async logout(): Promise<void> {
    await apiClient("/auth/logout", { method: "POST" });
    setAccessToken(null);
  }

  async refresh(dto: RefreshTokenDto): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient<ApiResponse<AuthResponse>>("/auth/refresh", {
      method: "POST",
      body: dto,
    });
    setAccessToken(res.data.accessToken);
    return res;
  }

  async getMe(): Promise<ApiResponse<User>> {
    return apiClient<ApiResponse<User>>("/users/me");
  }

  async updateMe(dto: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient<ApiResponse<User>>("/users/me", {
      method: "PUT",
      body: dto,
    });
  }
}
