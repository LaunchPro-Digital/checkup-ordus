import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import type { RiskBand } from "@/lib/questionBank";

interface ImpactSectionProps {
  explanation: string;
  band?: RiskBand;
}

const BAND_ICON = {
  low: CheckCircle2,
  medium: AlertCircle,
  high: AlertTriangle,
} as const;

const BAND_ICON_COLOR = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-accent",
} as const;

export function ImpactSection({ explanation, band = "medium" }: ImpactSectionProps) {
  const Icon = BAND_ICON[band];
  const iconColor = BAND_ICON_COLOR[band];

  return (
    <Card className="card-elevated" id="impact">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          O que isso significa para suas vendas?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed text-base">{explanation}</p>
      </CardContent>
    </Card>
  );
}
