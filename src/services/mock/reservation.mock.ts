import type { Reservation } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import type { IReservationService } from "../reservation.service";
import { ACCOMMODATION_RESERVATIONS } from "@/features/accommodation/mock-data";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

function paginate<T>(items: T[], params?: QueryParams): PaginatedResponse<T> {
  const page = params?.page ? Number(params.page) : 1;
  const pageSize = params?.limit ? Number(params.limit) : 10;
  const start = (page - 1) * pageSize;
  return {
    success: true,
    data: items.slice(start, start + pageSize),
    meta: { total: items.length, page, pageSize, totalPages: Math.ceil(items.length / pageSize) },
  };
}

export class ReservationServiceMock implements IReservationService {
  private items = [...ACCOMMODATION_RESERVATIONS];

  async getPartnerReservations(params?: QueryParams): Promise<PaginatedResponse<Reservation>> {
    await delay(100);
    let filtered = [...this.items];
    if (params?.status) {
      filtered = filtered.filter((r) => r.status === params.status);
    }
    return paginate(filtered, params);
  }

  async getById(id: string): Promise<ApiResponse<Reservation>> {
    await delay(80);
    const item = this.items.find((r) => r.id === id);
    if (!item) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    return { success: true, data: item, message: "OK" };
  }

  async updateStatus(id: string, status: string): Promise<ApiResponse<Reservation>> {
    await delay(150);
    const idx = this.items.findIndex((r) => r.id === id);
    if (idx === -1) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    this.items[idx] = { ...this.items[idx], status: status as Reservation["status"] };
    return { success: true, data: this.items[idx], message: "Status updated" };
  }
}
