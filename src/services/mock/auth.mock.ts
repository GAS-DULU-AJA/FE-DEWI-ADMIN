import type { User } from "@/types";
import type {
  ApiResponse,
  AuthResponse,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
} from "../types";
import type { IAuthService } from "../auth.service";
import { DEMO_USERS } from "@/lib/constants";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

export class AuthServiceMock implements IAuthService {
  private currentUser: User | null = null;

  async login(dto: LoginDto): Promise<ApiResponse<AuthResponse>> {
    await delay(200);
    const found = DEMO_USERS.find(
      (u) => u.email === dto.email && u.password === dto.password
    );
    if (!found) {
      throw { success: false, message: "Invalid credentials", code: "UNAUTHORIZED", status: 401 };
    }
    const { password: _pw, ...user } = found;
    this.currentUser = user as User;
    return {
      success: true,
      data: {
        accessToken: "mock-access-token-" + user.id,
        refreshToken: "mock-refresh-token-" + user.id,
        user: user as User,
      },
      message: "Login successful",
    };
  }

  async register(dto: RegisterDto): Promise<ApiResponse<AuthResponse>> {
    await delay(300);
    const newUser: User = {
      id: "new-" + Date.now(),
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
      organizationName: dto.organizationName || "",
      address: "",
      isApproved: false,
      createdAt: new Date().toISOString(),
    };
    this.currentUser = newUser;
    return {
      success: true,
      data: {
        accessToken: "mock-access-token-" + newUser.id,
        refreshToken: "mock-refresh-token-" + newUser.id,
        user: newUser,
      },
      message: "Registration successful",
    };
  }

  async logout(): Promise<void> {
    await delay(50);
    this.currentUser = null;
  }

  async refresh(dto: RefreshTokenDto): Promise<ApiResponse<AuthResponse>> {
    await delay(100);
    if (!dto.refreshToken.startsWith("mock-refresh-token-")) {
      throw { success: false, message: "Invalid refresh token", code: "UNAUTHORIZED", status: 401 };
    }
    const user = this.currentUser || (DEMO_USERS[0] as unknown as User);
    return {
      success: true,
      data: {
        accessToken: "mock-access-token-refreshed",
        refreshToken: dto.refreshToken,
        user,
      },
      message: "Token refreshed",
    };
  }

  async getMe(): Promise<ApiResponse<User>> {
    await delay(80);
    const user = this.currentUser || {
      id: "demo-1",
      fullName: "Demo User",
      email: "demo@dewi.id",
      phone: "081234567890",
      role: "ACCOMMODATION" as const,
      organizationName: "Demo Homestay",
      address: "Jl. Demo",
      isApproved: true,
      createdAt: "2025-01-01T00:00:00Z",
    };
    return { success: true, data: user, message: "OK" };
  }

  async updateMe(dto: Partial<User>): Promise<ApiResponse<User>> {
    await delay(150);
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...dto };
    }
    return {
      success: true,
      data: this.currentUser || ({ ...dto, id: "demo-1" } as User),
      message: "Profile updated",
    };
  }
}
