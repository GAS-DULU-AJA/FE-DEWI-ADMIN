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
        "rounded-2xl border border-surface-container-high/70 bg-surface-container-lowest p-2 shadow-ambient",
        sticky && "sticky top-16 z-20 bg-surface-container-lowest/95 backdrop-blur",
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
                "rounded-xl px-3.5 py-2 text-sm whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active === tab.id
                  ? "bg-primary text-primary-foreground shadow-ambient"
                  : "bg-surface-container text-on-surface/80 hover:bg-surface-container-high hover:text-on-surface"
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
