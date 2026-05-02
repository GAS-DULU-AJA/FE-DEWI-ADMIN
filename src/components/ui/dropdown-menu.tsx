"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  trigger?: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

function DropdownMenu({ items, trigger, align = "right", className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-on-surface/60 transition-colors hover:bg-surface-container hover:text-on-surface/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
      >
        {trigger || <MoreHorizontal className="h-4 w-4" />}
      </button>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg border border-surface-container-high bg-surface-container-lowest py-1 shadow-ambient",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors",
                item.variant === "destructive"
                  ? "text-red-600 hover:bg-red-500/10"
                  : "text-on-surface/80 hover:bg-surface-container-low",
                item.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { DropdownMenu };
export type { DropdownMenuItem, DropdownMenuProps };
