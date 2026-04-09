"use client";

import { useTranslations } from "next-intl";
import { Bell, Menu, X } from "lucide-react";
import { useNotificationStore } from "@/stores/notification-store";
import { LanguageSwitcher } from "./language-switcher";
import * as Popover from "@radix-ui/react-popover";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function DashboardHeader({ onMenuToggle, sidebarOpen }: DashboardHeaderProps) {
  const t = useTranslations();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotificationStore();
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 lg:hidden transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div>
          <p className="text-sm font-semibold text-stone-800">
            {t("dashboard.welcome")}, {user?.fullName?.split(" ")[0]}!
          </p>
          <p className="text-xs text-stone-500">{user?.organizationName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {/* Notification Bell */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={8}
              align="end"
              className="z-50 w-80 rounded-xl border border-stone-200 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
                <h3 className="font-semibold text-stone-900">{t("notifications.title")}</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {t("notifications.markAllRead")}
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                {notifications.length === 0 ? (
                  <p className="py-8 text-center text-sm text-stone-500">
                    {t("notifications.noNotifications")}
                  </p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-stone-50 ${!n.isRead ? "bg-emerald-50/50" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.isRead && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        )}
                        <div className={!n.isRead ? "" : "pl-4"}>
                          <p className="text-sm font-medium text-stone-900">{n.title}</p>
                          <p className="mt-0.5 text-xs text-stone-500 line-clamp-2">{n.message}</p>
                          <p className="mt-1 text-[10px] text-stone-400">
                            {formatDate(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </header>
  );
}
