import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
}

interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function WizardStepper({ steps, currentStep, onStepClick }: WizardStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-center relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent  = index === currentStep;
          const isClickable = index < currentStep && onStepClick;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={cn(
                  "relative flex flex-col items-center gap-2 z-10",
                  isClickable ? "cursor-pointer" : "cursor-default"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-bold",
                    isCompleted && "bg-cta border-2 border-cta text-white",
                    isCurrent  && "bg-accent border-2 border-accent text-white ring-4 ring-accent/20",
                    !isCompleted && !isCurrent && "border-2 text-muted-foreground"
                  )}
                  style={
                    !isCompleted && !isCurrent
                      ? { background: '#1F1F1F', borderColor: 'rgba(255,255,255,0.15)' }
                      : undefined
                  }
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
                </div>

                <div className="text-center min-w-[64px]">
                  <p className={cn(
                    "text-xs font-label tracking-wide transition-colors",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-[10px] text-muted-foreground hidden lg:block mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </button>

              {index < steps.length - 1 && (
                <div
                  className="mx-3 h-px w-16 transition-colors duration-500"
                  style={{
                    background: index < currentStep
                      ? 'hsl(var(--cta))'
                      : 'rgba(255,255,255,0.10)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {steps[currentStep]?.label}
          </span>
          <span className="font-label text-[10px]" style={{ color: '#6A6A6A' }}>
            {currentStep + 1} / {steps.length}
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              background: 'hsl(var(--cta))',
            }}
          />
        </div>
      </div>
    </div>
  );
}
