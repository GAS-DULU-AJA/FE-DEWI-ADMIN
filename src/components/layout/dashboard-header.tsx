"use client";

import { useTranslations } from "next-intl";
import { Bell, Menu, X, ArrowRight } from "lucide-react";
import { useNotificationStore } from "@/stores/notification-store";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import * as Popover from "@radix-ui/react-popover";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function DashboardHeader({ onMenuToggle, sidebarOpen }: DashboardHeaderProps) {
  const t = useTranslations();
  const { notifications, unreadCount, markAllAsRead, markAsRead, clearRead } = useNotificationStore();
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-container-high/80 bg-surface-container-lowest/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-surface-container-lowest/80 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface/60 transition-colors hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div>
          <p className="text-sm font-semibold text-on-surface">
            {t("dashboard.welcome")}, {user?.fullName?.split(" ")[0]}!
          </p>
          <p className="text-xs text-on-surface/60">{user?.organizationName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />

        {/* Notification Bell */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-on-surface/60 transition-colors hover:border-surface-container-high hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
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
              className="z-50 w-[22rem] max-w-[calc(100vw-1rem)] rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-ambient"
            >
              <div className="flex items-center justify-between border-b border-surface-container px-4 py-3">
                <h3 className="font-semibold text-on-surface">{t("notifications.title")}</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary font-medium"
                    >
                      {t("notifications.markAllRead")}
                    </button>
                  )}
                  {notifications.some((n) => n.isRead) && (
                    <button
                      onClick={clearRead}
                      className="text-xs text-on-surface/40 hover:text-on-surface/70"
                    >
                      {t("notifications.clearRead")}
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-surface-container">
                {notifications.length === 0 ? (
                  <p className="py-8 text-center text-sm text-on-surface/60">
                    {t("notifications.noNotifications")}
                  </p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-surface-container-low ${!n.isRead ? "bg-primary/[0.04]" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.isRead && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                        <div className={`flex-1 ${!n.isRead ? "" : "pl-4"}`}>
                          <p className="text-sm font-medium text-on-surface">{n.title}</p>
                          <p className="mt-0.5 text-xs text-on-surface/60 line-clamp-2">{n.message}</p>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="text-[10px] text-on-surface/40">{formatDate(n.createdAt)}</p>
                            {n.actionUrl && (
                              <Link
                                href={n.actionUrl}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary hover:underline"
                              >
                                {t("notifications.viewDetail")} <ArrowRight className="h-2.5 w-2.5" />
                              </Link>
                            )}
                          </div>
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
