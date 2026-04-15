import { describe, it, expect, beforeEach } from "vitest";
import { VillageServiceMock } from "../mock/village.mock";

describe("VillageServiceMock", () => {
  let service: VillageServiceMock;

  beforeEach(() => {
    service = new VillageServiceMock();
  });

  describe("getById", () => {
    it("should return village profile", async () => {
      const res = await service.getById("village-1");
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
    });
  });

  describe("update", () => {
    it("should update and return village", async () => {
      const res = await service.update("village-1", { name: "Updated Village" } as never);
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
    });
  });

  describe("uploadGallery", () => {
    it("should return mock gallery data", async () => {
      const res = await service.uploadGallery("village-1", new FormData());
      expect(res.success).toBe(true);
      expect(res.data.id).toBeDefined();
      expect(res.data.url).toBeDefined();
    });
  });
});
