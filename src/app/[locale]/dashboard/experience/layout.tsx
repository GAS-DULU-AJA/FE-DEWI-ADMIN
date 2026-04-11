"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ROLE_DASHBOARD_PATH } from "@/lib/constants";

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated || !user) return;
    if (user.role !== "EVENT_ORGANIZER") {
      router.replace(ROLE_DASHBOARD_PATH[user.role]);
    }
  }, [isHydrated, router, user]);

  if (!isHydrated || !user || user.role !== "EVENT_ORGANIZER") {
    return null;
  }

  return <>{children}</>;
}
