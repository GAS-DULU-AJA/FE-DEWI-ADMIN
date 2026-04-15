import { describe, it, expect, beforeEach } from "vitest";
import { ChatServiceMock } from "../mock/chat.mock";

describe("ChatServiceMock", () => {
  let service: ChatServiceMock;

  beforeEach(() => {
    service = new ChatServiceMock();
  });

  describe("getConversations", () => {
    it("should return conversations list", async () => {
      const res = await service.getConversations();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe("createConversation", () => {
    it("should create and return conversation", async () => {
      const res = await service.createConversation("user-2");
      expect(res.success).toBe(true);
      expect(res.data.id).toBeDefined();
    });
  });

  describe("getMessages", () => {
    it("should return messages list", async () => {
      const convos = await service.getConversations();
      if (convos.data.length > 0) {
        const res = await service.getMessages(convos.data[0].id);
        expect(res.success).toBe(true);
        expect(Array.isArray(res.data)).toBe(true);
      }
    });
  });

  describe("sendMessage", () => {
    it("should send and return message", async () => {
      const convos = await service.getConversations();
      if (convos.data.length > 0) {
        const res = await service.sendMessage(convos.data[0].id, "Hello");
        expect(res.success).toBe(true);
        expect(res.data.content).toBe("Hello");
      }
    });
  });

  describe("markAsRead", () => {
    it("should resolve without error", async () => {
      await expect(service.markAsRead("conv-1")).resolves.toBeUndefined();
    });
  });
});
