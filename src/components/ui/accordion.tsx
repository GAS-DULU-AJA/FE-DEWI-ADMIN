"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: [],
  toggle: () => {},
  type: "single",
});

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string[];
}

function Accordion({ type = "single", defaultValue = [], className, children, ...props }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

  const toggle = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        if (type === "single") {
          return prev.includes(value) ? [] : [value];
        }
        return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggle, type }}>
      <div className={cn("divide-y divide-stone-200", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <div className={cn("py-0", className)} data-value={value} {...props}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function AccordionTrigger({ value, className, children, ...props }: AccordionTriggerProps) {
  const { openItems, toggle } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-sm font-medium text-stone-900 transition-all hover:text-emerald-700",
        className
      )}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function AccordionContent({ value, className, children, ...props }: AccordionContentProps) {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  if (!isOpen) return null;

  return (
    <div
      className={cn("pb-4 text-sm text-stone-600", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
