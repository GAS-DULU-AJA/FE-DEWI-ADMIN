import type { PartnerRole } from "@/types";

export type NotificationPriority = "urgent" | "info" | "success" | "warning";

export type NotificationType =
  // Village Admin
  | "new_partner_application"
  | "partner_approved"
  | "new_coordination_request"
  | "facility_rental_request"
  | "revenue_settlement"
  // Accommodation
  | "new_reservation"
  | "reservation_confirmed"
  | "reservation_cancelled"
  | "payment_received"
  | "withdrawal_processed"
  | "low_occupancy_alert"
  // UMKM
  | "new_order"
  | "order_paid"
  | "pickup_reminder"
  | "low_stock_alert"
  // Event Organizer
  | "coordination_status_change"
  | "new_booking"
  | "booking_cancelled"
  | "payment_milestone"
  | "ticket_sold_out"
  // Shared
  | "new_review"
  | "system_announcement"
  | "account_verification"
  | "password_changed"
  // Legacy
  | "order"
  | "reservation"
  | "approval"
  | "review"
  | "low_stock"
  | "general";

export interface EnhancedNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface NotificationPreference {
  type: NotificationType;
  label: string;
  enabled: boolean;
  roles: PartnerRole[];
}
