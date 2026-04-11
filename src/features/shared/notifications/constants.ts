import type { NotificationPreference } from "./types";
import type { PartnerRole } from "@/types";

export const ALL_ROLES: PartnerRole[] = [
  "VILLAGE_ADMIN",
  "ACCOMMODATION",
  "UMKM",
  "EVENT_ORGANIZER",
];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  // Village Admin
  { type: "new_partner_application", label: "New Partner Application", enabled: true, roles: ["VILLAGE_ADMIN"] },
  { type: "partner_approved", label: "Partner Approved", enabled: true, roles: ["VILLAGE_ADMIN"] },
  { type: "new_coordination_request", label: "Coordination Request", enabled: true, roles: ["VILLAGE_ADMIN"] },
  { type: "facility_rental_request", label: "Facility Rental Request", enabled: true, roles: ["VILLAGE_ADMIN"] },
  { type: "revenue_settlement", label: "Revenue Settlement", enabled: true, roles: ["VILLAGE_ADMIN", "EVENT_ORGANIZER"] },
  // Accommodation
  { type: "new_reservation", label: "New Reservation", enabled: true, roles: ["ACCOMMODATION"] },
  { type: "reservation_confirmed", label: "Reservation Confirmed", enabled: true, roles: ["ACCOMMODATION"] },
  { type: "reservation_cancelled", label: "Reservation Cancelled", enabled: true, roles: ["ACCOMMODATION"] },
  { type: "payment_received", label: "Payment Received", enabled: true, roles: ["ACCOMMODATION", "UMKM", "EVENT_ORGANIZER"] },
  { type: "withdrawal_processed", label: "Withdrawal Processed", enabled: true, roles: ["ACCOMMODATION", "UMKM", "EVENT_ORGANIZER"] },
  { type: "low_occupancy_alert", label: "Low Occupancy Alert", enabled: false, roles: ["ACCOMMODATION"] },
  // UMKM
  { type: "new_order", label: "New Order", enabled: true, roles: ["UMKM"] },
  { type: "order_paid", label: "Order Paid", enabled: true, roles: ["UMKM"] },
  { type: "pickup_reminder", label: "Pickup Reminder", enabled: true, roles: ["UMKM"] },
  { type: "low_stock_alert", label: "Low Stock Alert", enabled: true, roles: ["UMKM"] },
  // Event Organizer
  { type: "coordination_status_change", label: "Coordination Status Changed", enabled: true, roles: ["EVENT_ORGANIZER", "VILLAGE_ADMIN"] },
  { type: "new_booking", label: "New Booking", enabled: true, roles: ["EVENT_ORGANIZER"] },
  { type: "booking_cancelled", label: "Booking Cancelled", enabled: true, roles: ["EVENT_ORGANIZER"] },
  { type: "payment_milestone", label: "Payment Milestone", enabled: true, roles: ["EVENT_ORGANIZER"] },
  { type: "ticket_sold_out", label: "Ticket Sold Out", enabled: true, roles: ["EVENT_ORGANIZER"] },
  // Shared
  { type: "new_review", label: "New Review", enabled: true, roles: ALL_ROLES },
  { type: "system_announcement", label: "System Announcements", enabled: true, roles: ALL_ROLES },
  { type: "account_verification", label: "Account Verification", enabled: true, roles: ALL_ROLES },
  { type: "password_changed", label: "Password Changed", enabled: true, roles: ALL_ROLES },
];

export const NOTIFICATION_PRIORITY_CLASS: Record<string, string> = {
  urgent: "bg-red-50 border-red-200 text-red-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
};
