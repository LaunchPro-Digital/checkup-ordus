import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Download,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { type Pillar } from "@/lib/questionBank";
import { generateDetailedActions } from "@/lib/recommendationEngine";
import type { Submission } from "@/types/checkup";
import { PILLAR_ICONS } from "@/data/pillarConfig";
import { CRPGauge } from "./CRPGauge";
import { PillarBreakdown } from "./PillarBreakdown";
import { TopGaps } from "./TopGaps";
import { AIAnalysis } from "./AIAnalysis";

interface ResultViewProps {
  submission: Submission;
  aiContent?: string | null;
  isAiLoading?: boolean;
  onSchedule?: () => void;
  onDownloadPDF?: () => void;
  onDownloadMarkdown?: () => void;
}

export function ResultView({
  submission,
  aiContent,
  isAiLoading = false,
  onSchedule,
  onDownloadPDF,
  onDownloadMarkdown,
}: ResultViewProps) {
  const { crp, pillars, topGaps, identity } = submission;

  const detailedResult = generateDetailedActions(crp.band, pillars, topGaps);

  const sortedPillars = (["C", "O", "R", "E"] as Pillar[]).sort(
    (a, b) => pillars[b].risk - pillars[a].risk
  );

  return (
    <div className="space-y-10 motion-safe:animate-fade-in">

      {/* ── Anchor navigation ── */}
      <nav
        aria-label="Navegação rápida"
        className="flex flex-wrap gap-2 sticky top-[57px] z-20 py-2 -mx-4 px-4 bg-background/90 backdrop-blur-md border-b"
        style={{ borderColor: "rgba(255,255,255,.08)" }}
      >
        {[
          { href: "#gauge",    label: "Score" },
          { href: "#pillars",  label: "Pilares" },
          { href: "#gaps",     label: "Gargalos" },
          { href: "#analysis", label: "Análise IA" },
          { href: "#cta",      label: "Próximo passo" },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="font-label text-[11px] px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.09)",
              color: "rgba(240,240,243,.7)",
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* ── Header ── */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Resultado do Checkup de Credibilidade
        </h1>
        <p className="text-muted-foreground text-lg">
          {identity.companyName} · {identity.personName}
        </p>
      </div>

      {/* ── CRP Gauge ── */}
      <Card className="border-2 border-foreground/10" id="gauge">
        <CardContent className="p-8 md:p-12">
          <CRPGauge score={crp.score} band={crp.band} animate />
        </CardContent>
      </Card>

      {/* ── Pillar Breakdown ── */}
      <div id="pillars">
        <PillarBreakdown pillars={pillars} sortedPillars={sortedPillars} />
      </div>

      {/* ── Top 3 Gaps ── */}
      <div id="gaps">
        <TopGaps topGaps={topGaps} />
      </div>

      {/* ── AI Analysis — sempre renderizado; isLoading controla estado interno ── */}
      <div id="analysis">
        {(isAiLoading || aiContent) && (
          <AIAnalysis
            content={aiContent ?? null}
            companyName={identity.companyName}
            isLoading={isAiLoading}
          />
        )}
      </div>

      {/* ── Fallback actions — só quando IA terminou E sem conteúdo ── */}
      {!isAiLoading && !aiContent && (
        <Card className="card-elevated border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              AÇÕES PARA REDUZIR O RISCO PERCEBIDO
            </CardTitle>
            <CardDescription className="text-base">
              Com base no seu diagnóstico, estas são as 3 ações com maior impacto para reduzir o
              risco percebido pelo seu cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {detailedResult.actions.map((action, index) => {
              const Icon = PILLAR_ICONS[action.pillar];
              return (
                <div key={index} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <span className="font-display text-xl font-bold text-accent">{index + 1}</span>
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
                          <p className="text-sm text-muted-foreground leading-relaxed">{action.why}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">Impacto esperado:</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{action.impact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < detailedResult.actions.length - 1 && <Separator className="my-6" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ── Credibility Machine explanation ── */}
      <Card className="card-elevated border-foreground/10" style={{ background: "rgba(255,255,255,.01)" }}>
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

      {/* ── Footer CTA ── */}
      <Card className="border-2 border-accent bg-accent/5" id="cta">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground">
              RECEBA UMA ANÁLISE PERSONALIZADA
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa equipe aprofunda a análise do Coeficiente de Risco Percebido da sua marca com
              base nas respostas deste diagnóstico, de forma completamente personalizada.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onSchedule && (
              <Button size="lg" variant="cta" onClick={onSchedule}>
                <Calendar className="w-5 h-5 mr-2" />
                FALAR COM UM ESPECIALISTA
              </Button>
            )}
          </div>

          {/* Export actions */}
          {(onDownloadPDF || onDownloadMarkdown) && (
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {onDownloadPDF && (
                <Button size="sm" variant="ghost" onClick={onDownloadPDF} className="text-muted-foreground">
                  <Download className="w-4 h-4 mr-2" />
                  Salvar PDF
                </Button>
              )}
              {onDownloadMarkdown && (
                <Button size="sm" variant="ghost" onClick={onDownloadMarkdown} className="text-muted-foreground">
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
