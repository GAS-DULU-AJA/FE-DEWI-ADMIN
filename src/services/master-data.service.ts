import type { ApiResponse } from "./types";
import { apiClient } from "./api-client";

export interface MasterDataItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  isActive: boolean;
}

export interface IMasterDataService {
  getByType(type: string): Promise<ApiResponse<MasterDataItem[]>>;
  getById(type: string, id: string): Promise<ApiResponse<MasterDataItem>>;
}

export class MasterDataService implements IMasterDataService {
  async getByType(type: string): Promise<ApiResponse<MasterDataItem[]>> {
    return apiClient<ApiResponse<MasterDataItem[]>>(`/master-data/${type}`);
  }

  async getById(type: string, id: string): Promise<ApiResponse<MasterDataItem>> {
    return apiClient<ApiResponse<MasterDataItem>>(`/master-data/${type}/${id}`);
  }
}
