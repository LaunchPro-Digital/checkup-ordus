import { cn } from "@/lib/utils";
import { SCALE_LABELS } from "@/lib/questionBank";

interface RatingScaleProps {
  value?: 1 | 2 | 3 | 4 | 5;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
  disabled?: boolean;
}

const SCALE_VALUES = [1, 2, 3, 4, 5] as const;

export function RatingScale({ value, onChange, disabled = false }: RatingScaleProps) {
  return (
    <div className="space-y-3">
      {/* Scale header */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>1 = Risco alto</span>
        <span>5 = Risco baixo</span>
      </div>

      {/* Rating buttons */}
      <div className="flex gap-2">
        {SCALE_VALUES.map((rating) => {
          const isSelected = value === rating;
          const riskLevel = rating <= 2 ? "high" : rating === 3 ? "medium" : "low";
          
          return (
            <button
              key={rating}
              type="button"
              disabled={disabled}
              onClick={() => onChange(rating)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(rating);
                }
              }}
              className={cn(
                "flex-1 py-3 px-2 rounded-lg font-display font-semibold text-lg transition-all duration-200",
                "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                isSelected && riskLevel === "high" && "bg-risk-high text-white border-risk-high focus:ring-risk-high",
                isSelected && riskLevel === "medium" && "bg-risk-medium text-white border-risk-medium focus:ring-risk-medium",
                isSelected && riskLevel === "low" && "bg-risk-low text-white border-risk-low focus:ring-risk-low",
                !isSelected && "bg-card border-border hover:border-foreground/30 hover:bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              aria-label={`Nota ${rating}: ${SCALE_LABELS[rating]}`}
              aria-pressed={isSelected}
            >
              {rating}
            </button>
          );
        })}
      </div>

      {/* Selected value label */}
      {value && (
        <p className="text-center text-sm text-muted-foreground animate-fade-in">
          {SCALE_LABELS[value]}
        </p>
      )}
    </div>
  );
}
