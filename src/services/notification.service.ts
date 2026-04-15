import type { Notification } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient } from "./api-client";

export interface INotificationService {
  getAll(params?: QueryParams): Promise<PaginatedResponse<Notification>>;
  getUnreadCount(): Promise<ApiResponse<{ count: number }>>;
  markAsRead(id: string): Promise<ApiResponse<Notification>>;
  markAllAsRead(): Promise<void>;
}

export class NotificationService implements INotificationService {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Notification>> {
    return apiClient<PaginatedResponse<Notification>>("/notifications", { params });
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiClient<ApiResponse<{ count: number }>>("/notifications/unread-count");
  }

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return apiClient<ApiResponse<Notification>>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  }

  async markAllAsRead(): Promise<void> {
    await apiClient("/notifications/read-all", { method: "PATCH" });
  }
}
