import { describe, it, expect, beforeEach } from "vitest";
import { RoomServiceMock } from "../mock/room.mock";

describe("RoomServiceMock", () => {
  let service: RoomServiceMock;

  beforeEach(() => {
    service = new RoomServiceMock();
  });

  describe("getByAccommodation", () => {
    it("should return paginated rooms for accommodation", async () => {
      const res = await service.getByAccommodation("acc-1");
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.meta).toBeDefined();
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
    it("should create new room", async () => {
      const res = await service.create({ name: "Test Room", accommodationId: "acc-1" });
      expect(res.success).toBe(true);
      expect(res.data.name).toBe("Test Room");
      expect(res.data.id).toBeDefined();
    });
  });

  describe("update", () => {
    it("should throw for non-existent room", async () => {
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
    it("should return mock image url", async () => {
      const res = await service.uploadImage("room-1", new FormData());
      expect(res.success).toBe(true);
      expect(res.data.url).toBeDefined();
      expect(res.data.id).toBeDefined();
    });
  });

  describe("removeImage", () => {
    it("should resolve without error", async () => {
      await expect(service.removeImage("room-1", "img-1")).resolves.toBeUndefined();
    });
  });

  describe("addAmenity", () => {
    it("should resolve without error", async () => {
      await expect(service.addAmenity("room-1", "amenity-1")).resolves.toBeUndefined();
    });
  });

  describe("removeAmenity", () => {
    it("should resolve without error", async () => {
      await expect(service.removeAmenity("room-1", "amenity-1")).resolves.toBeUndefined();
    });
  });
});
