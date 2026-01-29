import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Lock,
  AlertTriangle,
  Webhook,
  Calendar,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  TestTube,
  Sparkles,
} from "lucide-react";
import { generateMockSubmission } from "@/lib/mockDataEngine";
import { downloadMarkdown } from "@/lib/markdownExporter";
import { downloadPDF } from "@/lib/pdfExporter";
import type { RiskBand } from "@/lib/questionBank";

interface IntegrationSettings {
  webhookUrl: string;
  webhookSecret: string;
  webhookEnabled: boolean;
  agendaUrl: string;
}

interface TestResult {
  type: string;
  success: boolean;
  statusCode?: number;
  latencyMs?: number;
  error?: string;
  timestamp: Date;
}

const DEFAULT_SETTINGS: IntegrationSettings = {
  webhookUrl: "",
  webhookSecret: "",
  webhookEnabled: false,
  agendaUrl: "",
};

const STORAGE_KEY = "crp_integration_settings";

export default function Integrations() {
  const [settings, setSettings] = useState<IntegrationSettings>(DEFAULT_SETTINGS);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load integration settings:", error);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: IntegrationSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    toast({
      title: "Configurações salvas",
      description: "As alterações foram salvas localmente.",
    });
  };

  const updateSetting = <K extends keyof IntegrationSettings>(
    key: K,
    value: IntegrationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleSave = () => {
    saveSettings(settings);
  };

  // Test webhook
  const testWebhook = async (useMock: boolean) => {
    if (!settings.webhookUrl) {
      toast({
        title: "URL não configurada",
        description: "Configure a URL do webhook primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    const startTime = Date.now();

    try {
      // Generate mock submission for payload
      const mockSubmission = generateMockSubmission("medium");
      
      const payload = {
        event: "checkup.completed",
        submission_id: mockSubmission.id,
        created_at: mockSubmission.createdAt.toISOString(),
        identity: mockSubmission.identity,
        channels: mockSubmission.channels,
        answers: mockSubmission.answers,
        pillars: mockSubmission.pillars,
        crp: mockSubmission.crp,
        top_gaps: mockSubmission.topGaps,
        output: mockSubmission.output,
        integrations: {
          agenda_url: settings.agendaUrl,
        },
        _test: true,
        _mock: useMock,
      };

      // Try to send the webhook
      const response = await fetch(settings.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Ordus-Signature": `sha256=${await generateHMAC(JSON.stringify(payload), settings.webhookSecret)}`,
        },
        body: JSON.stringify(payload),
      });

      const latencyMs = Date.now() - startTime;

      const result: TestResult = {
        type: useMock ? "webhook_mock" : "webhook_test",
        success: response.ok,
        statusCode: response.status,
        latencyMs,
        timestamp: new Date(),
      };

      if (!response.ok) {
        result.error = `HTTP ${response.status}: ${response.statusText}`;
      }

      setTestResults((prev) => [result, ...prev.slice(0, 9)]);

      toast({
        title: response.ok ? "Webhook enviado!" : "Falha no envio",
        description: response.ok
          ? `Status ${response.status} em ${latencyMs}ms`
          : `Erro: ${response.status} ${response.statusText}`,
        variant: response.ok ? "default" : "destructive",
      });
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";

      setTestResults((prev) => [
        {
          type: useMock ? "webhook_mock" : "webhook_test",
          success: false,
          latencyMs,
          error: errorMessage,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9),
      ]);

      toast({
        title: "Erro ao enviar webhook",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Test agenda
  const testAgenda = () => {
    if (!settings.agendaUrl) {
      toast({
        title: "URL não configurada",
        description: "Configure a URL de agendamento primeiro.",
        variant: "destructive",
      });
      return;
    }

    window.open(settings.agendaUrl, "_blank");
    
    setTestResults((prev) => [
      {
        type: "agenda_click",
        success: true,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ]);

    toast({
      title: "Link aberto",
      description: "A página de agendamento foi aberta em nova aba.",
    });
  };

  // Generate mock result
  const generateMockResult = (band: RiskBand) => {
    const submission = generateMockSubmission(band);
    
    setTestResults((prev) => [
      {
        type: "mock_generated",
        success: true,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ]);

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
            Configure webhooks, agendamento e geração de dados de teste.
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
              Área sensível
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Qualquer alteração aqui pode invalidar todo o checkup da sua marca.{" "}
              <strong className="text-foreground">
                Se você não sabe exatamente o que está fazendo, não mexa em nada.
              </strong>
            </p>
          </div>
        </div>

        {/* Webhook Settings */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Webhook className="w-5 h-5 text-foreground" />
              <CardTitle className="font-display text-xl">Webhook</CardTitle>
              <Badge variant={settings.webhookEnabled ? "default" : "secondary"}>
                {settings.webhookEnabled ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <CardDescription>
              Receba os resultados do checkup automaticamente via POST.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="webhook-enabled">Enviar webhook no submit</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Envia payload automaticamente ao finalizar checkup
                </p>
              </div>
              <Switch
                id="webhook-enabled"
                checked={settings.webhookEnabled}
                onCheckedChange={(checked) => updateSetting("webhookEnabled", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://seu-endpoint.com/webhook"
                value={settings.webhookUrl}
                onChange={(e) => updateSetting("webhookUrl", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Secret (HMAC-SHA256)</Label>
              <Input
                id="webhook-secret"
                type="password"
                placeholder="Chave secreta para assinatura"
                value={settings.webhookSecret}
                onChange={(e) => updateSetting("webhookSecret", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Header: X-Ordus-Signature: sha256=&lt;hex&gt;
              </p>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => testWebhook(true)}
                disabled={isTesting || !settings.webhookUrl}
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4 mr-2" />
                )}
                Testar com Mock
              </Button>
              <Button onClick={handleSave}>Salvar Configurações</Button>
            </div>
          </CardContent>
        </Card>

        {/* Agenda Settings */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-foreground" />
              <CardTitle className="font-display text-xl">Agendamento</CardTitle>
            </div>
            <CardDescription>
              Link exibido no resultado para agendar devolutiva.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agenda-url">URL de Agendamento</Label>
              <Input
                id="agenda-url"
                type="url"
                placeholder="https://calendly.com/sua-agenda"
                value={settings.agendaUrl}
                onChange={(e) => updateSetting("agendaUrl", e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={testAgenda} disabled={!settings.agendaUrl}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Testar Link
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
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

        {/* Test History */}
        {testResults.length > 0 && (
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-xl">Histórico de Testes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm"
                  >
                    {result.success ? (
                      <CheckCircle2 className="w-4 h-4 text-risk-low flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-risk-high flex-shrink-0" />
                    )}
                    <span className="font-medium">{result.type}</span>
                    {result.statusCode && (
                      <Badge variant="outline">HTTP {result.statusCode}</Badge>
                    )}
                    {result.latencyMs && (
                      <span className="text-muted-foreground">{result.latencyMs}ms</span>
                    )}
                    {result.error && (
                      <span className="text-destructive truncate">{result.error}</span>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {result.timestamp.toLocaleTimeString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

// Helper: Generate HMAC-SHA256 signature
async function generateHMAC(message: string, secret: string): Promise<string> {
  if (!secret) return "no-secret";
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  try {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return "hmac-error";
  }
}
