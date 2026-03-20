import { cn } from "@/lib/utils";
import { SCALE_LABELS } from "@/lib/questionBank";

interface RatingScaleProps {
  value?: 1 | 2 | 3 | 4 | 5;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
  disabled?: boolean;
  /** Texto da pergunta — usado para o aria-label acessível do grupo */
  questionText?: string;
}

const SCALE_VALUES = [1, 2, 3, 4, 5] as const;

export function RatingScale({ value, onChange, disabled = false, questionText }: RatingScaleProps) {
  return (
    <div className="space-y-3">
      {/* Scale header — linguagem positiva, sem frame de "risco" */}
      <div className="flex justify-between text-xs text-muted-foreground font-label px-1">
        <span>1 = MUITO FRACO</span>
        <span>5 = FORTE E CONSISTENTE</span>
      </div>

      {/* Rating buttons */}
      <div
        className="flex gap-2"
        role="radiogroup"
        aria-label={questionText ? `Avaliação para: ${questionText}` : "Escala de avaliação"}
      >
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
              title={SCALE_LABELS[rating]}
              className={cn(
                "flex-1 py-3 px-2 rounded-lg font-display font-semibold text-lg transition-all duration-200",
                "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
                isSelected && riskLevel === "high" && "bg-risk-high text-[#F0F0F3] border-risk-high focus:ring-risk-high",
                isSelected && riskLevel === "medium" && "bg-risk-medium text-[#F0F0F3] border-risk-medium focus:ring-risk-medium",
                isSelected && riskLevel === "low" && "bg-risk-low text-[#F0F0F3] border-risk-low focus:ring-risk-low",
                !isSelected && "bg-card border-border hover:border-foreground/30 hover:bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Nota ${rating}: ${SCALE_LABELS[rating]}`}
            >
              {rating}
            </button>
          );
        })}
      </div>

      {/* Selected value label */}
      {value && (
        <p className="text-center text-sm text-muted-foreground motion-safe:animate-fade-in">
          {SCALE_LABELS[value]}
        </p>
      )}
    </div>
  );
}
