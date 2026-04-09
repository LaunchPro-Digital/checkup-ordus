import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { PILLAR_NAMES } from "@/lib/questionBank";
import { PILLAR_ICONS } from "@/data/pillarConfig";
import type { TopGap } from "@/types/checkup";

interface TopGapsProps {
  topGaps: TopGap[];
}

export function TopGaps({ topGaps }: TopGapsProps) {
  return (
    // DS: card-elevated + subtle risk-high border tint
    <div
      className="card-elevated p-6"
      id="gaps"
      style={{ borderColor: 'rgba(239,68,68,0.20)' }}
    >
      <div className="mb-5">
        <h2 className="text-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-risk-high flex-shrink-0" />
          Top 3 Gargalos Identificados
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          As perguntas com menores notas — prioridades de correção imediata
        </p>
      </div>

      <div className="space-y-4">
        {topGaps.map((gap, index) => {
          const Icon = PILLAR_ICONS[gap.pillar];
          return (
            // DS: pain-item = border-left roxa, bg sutil, rounded direita
            <div key={gap.questionId} className="flex gap-4 pain-item">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-risk-high/10 flex items-center justify-center">
                <span className="font-black text-risk-high">{index + 1}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    <Icon className="w-3 h-3 mr-1" />
                    {PILLAR_NAMES[gap.pillar]}
                  </Badge>
                  <Badge variant="destructive" className="text-xs">
                    Nota {gap.score}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{gap.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
