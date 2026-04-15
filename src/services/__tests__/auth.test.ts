import { describe, it, expect, beforeEach } from "vitest";
import { AuthServiceMock } from "../mock/auth.mock";

describe("AuthServiceMock", () => {
  let service: AuthServiceMock;

  beforeEach(() => {
    service = new AuthServiceMock();
  });

  describe("login", () => {
    it("should return auth response for valid credentials", async () => {
      const res = await service.login({ email: "hotel@dewi.id", password: "password123" });
      expect(res.success).toBe(true);
      expect(res.data.accessToken).toBeDefined();
      expect(res.data.refreshToken).toBeDefined();
      expect(res.data.user).toBeDefined();
      expect(res.data.user.email).toBe("hotel@dewi.id");
    });

    it("should throw for invalid credentials", async () => {
      await expect(service.login({ email: "wrong@email.com", password: "wrong" })).rejects.toMatchObject({
        success: false,
        status: 401,
      });
    });
  });

  describe("register", () => {
    it("should return auth response for new user", async () => {
      const res = await service.register({
        email: "new@dewi.id",
        password: "password123",
        fullName: "New User",
        phone: "081234567890",
        role: "ACCOMMODATION",
      });
      expect(res.success).toBe(true);
      expect(res.data.user.email).toBe("new@dewi.id");
      expect(res.data.accessToken).toBeDefined();
    });
  });

  describe("getMe", () => {
    it("should return current user data", async () => {
      const res = await service.getMe();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data.id).toBeDefined();
    });
  });

  describe("logout", () => {
    it("should resolve without error", async () => {
      await expect(service.logout()).resolves.toBeUndefined();
    });
  });

  describe("refreshToken", () => {
    it("should return new tokens", async () => {
      const res = await service.refresh({ refreshToken: "mock-refresh-token-abc" });
      expect(res.success).toBe(true);
      expect(res.data.accessToken).toBeDefined();
    });
  });

  describe("updateMe", () => {
    it("should return updated user", async () => {
      const res = await service.updateMe({ fullName: "Updated Name" });
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
    });
  });
});
