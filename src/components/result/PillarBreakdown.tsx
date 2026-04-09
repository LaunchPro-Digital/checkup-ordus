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
    // DS: card-elevated = L1 surface (#0D0D0D), border rgba(255,255,255,.08)
    <div className="card-elevated p-6" id="pillars">
      <div className="mb-5">
        <h2 className="text-xl">Diagnóstico por Pilar</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Risco percebido em cada dimensão (ordenado do maior para o menor risco)
        </p>
      </div>

      <div className="space-y-6">
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
                  <span className="font-medium">{PILLAR_NAMES[pillar]}</span>
                </div>
                <span className={cn("font-black text-lg", colors.text)}>
                  {result.risk.toFixed(1)}
                </span>
              </div>
              <Progress
                value={riskPercent}
                className={cn("h-2", {
                  "[&>div]:bg-risk-low":    riskBand === "low",
                  "[&>div]:bg-risk-medium": riskBand === "medium",
                  "[&>div]:bg-risk-high":   riskBand === "high",
                })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
