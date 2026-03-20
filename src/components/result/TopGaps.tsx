import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="card-elevated border-risk-high/20" id="gaps">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-risk-high" />
          Top 3 Gargalos Identificados
        </CardTitle>
        <CardDescription>
          As perguntas com menores notas — prioridades de correção imediata
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topGaps.map((gap, index) => {
          const Icon = PILLAR_ICONS[gap.pillar];
          return (
            <div
              key={gap.questionId}
              className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-risk-high/10 flex items-center justify-center">
                <span className="font-display font-semibold text-risk-high">{index + 1}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
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
      </CardContent>
    </Card>
  );
}
