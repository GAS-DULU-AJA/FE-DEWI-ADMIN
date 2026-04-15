import type { Event } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import type { IExperienceService } from "../experience.service";
import { EXPERIENCES } from "@/features/experience/mock-data";

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

export class ExperienceServiceMock implements IExperienceService {
  private items = [...EXPERIENCES] as unknown as Event[];

  async getAll(params?: QueryParams): Promise<PaginatedResponse<Event>> {
    await delay(100);
    let filtered = [...this.items];
    if (params?.search) {
      const s = String(params.search).toLowerCase();
      filtered = filtered.filter((e) => e.name.toLowerCase().includes(s));
    }
    return paginate(filtered, params);
  }

  async getById(id: string): Promise<ApiResponse<Event>> {
    await delay(80);
    const item = this.items.find((e) => e.id === id);
    if (!item) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    return { success: true, data: item, message: "OK" };
  }

  async create(dto: Partial<Event>): Promise<ApiResponse<Event>> {
    await delay(200);
    const newItem = { ...dto, id: "exp-" + Date.now() } as Event;
    this.items.push(newItem);
    return { success: true, data: newItem, message: "Created" };
  }

  async update(id: string, dto: Partial<Event>): Promise<ApiResponse<Event>> {
    await delay(150);
    const idx = this.items.findIndex((e) => e.id === id);
    if (idx === -1) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    this.items[idx] = { ...this.items[idx], ...dto };
    return { success: true, data: this.items[idx], message: "Updated" };
  }

  async remove(id: string): Promise<void> {
    await delay(100);
    const idx = this.items.findIndex((e) => e.id === id);
    if (idx !== -1) this.items.splice(idx, 1);
  }

  async uploadImage(_id: string, _formData: FormData): Promise<ApiResponse<{ id: string; url: string }>> {
    await delay(200);
    return { success: true, data: { id: "img-" + Date.now(), url: "/mock-event-image.jpg" }, message: "Uploaded" };
  }

  async removeImage(_id: string, _imageId: string): Promise<void> {
    await delay(100);
  }
}
