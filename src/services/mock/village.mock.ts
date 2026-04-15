import type { ApiResponse } from "../types";
import type { IVillageService, Village, VillageGallery } from "../village.service";
import { VILLAGE_PROFILE } from "@/features/village/mock-data";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

export class VillageServiceMock implements IVillageService {
  private village = { ...VILLAGE_PROFILE };

  async getById(_id: string): Promise<ApiResponse<Village>> {
    await delay(80);
    return { success: true, data: this.village as unknown as Village, message: "OK" };
  }

  async update(_id: string, dto: Partial<Village>): Promise<ApiResponse<Village>> {
    await delay(150);
    this.village = { ...this.village, ...dto } as typeof this.village;
    return { success: true, data: this.village as unknown as Village, message: "Updated" };
  }

  async uploadGallery(_id: string, _formData: FormData): Promise<ApiResponse<VillageGallery>> {
    await delay(200);
    return {
      success: true,
      data: { id: "gal-" + Date.now(), url: "/mock-village-gallery.jpg" },
      message: "Uploaded",
    };
  }
}
