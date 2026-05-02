import type { ApiResponse, QueryParams } from "./types";
import { apiClient, apiUpload } from "./api-client";
import type { WatermarkConfig } from "@/types";

export interface Village {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  latitude: number;
  longitude: number;
  status: string;
  gallery: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VillageGallery {
  id: string;
  url: string;
  caption?: string;
}

export interface IVillageService {
  getById(id: string): Promise<ApiResponse<Village>>;
  update(id: string, dto: Partial<Village>): Promise<ApiResponse<Village>>;
  uploadGallery(id: string, formData: FormData): Promise<ApiResponse<VillageGallery>>;
  getWatermarkConfig(): Promise<ApiResponse<WatermarkConfig>>;
}

export class VillageService implements IVillageService {
  async getById(id: string): Promise<ApiResponse<Village>> {
    return apiClient<ApiResponse<Village>>(`/villages/${id}`);
  }

  async update(id: string, dto: Partial<Village>): Promise<ApiResponse<Village>> {
    return apiClient<ApiResponse<Village>>(`/villages/${id}`, { method: "PUT", body: dto });
  }

  async uploadGallery(id: string, formData: FormData): Promise<ApiResponse<VillageGallery>> {
    return apiUpload(`/villages/${id}/gallery`, formData);
  }

  async getWatermarkConfig(): Promise<ApiResponse<WatermarkConfig>> {
    return apiClient<ApiResponse<WatermarkConfig>>(`/settings/watermark`);
  }
}
