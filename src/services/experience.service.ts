import type { Event } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient, apiUpload } from "./api-client";

export interface IExperienceService {
  getAll(params?: QueryParams): Promise<PaginatedResponse<Event>>;
  getById(id: string): Promise<ApiResponse<Event>>;
  create(dto: Partial<Event>): Promise<ApiResponse<Event>>;
  update(id: string, dto: Partial<Event>): Promise<ApiResponse<Event>>;
  remove(id: string): Promise<void>;
  uploadImage(id: string, formData: FormData): Promise<ApiResponse<{ id: string; url: string }>>;
  removeImage(id: string, imageId: string): Promise<void>;
}

export class ExperienceService implements IExperienceService {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Event>> {
    return apiClient<PaginatedResponse<Event>>("/experiences", { params });
  }

  async getById(id: string): Promise<ApiResponse<Event>> {
    return apiClient<ApiResponse<Event>>(`/experiences/${id}`);
  }

  async create(dto: Partial<Event>): Promise<ApiResponse<Event>> {
    return apiClient<ApiResponse<Event>>("/experiences", { method: "POST", body: dto });
  }

  async update(id: string, dto: Partial<Event>): Promise<ApiResponse<Event>> {
    return apiClient<ApiResponse<Event>>(`/experiences/${id}`, { method: "PUT", body: dto });
  }

  async remove(id: string): Promise<void> {
    await apiClient(`/experiences/${id}`, { method: "DELETE" });
  }

  async uploadImage(id: string, formData: FormData): Promise<ApiResponse<{ id: string; url: string }>> {
    return apiUpload(`/experiences/${id}/images`, formData);
  }

  async removeImage(id: string, imageId: string): Promise<void> {
    await apiClient(`/experiences/${id}/images/${imageId}`, { method: "DELETE" });
  }
}
