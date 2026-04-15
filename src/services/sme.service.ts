import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient } from "./api-client";

export interface SmeProfile {
  id: string;
  partnerId: string;
  villageId: string;
  businessName: string;
  businessType: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  photos: string[];
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISmeService {
  getProfile(id: string): Promise<ApiResponse<SmeProfile>>;
  createProfile(dto: Partial<SmeProfile>): Promise<ApiResponse<SmeProfile>>;
  updateProfile(id: string, dto: Partial<SmeProfile>): Promise<ApiResponse<SmeProfile>>;
  getProducts(params?: QueryParams): Promise<PaginatedResponse<import("@/types").Product>>;
  getProduct(id: string): Promise<ApiResponse<import("@/types").Product>>;
  createProduct(dto: Partial<import("@/types").Product>): Promise<ApiResponse<import("@/types").Product>>;
  updateProduct(id: string, dto: Partial<import("@/types").Product>): Promise<ApiResponse<import("@/types").Product>>;
  deleteProduct(id: string): Promise<void>;
}

export class SmeService implements ISmeService {
  async getProfile(id: string): Promise<ApiResponse<SmeProfile>> {
    return apiClient<ApiResponse<SmeProfile>>(`/sme/profiles/${id}`);
  }

  async createProfile(dto: Partial<SmeProfile>): Promise<ApiResponse<SmeProfile>> {
    return apiClient<ApiResponse<SmeProfile>>("/sme/profiles", { method: "POST", body: dto });
  }

  async updateProfile(id: string, dto: Partial<SmeProfile>): Promise<ApiResponse<SmeProfile>> {
    return apiClient<ApiResponse<SmeProfile>>(`/sme/profiles/${id}`, { method: "PUT", body: dto });
  }

  async getProducts(params?: QueryParams): Promise<PaginatedResponse<import("@/types").Product>> {
    return apiClient<PaginatedResponse<import("@/types").Product>>("/sme/products", { params });
  }

  async getProduct(id: string): Promise<ApiResponse<import("@/types").Product>> {
    return apiClient<ApiResponse<import("@/types").Product>>(`/sme/products/${id}`);
  }

  async createProduct(dto: Partial<import("@/types").Product>): Promise<ApiResponse<import("@/types").Product>> {
    return apiClient<ApiResponse<import("@/types").Product>>("/sme/products", { method: "POST", body: dto });
  }

  async updateProduct(id: string, dto: Partial<import("@/types").Product>): Promise<ApiResponse<import("@/types").Product>> {
    return apiClient<ApiResponse<import("@/types").Product>>(`/sme/products/${id}`, { method: "PUT", body: dto });
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient(`/sme/products/${id}`, { method: "DELETE" });
  }
}
