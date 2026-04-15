import { describe, it, expect, beforeEach } from "vitest";
import { ReviewServiceMock } from "../mock/review.mock";

describe("ReviewServiceMock", () => {
  let service: ReviewServiceMock;

  beforeEach(() => {
    service = new ReviewServiceMock();
  });

  describe("getAll", () => {
    it("should return paginated reviews", async () => {
      const res = await service.getAll();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.meta).toBeDefined();
      expect(res.meta.total).toBeGreaterThan(0);
    });

    it("should respect pagination params", async () => {
      const res = await service.getAll({ page: 1, limit: 1 });
      expect(res.data.length).toBeLessThanOrEqual(1);
    });
  });

  describe("reply", () => {
    it("should add reply to review", async () => {
      const list = await service.getAll();
      if (list.data.length > 0) {
        const id = list.data[0].id;
        const res = await service.reply(id, "Thank you for your review");
        expect(res.success).toBe(true);
        expect(res.data.comment).toContain("Thank you for your review");
      }
    });

    it("should throw for non-existent review", async () => {
      await expect(service.reply("non-existent", "reply")).rejects.toMatchObject({
        status: 404,
      });
    });
  });
});
