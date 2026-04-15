import type { Room } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import type { IRoomService } from "../room.service";
import { ACCOMMODATION_ROOMS } from "@/features/accommodation/mock-data";

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

export class RoomServiceMock implements IRoomService {
  private items = [...ACCOMMODATION_ROOMS];

  async getByAccommodation(accommodationId: string, params?: QueryParams): Promise<PaginatedResponse<Room>> {
    await delay(100);
    const filtered = this.items.filter((r) => r.accommodationId === accommodationId);
    return paginate(filtered, params);
  }

  async getById(id: string): Promise<ApiResponse<Room>> {
    await delay(80);
    const item = this.items.find((r) => r.id === id);
    if (!item) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    return { success: true, data: item, message: "OK" };
  }

  async create(dto: Partial<Room>): Promise<ApiResponse<Room>> {
    await delay(150);
    const newItem = { ...dto, id: "room-" + Date.now() } as Room;
    this.items.push(newItem);
    return { success: true, data: newItem, message: "Created" };
  }

  async update(id: string, dto: Partial<Room>): Promise<ApiResponse<Room>> {
    await delay(120);
    const idx = this.items.findIndex((r) => r.id === id);
    if (idx === -1) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    this.items[idx] = { ...this.items[idx], ...dto };
    return { success: true, data: this.items[idx], message: "Updated" };
  }

  async remove(id: string): Promise<void> {
    await delay(100);
    const idx = this.items.findIndex((r) => r.id === id);
    if (idx !== -1) this.items.splice(idx, 1);
  }

  async uploadImage(_roomId: string, _formData: FormData): Promise<ApiResponse<{ id: string; url: string }>> {
    await delay(200);
    return { success: true, data: { id: "img-" + Date.now(), url: "/mock-room-image.jpg" }, message: "Uploaded" };
  }

  async removeImage(_roomId: string, _imageId: string): Promise<void> {
    await delay(100);
  }

  async addAmenity(_roomId: string, _amenityId: string): Promise<void> {
    await delay(80);
  }

  async removeAmenity(_roomId: string, _amenityId: string): Promise<void> {
    await delay(80);
  }
}
