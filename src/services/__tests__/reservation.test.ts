import { describe, it, expect, beforeEach } from "vitest";
import { ReservationServiceMock } from "../mock/reservation.mock";

describe("ReservationServiceMock", () => {
  let service: ReservationServiceMock;

  beforeEach(() => {
    service = new ReservationServiceMock();
  });

  describe("getPartnerReservations", () => {
    it("should return paginated reservations", async () => {
      const res = await service.getPartnerReservations();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.meta).toBeDefined();
    });

    it("should filter by status", async () => {
      const res = await service.getPartnerReservations({ status: "pending" });
      expect(res.success).toBe(true);
      for (const item of res.data) {
        expect(item.status).toBe("pending");
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

  describe("updateStatus", () => {
    it("should update reservation status", async () => {
      const list = await service.getPartnerReservations();
      if (list.data.length > 0) {
        const id = list.data[0].id;
        const res = await service.updateStatus(id, "confirmed");
        expect(res.success).toBe(true);
        expect(res.data.status).toBe("confirmed");
      }
    });

    it("should throw for non-existent reservation", async () => {
      await expect(service.updateStatus("non-existent", "confirmed")).rejects.toMatchObject({
        status: 404,
      });
    });
  });
});
