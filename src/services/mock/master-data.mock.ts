import type { ApiResponse } from "../types";
import type { IMasterDataService, MasterDataItem } from "../master-data.service";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

const mockData: Record<string, MasterDataItem[]> = {
  provinces: [
    { id: "p-1", name: "Jawa Tengah", slug: "jawa-tengah", isActive: true },
    { id: "p-2", name: "Jawa Barat", slug: "jawa-barat", isActive: true },
    { id: "p-3", name: "Bali", slug: "bali", isActive: true },
  ],
  "accommodation-types": [
    { id: "at-1", name: "Homestay", slug: "homestay", isActive: true },
    { id: "at-2", name: "Villa", slug: "villa", isActive: true },
    { id: "at-3", name: "Glamping", slug: "glamping", isActive: true },
    { id: "at-4", name: "Eco Lodge", slug: "eco-lodge", isActive: true },
  ],
  "room-types": [
    { id: "rt-1", name: "Standard", slug: "standard", isActive: true },
    { id: "rt-2", name: "Deluxe", slug: "deluxe", isActive: true },
    { id: "rt-3", name: "Suite", slug: "suite", isActive: true },
  ],
  amenities: [
    { id: "am-1", name: "WiFi", slug: "wifi", isActive: true },
    { id: "am-2", name: "AC", slug: "ac", isActive: true },
    { id: "am-3", name: "Hot Water", slug: "hot-water", isActive: true },
    { id: "am-4", name: "TV", slug: "tv", isActive: true },
    { id: "am-5", name: "Breakfast", slug: "breakfast", isActive: true },
  ],
  "product-categories": [
    { id: "pc-1", name: "Kerajinan Tangan", slug: "craft", isActive: true },
    { id: "pc-2", name: "Kuliner", slug: "culinary", isActive: true },
    { id: "pc-3", name: "Tekstil", slug: "textile", isActive: true },
  ],
  "experience-categories": [
    { id: "ec-1", name: "Cultural", slug: "cultural", isActive: true },
    { id: "ec-2", name: "Nature", slug: "nature", isActive: true },
    { id: "ec-3", name: "Culinary", slug: "culinary", isActive: true },
    { id: "ec-4", name: "Adventure", slug: "adventure", isActive: true },
  ],
};

export class MasterDataServiceMock implements IMasterDataService {
  async getByType(type: string): Promise<ApiResponse<MasterDataItem[]>> {
    await delay(80);
    const data = mockData[type] || [];
    return { success: true, data, message: "OK" };
  }

  async getById(type: string, id: string): Promise<ApiResponse<MasterDataItem>> {
    await delay(60);
    const items = mockData[type] || [];
    const item = items.find((i) => i.id === id);
    if (!item) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    return { success: true, data: item, message: "OK" };
  }
}
