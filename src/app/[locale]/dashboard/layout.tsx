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
      router.push("/menunggu-persetujuan");
    }
  }, [isAuthenticated, isHydrated, router, user]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!isHydrated || !isAuthenticated || (user && !user.isApproved)) return null;

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:shrink-0">
        <DashboardSidebar />
      </div>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full">
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
        />
        <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6")}>
          {children}
        </main>
      </div>
    </div>
  );
}
