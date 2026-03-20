import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PILLAR_NAMES, PILLAR_WEIGHTS, type Pillar } from "@/lib/questionBank";
import { PILLAR_ICONS, RISK_COLORS } from "@/data/pillarConfig";
import type { PillarResult } from "@/types/checkup";
import { cn } from "@/lib/utils";

interface PillarBreakdownProps {
  pillars: Record<Pillar, PillarResult>;
  sortedPillars: Pillar[];
}

const SCALE_LABELS: Record<number, string> = {
  1: "Muito fraco",
  2: "Fraco",
  3: "Inconsistente",
  4: "Bom",
  5: "Forte",
};

function getScaleLabel(avg: number): string {
  return SCALE_LABELS[Math.round(avg)] ?? "—";
}

export function PillarBreakdown({ pillars, sortedPillars }: PillarBreakdownProps) {
  return (
    <Card className="card-elevated" id="pillars">
      <CardHeader>
        <CardTitle className="font-display text-xl">Diagnóstico por Pilar</CardTitle>
        <CardDescription>
          Risco percebido calculado individualmente para cada dimensão do framework CORE,
          com base nas suas respostas (ordenado do maior para o menor risco).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedPillars.map((pillar) => {
          const result = pillars[pillar];
          const Icon = PILLAR_ICONS[pillar];
          const riskPercent = (result.risk / 10) * 100;
          const riskBand = result.risk <= 2.9 ? "low" : result.risk <= 5.4 ? "medium" : "high";
          const colors = RISK_COLORS[riskBand];
          const weight = Math.round((PILLAR_WEIGHTS[pillar] ?? 0) * 100);

          return (
            <div key={pillar} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.bg)}>
                    <Icon className={cn("w-4 h-4", colors.text)} />
                  </div>
                  <div>
                    <span className="font-medium">{PILLAR_NAMES[pillar]}</span>
                    <span className="ml-2 text-xs text-muted-foreground">peso {weight}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn("font-display font-semibold tabular-nums", colors.text)}>
                    {result.risk.toFixed(1)}
                    <span className="text-xs font-normal text-muted-foreground ml-0.5">/10</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    média {result.avg.toFixed(1)}/5 · {getScaleLabel(result.avg)}
                  </div>
                </div>
              </div>
              <Progress
                value={riskPercent}
                className={cn("h-2", {
                  "[&>div]:bg-risk-low": riskBand === "low",
                  "[&>div]:bg-risk-medium": riskBand === "medium",
                  "[&>div]:bg-risk-high": riskBand === "high",
                })}
              />
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground pt-2">
          Fórmula: Risco = (5 − média) ÷ 4 × 10. CRP global = média ponderada dos 4 pilares.
        </p>
      </CardContent>
    </Card>
  );
}
