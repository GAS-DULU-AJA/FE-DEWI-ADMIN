import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-transparent bg-surface-container-high px-3 py-2 text-sm text-on-surface font-body ring-offset-surface-container-lowest file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-on-surface/40 focus-visible:outline-none focus-visible:border-primary focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150",
            error && "border-red-400 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
