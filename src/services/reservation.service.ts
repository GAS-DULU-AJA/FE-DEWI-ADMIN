import type { Reservation } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient } from "./api-client";

export interface IReservationService {
  getPartnerReservations(params?: QueryParams): Promise<PaginatedResponse<Reservation>>;
  getById(id: string): Promise<ApiResponse<Reservation>>;
  updateStatus(id: string, status: string): Promise<ApiResponse<Reservation>>;
}

export class ReservationService implements IReservationService {
  async getPartnerReservations(params?: QueryParams): Promise<PaginatedResponse<Reservation>> {
    return apiClient<PaginatedResponse<Reservation>>("/reservations/partner", { params });
  }

  async getById(id: string): Promise<ApiResponse<Reservation>> {
    return apiClient<ApiResponse<Reservation>>(`/reservations/${id}`);
  }

  async updateStatus(id: string, status: string): Promise<ApiResponse<Reservation>> {
    return apiClient<ApiResponse<Reservation>>(`/reservations/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  }
}
