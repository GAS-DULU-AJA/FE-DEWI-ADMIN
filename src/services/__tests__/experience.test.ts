import { describe, it, expect, beforeEach } from "vitest";
import { ExperienceServiceMock } from "../mock/experience.mock";

describe("ExperienceServiceMock", () => {
  let service: ExperienceServiceMock;

  beforeEach(() => {
    service = new ExperienceServiceMock();
  });

  describe("getAll", () => {
    it("should return paginated experiences", async () => {
      const res = await service.getAll();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.meta).toBeDefined();
    });

    it("should filter by search keyword", async () => {
      const all = await service.getAll();
      if (all.data.length > 0) {
        const name = all.data[0].name;
        const keyword = name.split(" ")[0];
        const res = await service.getAll({ search: keyword });
        expect(res.data.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("getById", () => {
    it("should throw for non-existent id", async () => {
      await expect(service.getById("non-existent")).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe("create", () => {
    it("should create and return new experience", async () => {
      const res = await service.create({ name: "Test Event" });
      expect(res.success).toBe(true);
      expect(res.data.name).toBe("Test Event");
      expect(res.data.id).toBeDefined();
    });
  });

  describe("update", () => {
    it("should throw for non-existent experience", async () => {
      await expect(service.update("non-existent", { name: "x" })).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe("remove", () => {
    it("should resolve without error", async () => {
      await expect(service.remove("any-id")).resolves.toBeUndefined();
    });
  });

  describe("uploadImage", () => {
    it("should return mock image data", async () => {
      const res = await service.uploadImage("exp-1", new FormData());
      expect(res.success).toBe(true);
      expect(res.data.url).toBeDefined();
    });
  });

  describe("removeImage", () => {
    it("should resolve without error", async () => {
      await expect(service.removeImage("exp-1", "img-1")).resolves.toBeUndefined();
    });
  });
});
