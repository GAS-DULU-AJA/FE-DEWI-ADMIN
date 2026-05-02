"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  className?: string;
  disabled?: boolean;
}

function DatePicker({ value, onChange, placeholder = "Select date", min, max, className, disabled }: DatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="date"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 pr-10 text-sm text-on-surface",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-on-surface/40"
        )}
      />
      <Calendar
        className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/40 pointer-events-none"
      />
    </div>
  );
}

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onStartChange?: (date: string) => void;
  onEndChange?: (date: string) => void;
  className?: string;
}

function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, className }: DateRangePickerProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DatePicker
        value={startDate}
        onChange={onStartChange}
        max={endDate}
        placeholder="Start date"
        className="flex-1"
      />
      <span className="text-sm text-on-surface/40">—</span>
      <DatePicker
        value={endDate}
        onChange={onEndChange}
        min={startDate}
        placeholder="End date"
        className="flex-1"
      />
    </div>
  );
}

export { DatePicker, DateRangePicker };
export type { DatePickerProps, DateRangePickerProps };
