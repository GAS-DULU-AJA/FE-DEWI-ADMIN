"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { ROLE_DASHBOARD_PATH } from "@/lib/constants";

export default function DashboardPage() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated || !user) return;

    if (!user.isApproved) {
      router.replace("/pending-approval");
      return;
    }

    if (user) {
      router.replace(ROLE_DASHBOARD_PATH[user.role]);
    }
  }, [user, isHydrated, router]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
    </div>
  );
}
