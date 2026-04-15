import { describe, it, expect, beforeEach } from "vitest";
import { SmeServiceMock } from "../mock/sme.mock";

describe("SmeServiceMock", () => {
  let service: SmeServiceMock;

  beforeEach(() => {
    service = new SmeServiceMock();
  });

  describe("getProfile", () => {
    it("should return SME profile", async () => {
      const res = await service.getProfile("sme-1");
      expect(res.success).toBe(true);
      expect(res.data.businessName).toBeDefined();
      expect(res.data.id).toBeDefined();
    });
  });

  describe("createProfile", () => {
    it("should create and return profile", async () => {
      const res = await service.createProfile({ businessName: "New SME" });
      expect(res.success).toBe(true);
      expect(res.data.businessName).toBe("New SME");
    });
  });

  describe("updateProfile", () => {
    it("should update profile fields", async () => {
      const res = await service.updateProfile("sme-1", { businessName: "Updated SME" });
      expect(res.success).toBe(true);
      expect(res.data.businessName).toBe("Updated SME");
    });
  });

  describe("getProducts", () => {
    it("should return paginated products", async () => {
      const res = await service.getProducts();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.meta).toBeDefined();
    });

    it("should filter by search keyword", async () => {
      const all = await service.getProducts();
      if (all.data.length > 0) {
        const name = all.data[0].name;
        const keyword = name.split(" ")[0];
        const res = await service.getProducts({ search: keyword });
        expect(res.data.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("getProduct", () => {
    it("should throw for non-existent product", async () => {
      await expect(service.getProduct("non-existent")).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe("createProduct", () => {
    it("should create and return product", async () => {
      const res = await service.createProduct({ name: "New Product", price: 10000 });
      expect(res.success).toBe(true);
      expect(res.data.name).toBe("New Product");
      expect(res.data.id).toBeDefined();
    });
  });

  describe("updateProduct", () => {
    it("should throw for non-existent product", async () => {
      await expect(service.updateProduct("non-existent", { name: "x" })).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe("deleteProduct", () => {
    it("should resolve without error", async () => {
      await expect(service.deleteProduct("any-id")).resolves.toBeUndefined();
    });
  });
});
