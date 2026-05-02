"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

function SearchInput({ value, onChange, debounceMs = 300, className, placeholder = "Search...", ...props }: SearchInputProps) {
  const [internal, setInternal] = React.useState(value);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    setInternal(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInternal(newVal);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newVal);
    }, debounceMs);
  };

  const handleClear = () => {
    setInternal("");
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/40" />
      <input
        type="text"
        value={internal}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest pl-9 pr-9 text-sm text-on-surface placeholder:text-on-surface/40",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
        )}
        {...props}
      />
      {internal && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/40 hover:text-on-surface/70"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { SearchInput };
export type { SearchInputProps };
