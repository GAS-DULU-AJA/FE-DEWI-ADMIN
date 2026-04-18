"use client";

import { cn } from "@/lib/utils";

export type SegmentedTabItem<T extends string> = {
  id: T;
  label: string;
};

export function SegmentedTabs<T extends string>({
  tabs,
  active,
  onChange,
  sticky = false,
  className,
}: {
  tabs: Array<SegmentedTabItem<T>>;
  active: T;
  onChange: (id: T) => void;
  sticky?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white p-2 shadow-sm",
        sticky && "sticky top-16 z-20 bg-white/95 backdrop-blur",
        className
      )}
    >
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                active === tab.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
