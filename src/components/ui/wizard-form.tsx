"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Check } from "lucide-react";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  isValid?: boolean;
}

interface WizardFormProps {
  steps: WizardStep[];
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  className?: string;
  showSummary?: boolean;
}

function WizardForm({
  steps,
  onComplete,
  onStepChange,
  submitLabel = "Submit",
  isSubmitting = false,
  className,
}: WizardFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const goToStep = (index: number) => {
    // Allow going back freely, forward only if current is valid
    if (index < currentStep || steps[currentStep]?.isValid !== false) {
      setCurrentStep(index);
      onStepChange?.(index);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Bar */}
      <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(idx)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isCurrent && "bg-primary/10 text-primary font-medium",
                isCompleted && "text-primary",
                !isCurrent && !isCompleted && "text-on-surface/40"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isCurrent && "bg-primary text-primary-foreground",
                  isCompleted && "bg-primary/10 text-primary",
                  !isCurrent && !isCompleted && "bg-surface-container-high text-on-surface/60"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </span>
              <span className="hidden lg:inline truncate">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Step Label */}
      <div className="sm:hidden text-center">
        <p className="text-xs text-on-surface/60">
          Step {currentStep + 1} of {steps.length}
        </p>
        <p className="text-sm font-medium text-on-surface">{steps[currentStep]?.title}</p>
      </div>

      {/* Step Content */}
      <div className="min-h-[200px]">{steps[currentStep]?.content}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-surface-container-high pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <span className="text-xs text-on-surface/40">
          {currentStep + 1} / {steps.length}
        </span>

        <Button
          type="button"
          onClick={handleNext}
          isLoading={isLastStep && isSubmitting}
          disabled={steps[currentStep]?.isValid === false}
        >
          {isLastStep ? submitLabel : "Next"}
        </Button>
      </div>
    </div>
  );
}

export { WizardForm };
export type { WizardFormProps };
