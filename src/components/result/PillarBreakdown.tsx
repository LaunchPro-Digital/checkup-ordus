import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PILLAR_NAMES, type Pillar } from "@/lib/questionBank";
import { PILLAR_ICONS, RISK_COLORS } from "@/data/pillarConfig";
import type { PillarResult } from "@/types/checkup";
import { cn } from "@/lib/utils";

interface PillarBreakdownProps {
  pillars: Record<Pillar, PillarResult>;
  sortedPillars: Pillar[];
}

export function PillarBreakdown({ pillars, sortedPillars }: PillarBreakdownProps) {
  return (
    <Card className="card-elevated" id="pillars">
      <CardHeader>
        <CardTitle className="font-display text-xl">Diagnóstico por Pilar</CardTitle>
        <CardDescription>
          Risco percebido em cada dimensão (ordenado do maior para o menor risco)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedPillars.map((pillar) => {
          const result = pillars[pillar];
          const Icon = PILLAR_ICONS[pillar];
          const riskPercent = (result.risk / 10) * 100;
          const riskBand = result.risk <= 2.9 ? "low" : result.risk <= 5.4 ? "medium" : "high";
          const colors = RISK_COLORS[riskBand];

          return (
            <div key={pillar} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.bg)}>
                    <Icon className={cn("w-4 h-4", colors.text)} />
                  </div>
                  <div>
                    <span className="font-medium">{PILLAR_NAMES[pillar]}</span>
                  </div>
                </div>
                <div className={cn("font-display font-semibold", colors.text)}>
                  {result.risk.toFixed(1)}
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
      </CardContent>
    </Card>
  );
}
