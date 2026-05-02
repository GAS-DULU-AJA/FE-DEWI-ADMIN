import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium font-body ring-offset-surface-container-lowest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-primary-gradient text-primary-foreground shadow-ambient hover:brightness-110",
        secondary:
          "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-ambient",
        outline:
          "border-[1.5px] border-primary/40 text-primary bg-transparent hover:border-primary hover:bg-primary/5",
        ghost:
          "text-primary hover:bg-primary/5",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-ambient",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto rounded-none hover:scale-100",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        default: "h-10 px-5 py-2",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {asChild ? children : (
          <>
            {isLoading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
