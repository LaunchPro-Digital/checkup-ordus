import { useNavigate } from "react-router-dom";
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
  Target,
  Zap,
  Shield,
  TrendingDown,
  ArrowRight,
  Home,
  Lightbulb,
} from "lucide-react";
import { PILLAR_NAMES, RISK_BANDS, type Pillar, type RiskBand } from "@/lib/questionBank";
import { generateDetailedActions } from "@/lib/recommendationEngine";
import type { Submission } from "@/types/checkup";
import { cn } from "@/lib/utils";
import { CRPGauge } from "./CRPGauge";

interface ResultViewProps {
  submission: Submission;
  aiContent?: string | null;
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

export function ResultView({
  submission,
  aiContent,
  onSchedule,
  onDownloadPDF,
  onDownloadMarkdown,
}: ResultViewProps) {
  const navigate = useNavigate();
  const { crp, pillars, topGaps, identity } = submission;
  const riskInfo = RISK_BANDS[crp.band];

  // Generate detailed actions based on answers
  const detailedResult = generateDetailedActions(crp.band, pillars, topGaps);

  // Sort pillars by risk for display
  const sortedPillars = (["C", "O", "R", "E"] as Pillar[]).sort(
    (a, b) => pillars[b].risk - pillars[a].risk
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Export buttons at top */}
      <div className="flex flex-wrap gap-3 justify-end">
        {onDownloadPDF && (
          <Button size="sm" variant="outline" onClick={onDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Salvar PDF
          </Button>
        )}
        {onDownloadMarkdown && (
          <Button size="sm" variant="outline" onClick={onDownloadMarkdown}>
            <FileText className="w-4 h-4 mr-2" />
            Salvar Markdown
          </Button>
        )}
      </div>

      {/* Header with company name */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Resultado do Checkup de Credibilidade
        </h1>
        <p className="text-muted-foreground text-lg">
          {identity.companyName} · {identity.personName}
        </p>
      </div>

      {/* Main CRP Gauge */}
      <Card className="border-2 border-foreground/10">
        <CardContent className="p-8 md:p-12">
          <CRPGauge score={crp.score} band={crp.band} animate />
          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-lg text-muted-foreground">
              O Coeficiente de Risco Percebido da{" "}
              <span className="font-semibold text-foreground">{identity.companyName}</span>{" "}
              é de: <span className="font-display text-2xl font-bold text-foreground">{crp.score.toFixed(1)}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Impact Explanation - Dynamic based on band */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            O que isso significa para suas vendas?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-base">
            {detailedResult.impactExplanation}
          </p>
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

      {/* AI-Generated Content (from n8n webhook) */}
      {aiContent && (
        <Card className="card-elevated border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-accent" />
              Análise Personalizada para {identity.companyName}
            </CardTitle>
            <CardDescription className="text-base">
              Diagnóstico gerado com base nas suas respostas específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
              {aiContent.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Actions - Detailed (shown when no AI content) */}
      {!aiContent && (
        <Card className="card-elevated border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-accent" />
              Ações Emergenciais Para Elevar o CRP
            </CardTitle>
            <CardDescription className="text-base">
              Baseado nas suas respostas, estas são as 3 ações com maior impacto potencial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {detailedResult.actions.map((action, index) => {
              const Icon = PILLAR_ICONS[action.pillar];
              return (
                <div key={index} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <span className="font-display text-xl font-bold text-accent">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-foreground text-background">
                          <Icon className="w-3 h-3 mr-1" />
                          {action.pillarName}
                        </Badge>
                      </div>
                      <h3 className="font-display font-semibold text-lg text-foreground">
                        {action.action}
                      </h3>
                      
                      <div className="space-y-3 pl-0 md:pl-4 border-l-0 md:border-l-2 border-accent/20">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">Por que isso é essencial?</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {action.why}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">Impacto esperado:</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {action.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < detailedResult.actions.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* CTA for Credibility Machine */}
      <Card className="card-elevated border-foreground/20 bg-foreground/[0.02]">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            Por que implementar uma Máquina de Geração de Credibilidade?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-base">
            {detailedResult.ctaExplanation}
          </p>
        </CardContent>
      </Card>

      {/* Footer CTA Section */}
      <Card className="border-2 border-accent bg-accent/5">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Quer uma análise personalizada?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa equipe está disponível para entrar em mais detalhes de como melhorar o 
              Coeficiente de Risco Percebido da sua marca, baseado nas respostas que você deu, 
              de forma completamente personalizada.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onSchedule && (
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={onSchedule}>
                <Calendar className="w-5 h-5 mr-2" />
                AGENDAR DEVOLUTIVA
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              <Home className="w-5 h-5 mr-2" />
              Finalizar Diagnóstico
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}