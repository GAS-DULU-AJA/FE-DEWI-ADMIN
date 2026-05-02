"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function Select({ options, value, onChange, placeholder = "Select...", className, disabled }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

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
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 py-2 text-sm ring-offset-surface-container-lowest transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !selected && "text-on-surface/60"
        )}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-on-surface/60 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-surface-container-high bg-surface-container-lowest py-1 shadow-ambient">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                onChange?.(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors",
                "hover:bg-primary/10 hover:text-primary",
                option.value === value && "bg-primary/10 text-primary font-medium",
                option.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {option.value === value && <Check className="h-3.5 w-3.5" />}
              <span className={cn(option.value !== value && "pl-5.5")}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { Select };
export type { SelectOption, SelectProps };
