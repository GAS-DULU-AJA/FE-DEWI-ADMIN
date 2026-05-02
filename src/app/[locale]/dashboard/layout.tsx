"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isHydrated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && !user.isApproved) {
      router.push("/pending-approval");
    }
  }, [isAuthenticated, isHydrated, router, user]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!isHydrated || !isAuthenticated || (user && !user.isApproved)) return null;

  return (
    <div className="relative flex h-screen overflow-hidden bg-surface">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:shrink-0">
        <DashboardSidebar />
      </div>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full w-72 max-w-[88vw] shadow-2xl">
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
        />
        <main className={cn("flex-1 overflow-y-auto bg-surface px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10")}>
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
