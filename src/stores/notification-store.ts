"use client";

import { create } from "zustand";
import type { Notification } from "@/types";
import type { NotificationPreference } from "@/features/shared/notifications/types";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "@/features/shared/notifications/constants";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "isRead">) => void;
  setPreference: (type: string, enabled: boolean) => void;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Reservasi Baru",
    message: "Sari Putri memesan Kamar Deluxe untuk 2 malam",
    type: "reservation",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Produk Disetujui",
    message: "Batik Mega Mendung Anda telah disetujui oleh Pengelola Desa",
    type: "approval",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "3",
    title: "Ulasan Baru",
    message: "Tamu memberikan rating 5 bintang untuk penginapan Anda",
    type: "review",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    title: "Stok Rendah",
    message: "Stok Kain Batik Tulis hampir habis (sisa 3 pcs)",
    type: "low_stock",
    isRead: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: DEMO_NOTIFICATIONS,
  unreadCount: DEMO_NOTIFICATIONS.filter((n) => !n.isRead).length,
  preferences: DEFAULT_NOTIFICATION_PREFERENCES,

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  clearRead: () =>
    set((state) => {
      const unread = state.notifications.filter((n) => !n.isRead);
      return { notifications: unread, unreadCount: unread.length };
    }),

  addNotification: (data) =>
    set((state) => {
      const n: Notification = {
        ...data,
        id: String(Date.now()),
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      return {
        notifications: [n, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),

  setPreference: (type, enabled) =>
    set((state) => ({
      preferences: state.preferences.map((p) =>
        p.type === type ? { ...p, enabled } : p
      ),
    })),
}));
