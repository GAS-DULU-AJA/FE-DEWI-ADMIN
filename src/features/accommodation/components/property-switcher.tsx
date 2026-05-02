"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Accommodation } from "@/types";

export function PropertySwitcher({
  accommodations,
}: {
  accommodations: Accommodation[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const activeAccommodationId = useMemo(() => {
    const matched = accommodations.find((item) => pathname.includes(item.id));
    return matched?.id ?? accommodations[0]?.id ?? "";
  }, [accommodations, pathname]);

  if (accommodations.length === 0) return null;

  return (
    <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-3">
      <p className="mb-2 text-xs font-medium text-on-surface/60">Penginapan aktif</p>
      <select
        className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 text-sm"
        value={activeAccommodationId}
        onChange={(event) => {
          const selectedId = event.target.value;
          router.push(`/dashboard/accommodation/${selectedId}`);
        }}
      >
        {accommodations.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
