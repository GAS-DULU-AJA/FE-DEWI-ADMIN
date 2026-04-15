import type { Product } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import type { ISmeService, SmeProfile } from "../sme.service";
import { SME_PRODUCTS } from "@/features/sme/mock-data";

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

const mockProfile: SmeProfile = {
  id: "sme-1",
  partnerId: "user-sme-1",
  villageId: "village-1",
  businessName: "Kerajinan Desa Wisata",
  businessType: "craft",
  description: "Kerajinan tangan khas desa",
  address: "Jl. Desa Wisata No. 1",
  phone: "081234567890",
  email: "kerajinan@dewi.id",
  operatingHours: "08:00-17:00",
  photos: [],
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

export class SmeServiceMock implements ISmeService {
  private products = [...SME_PRODUCTS] as unknown as Product[];
  private profile = { ...mockProfile };

  async getProfile(_id: string): Promise<ApiResponse<SmeProfile>> {
    await delay(80);
    return { success: true, data: this.profile, message: "OK" };
  }

  async createProfile(dto: Partial<SmeProfile>): Promise<ApiResponse<SmeProfile>> {
    await delay(200);
    this.profile = { ...this.profile, ...dto };
    return { success: true, data: this.profile, message: "Created" };
  }

  async updateProfile(_id: string, dto: Partial<SmeProfile>): Promise<ApiResponse<SmeProfile>> {
    await delay(150);
    this.profile = { ...this.profile, ...dto };
    return { success: true, data: this.profile, message: "Updated" };
  }

  async getProducts(params?: QueryParams): Promise<PaginatedResponse<Product>> {
    await delay(100);
    let filtered = [...this.products];
    if (params?.search) {
      const s = String(params.search).toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(s));
    }
    return paginate(filtered, params);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    await delay(80);
    const item = this.products.find((p) => p.id === id);
    if (!item) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    return { success: true, data: item, message: "OK" };
  }

  async createProduct(dto: Partial<Product>): Promise<ApiResponse<Product>> {
    await delay(200);
    const newItem = { ...dto, id: "prod-" + Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Product;
    this.products.push(newItem);
    return { success: true, data: newItem, message: "Created" };
  }

  async updateProduct(id: string, dto: Partial<Product>): Promise<ApiResponse<Product>> {
    await delay(150);
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    this.products[idx] = { ...this.products[idx], ...dto };
    return { success: true, data: this.products[idx], message: "Updated" };
  }

  async deleteProduct(id: string): Promise<void> {
    await delay(100);
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx !== -1) this.products.splice(idx, 1);
  }
}
