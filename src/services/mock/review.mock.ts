import type { Review } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import type { IReviewService } from "../review.service";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

const mockReviews: Review[] = [
  { id: "rev-1", reviewerName: "Andi", targetId: "acc-1", targetType: "accommodation", rating: 5, comment: "Tempat bagus!", createdAt: "2025-12-10T00:00:00Z" },
  { id: "rev-2", reviewerName: "Budi", targetId: "acc-1", targetType: "accommodation", rating: 4, comment: "Nyaman dan bersih", createdAt: "2025-12-15T00:00:00Z" },
  { id: "rev-3", reviewerName: "Citra", targetId: "prod-1", targetType: "product", rating: 5, comment: "Produk berkualitas", createdAt: "2025-12-20T00:00:00Z" },
];

export class ReviewServiceMock implements IReviewService {
  private items = [...mockReviews];

  async getAll(params?: QueryParams): Promise<PaginatedResponse<Review>> {
    await delay(100);
    let filtered = [...this.items];
    if (params?.targetType) {
      filtered = filtered.filter((r) => r.targetType === params.targetType);
    }
    if (params?.targetId) {
      filtered = filtered.filter((r) => r.targetId === params.targetId);
    }
    const page = params?.page ? Number(params.page) : 1;
    const pageSize = params?.limit ? Number(params.limit) : 10;
    return {
      success: true,
      data: filtered.slice((page - 1) * pageSize, page * pageSize),
      meta: { total: filtered.length, page, pageSize, totalPages: Math.ceil(filtered.length / pageSize) },
    };
  }

  async reply(id: string, reply: string): Promise<ApiResponse<Review>> {
    await delay(150);
    const item = this.items.find((r) => r.id === id);
    if (!item) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    return { success: true, data: { ...item, comment: item.comment + `\n\nReply: ${reply}` }, message: "Reply sent" };
  }
}
