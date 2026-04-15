import type { Review } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient } from "./api-client";

export interface IReviewService {
  getAll(params?: QueryParams): Promise<PaginatedResponse<Review>>;
  reply(id: string, reply: string): Promise<ApiResponse<Review>>;
}

export class ReviewService implements IReviewService {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Review>> {
    return apiClient<PaginatedResponse<Review>>("/reviews", { params });
  }

  async reply(id: string, reply: string): Promise<ApiResponse<Review>> {
    return apiClient<ApiResponse<Review>>(`/reviews/${id}/reply`, {
      method: "PATCH",
      body: { reply },
    });
  }
}
