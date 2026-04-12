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
        "rounded-xl border border-stone-200 bg-white p-2",
        sticky && "sticky top-2 z-10 bg-white/95 backdrop-blur",
        className
      )}
    >
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
                active === tab.id
                  ? "bg-emerald-600 text-white"
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
