"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "underline" | "pills" | "segmented";
  className?: string;
}

function Tabs({ tabs, activeTab, onChange, variant = "underline", className }: TabsProps) {
  if (variant === "segmented") {
    return (
      <div className={cn("inline-flex rounded-lg bg-surface-container p-1", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
              tab.id === activeTab
                ? "bg-surface-container-lowest text-on-surface shadow-ambient"
                : "text-on-surface/70 hover:text-on-surface"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                tab.id === activeTab ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface/70"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "pills") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
              tab.id === activeTab
                ? "bg-primary text-primary-foreground shadow-ambient"
                : "bg-surface-container text-on-surface/70 hover:bg-surface-container-high"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                tab.id === activeTab ? "bg-primary-foreground/20 text-primary-foreground" : "bg-surface-container-highest text-on-surface/80"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Default: underline
  return (
    <div className={cn("border-b border-surface-container-high", className)}>
      <div className="flex gap-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
              tab.id === activeTab
                ? "text-primary"
                : "text-on-surface/60 hover:text-on-surface/80"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                tab.id === activeTab ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface/70"
              )}>
                {tab.count}
              </span>
            )}
            {tab.id === activeTab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { Tabs };
export type { Tab, TabsProps };
