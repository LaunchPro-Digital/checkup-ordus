import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Target,
  Zap,
  Shield,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { PILLAR_NAMES, RISK_BANDS, type Pillar, type RiskBand } from "@/lib/questionBank";
import type { Submission } from "@/types/checkup";
import { cn } from "@/lib/utils";

interface ResultViewProps {
  submission: Submission;
  onSchedule?: () => void;
  onDownloadPDF?: () => void;
  onDownloadMarkdown?: () => void;
}

const PILLAR_ICONS: Record<Pillar, React.ElementType> = {
  C: Target,
  O: Zap,
  R: Shield,
  E: TrendingDown,
};

const RISK_COLORS: Record<RiskBand, { bg: string; text: string; border: string }> = {
  low: { bg: "bg-risk-low/10", text: "text-risk-low", border: "border-risk-low" },
  medium: { bg: "bg-risk-medium/10", text: "text-risk-medium", border: "border-risk-medium" },
  high: { bg: "bg-risk-high/10", text: "text-risk-high", border: "border-risk-high" },
};

const RISK_ICONS: Record<RiskBand, React.ElementType> = {
  low: CheckCircle2,
  medium: AlertCircle,
  high: AlertTriangle,
};

export function ResultView({
  submission,
  onSchedule,
  onDownloadPDF,
  onDownloadMarkdown,
}: ResultViewProps) {
  const { crp, pillars, topGaps, output, identity } = submission;
  const riskInfo = RISK_BANDS[crp.band];
  const RiskIcon = RISK_ICONS[crp.band];
  const riskColors = RISK_COLORS[crp.band];

  // Sort pillars by risk for display
  const sortedPillars = (["C", "O", "R", "E"] as Pillar[]).sort(
    (a, b) => pillars[b].risk - pillars[a].risk
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with company name */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Resultado do Checkup
        </h1>
        <p className="text-muted-foreground">
          {identity.companyName} · {identity.personName}
        </p>
      </div>

      {/* Main CRP Score Card */}
      <Card className={cn("border-2", riskColors.border)}>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="relative">
              <div
                className={cn(
                  "w-36 h-36 rounded-full flex flex-col items-center justify-center border-4",
                  riskColors.border,
                  riskColors.bg
                )}
              >
                <span className={cn("font-display text-5xl font-bold", riskColors.text)}>
                  {crp.score.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">de 10</span>
              </div>
            </div>

            {/* Score Interpretation */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <RiskIcon className={cn("w-6 h-6", riskColors.text)} />
                <Badge variant="outline" className={cn("text-base px-4 py-1", riskColors.border, riskColors.text)}>
                  Risco {riskInfo.label}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">{riskInfo.description}</p>
              <div className="text-sm text-muted-foreground">
                CRP baixo (0–2,9) = decisão flui · médio (3–5,4) = fricção · alto (5,5–10) = travamento
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pillar Breakdown */}
      <Card className="card-elevated">
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
                      <span className="text-muted-foreground text-sm ml-2">
                        (média {result.avg.toFixed(1)}/5)
                      </span>
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

      {/* Top 3 Gaps */}
      <Card className="card-elevated border-risk-high/20">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-risk-high" />
            Top 3 Gargalos
          </CardTitle>
          <CardDescription>
            As perguntas com menores notas — prioridades de correção
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
                  <span className="font-display font-semibold text-risk-high">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Icon className="w-3 h-3 mr-1" />
                      {PILLAR_NAMES[gap.pillar]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{gap.questionId}</span>
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

      {/* Recommendation */}
      <Card className="card-elevated border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            Recomendação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium text-foreground">{output.sentence}</p>
          <Separator />
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Próximos passos
            </p>
            <ul className="space-y-3">
              {output.bullets.map((bullet, index) => (
                <li key={index} className="flex gap-3">
                  <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                  <span className="text-foreground">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onSchedule && (
          <Button size="lg" onClick={onSchedule} className="bg-accent hover:bg-accent/90">
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Devolutiva
          </Button>
        )}
        {onDownloadPDF && (
          <Button size="lg" variant="outline" onClick={onDownloadPDF}>
            <Download className="w-5 h-5 mr-2" />
            Baixar PDF
          </Button>
        )}
        {onDownloadMarkdown && (
          <Button size="lg" variant="outline" onClick={onDownloadMarkdown}>
            <FileText className="w-5 h-5 mr-2" />
            Baixar Markdown
          </Button>
        )}
      </div>
    </div>
  );
}
