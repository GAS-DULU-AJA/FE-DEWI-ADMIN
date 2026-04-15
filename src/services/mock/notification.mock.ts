import type { Notification } from "@/types";
import type { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import type { INotificationService } from "../notification.service";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

const mockNotifications: Notification[] = [
  { id: "notif-1", title: "Reservasi Baru", message: "Ada reservasi baru untuk Kamar Deluxe", type: "reservation", isRead: false, createdAt: "2026-04-14T08:00:00Z" },
  { id: "notif-2", title: "Pesanan Baru", message: "Pesanan produk kerajinan dari Budi", type: "order", isRead: false, createdAt: "2026-04-13T10:00:00Z" },
  { id: "notif-3", title: "Review Baru", message: "Andi memberikan review 5 bintang", type: "review", isRead: true, createdAt: "2026-04-12T14:00:00Z" },
  { id: "notif-4", title: "Approval Diterima", message: "Properti Anda telah disetujui", type: "approval", isRead: true, createdAt: "2026-04-11T09:00:00Z" },
];

export class NotificationServiceMock implements INotificationService {
  private items = [...mockNotifications];

  async getAll(params?: QueryParams): Promise<PaginatedResponse<Notification>> {
    await delay(80);
    const page = params?.page ? Number(params.page) : 1;
    const pageSize = params?.limit ? Number(params.limit) : 20;
    return {
      success: true,
      data: this.items.slice((page - 1) * pageSize, page * pageSize),
      meta: { total: this.items.length, page, pageSize, totalPages: Math.ceil(this.items.length / pageSize) },
    };
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    await delay(50);
    const count = this.items.filter((n) => !n.isRead).length;
    return { success: true, data: { count }, message: "OK" };
  }

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    await delay(80);
    const item = this.items.find((n) => n.id === id);
    if (!item) throw { success: false, message: "Not found", code: "NOT_FOUND", status: 404 };
    item.isRead = true;
    return { success: true, data: item, message: "Marked as read" };
  }

  async markAllAsRead(): Promise<void> {
    await delay(100);
    this.items.forEach((n) => (n.isRead = true));
  }
}
