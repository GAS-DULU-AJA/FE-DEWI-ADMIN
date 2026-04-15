import { describe, it, expect, beforeEach } from "vitest";
import { NotificationServiceMock } from "../mock/notification.mock";

describe("NotificationServiceMock", () => {
  let service: NotificationServiceMock;

  beforeEach(() => {
    service = new NotificationServiceMock();
  });

  describe("getAll", () => {
    it("should return paginated notifications", async () => {
      const res = await service.getAll();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.meta).toBeDefined();
    });
  });

  describe("getUnreadCount", () => {
    it("should return count object", async () => {
      const res = await service.getUnreadCount();
      expect(res.success).toBe(true);
      expect(typeof res.data.count).toBe("number");
    });
  });

  describe("markAsRead", () => {
    it("should return updated notification", async () => {
      const res = await service.markAsRead("notif-1");
      expect(res.success).toBe(true);
      expect(res.data.isRead).toBe(true);
    });
  });

  describe("markAllAsRead", () => {
    it("should resolve without error", async () => {
      await expect(service.markAllAsRead()).resolves.toBeUndefined();
    });
  });
});
