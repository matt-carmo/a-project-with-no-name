"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: Array<{
    label: string;
    description?: string;
  }>;
  className?: string;
}

export function Stepper({ currentStep, steps, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1 relative z-10">
              {/* Step circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted &&
                    "bg-primary border-primary text-primary-foreground",
                  isCurrent &&
                    "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                  isPending && "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check size={20} className="text-primary-foreground" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>

              {/* Step label */}
              <div className="mt-2 text-center max-w-[120px]">
                <p
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isCurrent && "text-foreground",
                    isCompleted && "text-foreground",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p
                    className={cn(
                      "text-xs mt-0.5 transition-colors",
                      isCurrent && "text-muted-foreground",
                      isCompleted && "text-muted-foreground",
                      isPending && "text-muted-foreground/60"
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
