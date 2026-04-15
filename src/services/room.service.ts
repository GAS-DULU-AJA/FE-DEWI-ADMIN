import type { Room } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient, apiUpload } from "./api-client";

export interface IRoomService {
  getByAccommodation(accommodationId: string, params?: QueryParams): Promise<PaginatedResponse<Room>>;
  getById(id: string): Promise<ApiResponse<Room>>;
  create(dto: Partial<Room>): Promise<ApiResponse<Room>>;
  update(id: string, dto: Partial<Room>): Promise<ApiResponse<Room>>;
  remove(id: string): Promise<void>;
  uploadImage(roomId: string, formData: FormData): Promise<ApiResponse<{ id: string; url: string }>>;
  removeImage(roomId: string, imageId: string): Promise<void>;
  addAmenity(roomId: string, amenityId: string): Promise<void>;
  removeAmenity(roomId: string, amenityId: string): Promise<void>;
}

export class RoomService implements IRoomService {
  async getByAccommodation(accommodationId: string, params?: QueryParams): Promise<PaginatedResponse<Room>> {
    return apiClient<PaginatedResponse<Room>>("/rooms", {
      params: { accommodationId, ...params },
    });
  }

  async getById(id: string): Promise<ApiResponse<Room>> {
    return apiClient<ApiResponse<Room>>(`/rooms/${id}`);
  }

  async create(dto: Partial<Room>): Promise<ApiResponse<Room>> {
    return apiClient<ApiResponse<Room>>("/rooms", { method: "POST", body: dto });
  }

  async update(id: string, dto: Partial<Room>): Promise<ApiResponse<Room>> {
    return apiClient<ApiResponse<Room>>(`/rooms/${id}`, { method: "PUT", body: dto });
  }

  async remove(id: string): Promise<void> {
    await apiClient(`/rooms/${id}`, { method: "DELETE" });
  }

  async uploadImage(roomId: string, formData: FormData): Promise<ApiResponse<{ id: string; url: string }>> {
    return apiUpload(`/rooms/${roomId}/images`, formData);
  }

  async removeImage(roomId: string, imageId: string): Promise<void> {
    await apiClient(`/rooms/${roomId}/images/${imageId}`, { method: "DELETE" });
  }

  async addAmenity(roomId: string, amenityId: string): Promise<void> {
    await apiClient(`/rooms/${roomId}/amenities/${amenityId}`, { method: "POST" });
  }

  async removeAmenity(roomId: string, amenityId: string): Promise<void> {
    await apiClient(`/rooms/${roomId}/amenities/${amenityId}`, { method: "DELETE" });
  }
}
