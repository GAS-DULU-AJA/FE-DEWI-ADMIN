import type { Accommodation } from "@/features/accommodation/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient } from "./api-client";

export interface IAccommodationService {
  getMyAccommodations(params?: QueryParams): Promise<PaginatedResponse<Accommodation>>;
  getById(id: string): Promise<ApiResponse<Accommodation>>;
  create(dto: Partial<Accommodation>): Promise<ApiResponse<Accommodation>>;
  update(id: string, dto: Partial<Accommodation>): Promise<ApiResponse<Accommodation>>;
  submit(id: string): Promise<ApiResponse<Accommodation>>;
  remove(id: string): Promise<void>;
}

export class AccommodationService implements IAccommodationService {
  async getMyAccommodations(params?: QueryParams): Promise<PaginatedResponse<Accommodation>> {
    return apiClient<PaginatedResponse<Accommodation>>("/accommodations/my", { params });
  }

  async getById(id: string): Promise<ApiResponse<Accommodation>> {
    return apiClient<ApiResponse<Accommodation>>(`/accommodations/${id}`);
  }

  async create(dto: Partial<Accommodation>): Promise<ApiResponse<Accommodation>> {
    return apiClient<ApiResponse<Accommodation>>("/accommodations", {
      method: "POST",
      body: dto,
    });
  }

  async update(id: string, dto: Partial<Accommodation>): Promise<ApiResponse<Accommodation>> {
    return apiClient<ApiResponse<Accommodation>>(`/accommodations/${id}`, {
      method: "PUT",
      body: dto,
    });
  }

  async submit(id: string): Promise<ApiResponse<Accommodation>> {
    return apiClient<ApiResponse<Accommodation>>(`/accommodations/${id}/submit`, {
      method: "PATCH",
    });
  }

  async remove(id: string): Promise<void> {
    await apiClient(`/accommodations/${id}`, { method: "DELETE" });
  }
}
