import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  AlertTriangle,
  Sparkles,
  Play,
} from "lucide-react";
import { generateMockSubmission } from "@/lib/mockDataEngine";
import { downloadMarkdown } from "@/lib/markdownExporter";
import { downloadPDF } from "@/lib/pdfExporter";
import { useToast } from "@/hooks/use-toast";
import type { RiskBand } from "@/lib/questionBank";

export default function Integrations() {
  const { toast } = useToast();

  // Generate mock result
  const generateMockResult = (band: RiskBand) => {
    const submission = generateMockSubmission(band);

    toast({
      title: "Mock gerado!",
      description: `CRP ${submission.crp.score.toFixed(1)} - Risco ${band === "low" ? "Baixo" : band === "medium" ? "Médio" : "Alto"}`,
    });

    // Auto-download both formats
    downloadMarkdown(submission);
    setTimeout(() => downloadPDF(submission), 500);
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Integrações</h1>
          <p className="text-muted-foreground mt-1">
            Ferramentas de teste e geração de dados.
          </p>
        </div>

        {/* Lock Banner */}
        <div className="rounded-lg border-2 border-destructive/50 bg-destructive/5 p-4 flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Área restrita
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Esta área é destinada apenas para testes internos.{" "}
              <strong className="text-foreground">
                As configurações de webhook e agendamento estão protegidas no código.
              </strong>
            </p>
          </div>
        </div>

        {/* Integration Status */}
        <Card className="card-elevated border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="font-display text-xl">Status das Integrações</CardTitle>
            <CardDescription>
              Configurações protegidas e fixas no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Webhook n8n</p>
                <p className="text-xs text-muted-foreground">Envia dados ao finalizar checkup</p>
              </div>
              <Badge variant="default" className="bg-risk-low">Ativo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">URL de Agendamento</p>
                <p className="text-xs text-muted-foreground">Devolutiva personalizada</p>
              </div>
              <Badge variant="default" className="bg-risk-low">Configurado</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Mock Data Generator */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-foreground" />
              <CardTitle className="font-display text-xl">Gerador de Mock</CardTitle>
            </div>
            <CardDescription>
              Gere submissões fictícias para testes sem preencher o wizard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecione a faixa de risco desejada. Será gerada uma submissão completa
              e baixada automaticamente em PDF e Markdown.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-risk-low hover:bg-risk-low/10"
                onClick={() => generateMockResult("low")}
              >
                <Play className="w-4 h-4 mr-2" />
                Risco Baixo (0–2,9)
              </Button>
              <Button
                variant="outline"
                className="border-risk-medium hover:bg-risk-medium/10"
                onClick={() => generateMockResult("medium")}
              >
                <Play className="w-4 h-4 mr-2" />
                Risco Médio (3–5,4)
              </Button>
              <Button
                variant="outline"
                className="border-risk-high hover:bg-risk-high/10"
                onClick={() => generateMockResult("high")}
              >
                <Play className="w-4 h-4 mr-2" />
                Risco Alto (5,5–10)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
