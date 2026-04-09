import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import type { RiskBand } from "@/lib/questionBank";

interface ImpactSectionProps {
  explanation: string;
  band?: RiskBand;
}

const BAND_ICON = {
  low:    CheckCircle2,
  medium: AlertCircle,
  high:   AlertTriangle,
} as const;

const BAND_ICON_COLOR = {
  low:    "text-risk-low",
  medium: "text-risk-medium",
  high:   "text-accent",
} as const;

export function ImpactSection({ explanation, band = "medium" }: ImpactSectionProps) {
  const Icon = BAND_ICON[band];
  const iconColor = BAND_ICON_COLOR[band];

  return (
    // DS: card-elevated = L1 surface
    <div className="card-elevated p-6" id="impact">
      <h2 className="text-xl flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
        O que isso significa para suas vendas?
      </h2>
      <p className="text-muted-foreground leading-relaxed text-base">{explanation}</p>
    </div>
  );
}
