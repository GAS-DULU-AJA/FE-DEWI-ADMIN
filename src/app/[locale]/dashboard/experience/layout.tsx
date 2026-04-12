"use client";

import { useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ROLE_DASHBOARD_PATH } from "@/lib/constants";
import { useLocale, useTranslations } from "next-intl";

const LOCALES = ["id", "en", "ja"];

function normalizePathSegments(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    return segments.slice(1);
  }
  return segments;
}

function labelFromSegment(
  segment: string,
  isId: boolean,
  t: ReturnType<typeof useTranslations>,
  te: ReturnType<typeof useTranslations>
) {
  const labels: Record<string, string> = {
    experience: t("nav.experiences"),
    events: te("events.title"),
    add: te("add.title"),
    calendar: te("calendar.title"),
    speakers: te("speakers.title"),
    reservations: te("reservations.title"),
    attendees: te("attendees.title"),
    analytics: t("nav.experienceAnalytics"),
    reviews: te("reviews.title"),
    promotions: te("promotions.title"),
    documents: te("documents.title"),
    "post-event": t("nav.postEvent"),
    coordination: te("coordination.title"),
  };

  if (labels[segment]) {
    return labels[segment];
  }

  return isId ? "Detail" : "Detail";
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const te = useTranslations("experience");
  const isId = locale === "id";

  useEffect(() => {
    if (!isHydrated || !user) return;
    if (user.role !== "EVENT_ORGANIZER") {
      router.replace(ROLE_DASHBOARD_PATH[user.role]);
    }
  }, [isHydrated, router, user]);

  if (!isHydrated || !user || user.role !== "EVENT_ORGANIZER") {
    return null;
  }

  const segments = normalizePathSegments(pathname);
  const experienceIndex = segments.indexOf("experience");

  const breadcrumbItems = [
    { href: "/dashboard", label: t("nav.dashboard") },
  ];

  if (experienceIndex !== -1) {
    let currentPath = "/dashboard";
    const scopedSegments = segments.slice(experienceIndex);

    scopedSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbItems.push({
        href: currentPath,
        label: labelFromSegment(segment, isId, t, te),
      });
    });
  }

  return (
    <div className="space-y-4">
      <nav className="rounded-lg border border-stone-200 bg-white px-4 py-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <li key={`${item.href}-${item.label}`} className="flex items-center gap-2">
                {isLast ? (
                  <span className="font-medium text-stone-900">{item.label}</span>
                ) : (
                  <Link href={item.href} className="text-stone-600 hover:text-stone-900">
                    {item.label}
                  </Link>
                )}
                {!isLast && <span className="text-stone-400">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      {children}
    </div>
  );
}
