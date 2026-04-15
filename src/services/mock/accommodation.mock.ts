import type { Accommodation } from "@/features/accommodation/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import type { IAccommodationService } from "../accommodation.service";
import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

function paginate<T>(items: T[], params?: QueryParams): PaginatedResponse<T> {
  const page = params?.page ? Number(params.page) : 1;
  const pageSize = params?.limit ? Number(params.limit) : 10;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return {
    success: true,
    data,
    meta: {
      total: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
    },
  };
}

export class AccommodationServiceMock implements IAccommodationService {
  private items = [...ACCOMMODATIONS];

  async getMyAccommodations(params?: QueryParams): Promise<PaginatedResponse<Accommodation>> {
    await delay(120);
    let filtered = this.items;
    if (params?.search) {
      const s = String(params.search).toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(s));
    }
    return paginate(filtered, params);
  }

  async getById(id: string): Promise<ApiResponse<Accommodation>> {
    await delay(80);
    const item = this.items.find((a) => a.id === id);
    if (!item) {
      throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    }
    return { success: true, data: item, message: "OK" };
  }

  async create(dto: Partial<Accommodation>): Promise<ApiResponse<Accommodation>> {
    await delay(200);
    const newItem = {
      ...dto,
      id: "acc-" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Accommodation;
    this.items.push(newItem);
    return { success: true, data: newItem, message: "Created" };
  }

  async update(id: string, dto: Partial<Accommodation>): Promise<ApiResponse<Accommodation>> {
    await delay(150);
    const idx = this.items.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    }
    this.items[idx] = { ...this.items[idx], ...dto, updatedAt: new Date().toISOString() };
    return { success: true, data: this.items[idx], message: "Updated" };
  }

  async submit(id: string): Promise<ApiResponse<Accommodation>> {
    await delay(150);
    const idx = this.items.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    }
    this.items[idx] = { ...this.items[idx], submissionStatus: "submitted" as never };
    return { success: true, data: this.items[idx], message: "Submitted for approval" };
  }

  async remove(id: string): Promise<void> {
    await delay(100);
    const idx = this.items.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    }
    this.items.splice(idx, 1);
  }
}
