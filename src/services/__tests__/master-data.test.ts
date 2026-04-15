import { describe, it, expect, beforeEach } from "vitest";
import { MasterDataServiceMock } from "../mock/master-data.mock";

describe("MasterDataServiceMock", () => {
  let service: MasterDataServiceMock;

  beforeEach(() => {
    service = new MasterDataServiceMock();
  });

  describe("getByType", () => {
    it("should return items for valid type", async () => {
      const res = await service.getByType("provinces");
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it("should return empty array for unknown type", async () => {
      const res = await service.getByType("non-existent-type");
      expect(res.success).toBe(true);
      expect(res.data).toEqual([]);
    });

    const types = ["provinces", "accommodation-types", "room-types", "amenities", "product-categories", "experience-categories"];
    for (const type of types) {
      it(`should return data for type: ${type}`, async () => {
        const res = await service.getByType(type);
        expect(res.success).toBe(true);
        expect(res.data.length).toBeGreaterThan(0);
        for (const item of res.data) {
          expect(item.id).toBeDefined();
          expect(item.name).toBeDefined();
        }
      });
    }
  });

  describe("getById", () => {
    it("should return item for valid id", async () => {
      const list = await service.getByType("provinces");
      if (list.data.length > 0) {
        const res = await service.getById("provinces", list.data[0].id);
        expect(res.success).toBe(true);
        expect(res.data.id).toBe(list.data[0].id);
      }
    });

    it("should throw for non-existent item", async () => {
      await expect(service.getById("provinces", "non-existent")).rejects.toMatchObject({
        status: 404,
      });
    });
  });
});
