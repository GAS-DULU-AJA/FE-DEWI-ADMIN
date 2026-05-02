import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "status", label: "Submission Status", getHref: (id: string) => `/dashboard/accommodation/${id}/status` },
  { key: "finance", label: "Finance", getHref: (id: string) => `/dashboard/accommodation/${id}/finance` },
  { key: "settings", label: "Settings", getHref: (id: string) => `/dashboard/accommodation/${id}/settings` },
  { key: "rooms", label: "Rooms", getHref: (id: string) => `/dashboard/accommodation/${id}/rooms` },
  { key: "reservations", label: "Reservations", getHref: (id: string) => `/dashboard/accommodation/${id}/reservations` },
  { key: "reviews", label: "Reviews", getHref: (id: string) => `/dashboard/accommodation/${id}/reviews` },
] as const;

export function PropertyDetailTabs({ propertyId, activeKey }: { propertyId: string; activeKey?: (typeof TABS)[number]["key"] }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-surface-container-high bg-surface-container-lowest p-2">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.getHref(propertyId)}
          className={cn(
            "rounded-lg px-3 py-2 text-sm transition-colors",
            activeKey === tab.key ? "bg-primary text-primary-foreground" : "text-on-surface/70 hover:bg-surface-container"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
