import { describe, it, expect, beforeEach } from "vitest";
import { AccommodationServiceMock } from "../mock/accommodation.mock";

describe("AccommodationServiceMock", () => {
  let service: AccommodationServiceMock;

  beforeEach(() => {
    service = new AccommodationServiceMock();
  });

  describe("getMyAccommodations", () => {
    it("should return paginated list", async () => {
      const res = await service.getMyAccommodations();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.meta).toBeDefined();
      expect(res.meta.total).toBeGreaterThanOrEqual(0);
      expect(res.meta.page).toBe(1);
    });

    it("should respect pagination params", async () => {
      const res = await service.getMyAccommodations({ page: 1, limit: 1 });
      expect(res.data.length).toBeLessThanOrEqual(1);
      expect(res.meta.pageSize).toBe(1);
    });
  });

  describe("getById", () => {
    it("should return accommodation by id", async () => {
      const list = await service.getMyAccommodations();
      if (list.data.length > 0) {
        const first = list.data[0];
        const res = await service.getById(first.id);
        expect(res.success).toBe(true);
        expect(res.data.id).toBe(first.id);
      }
    });

    it("should throw for non-existent id", async () => {
      await expect(service.getById("non-existent")).rejects.toMatchObject({
        success: false,
        status: 404,
      });
    });
  });

  describe("create", () => {
    it("should create and return new accommodation", async () => {
      const res = await service.create({ name: "Test Homestay" });
      expect(res.success).toBe(true);
      expect(res.data.name).toBe("Test Homestay");
      expect(res.data.id).toBeDefined();
    });
  });

  describe("update", () => {
    it("should update existing accommodation", async () => {
      const list = await service.getMyAccommodations();
      if (list.data.length > 0) {
        const id = list.data[0].id;
        const res = await service.update(id, { name: "Updated" });
        expect(res.success).toBe(true);
        expect(res.data.name).toBe("Updated");
      }
    });

    it("should throw for non-existent id", async () => {
      await expect(service.update("non-existent", { name: "x" })).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe("submit", () => {
    it("should submit accommodation for review", async () => {
      const list = await service.getMyAccommodations();
      if (list.data.length > 0) {
        const res = await service.submit(list.data[0].id);
        expect(res.success).toBe(true);
      }
    });
  });

  describe("remove", () => {
    it("should remove without error", async () => {
      const list = await service.getMyAccommodations();
      if (list.data.length > 0) {
        await expect(service.remove(list.data[0].id)).resolves.toBeUndefined();
      }
    });
  });
});
