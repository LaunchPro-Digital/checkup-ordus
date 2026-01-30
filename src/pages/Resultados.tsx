import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ResultView } from "@/components/result/ResultView";
import { Loader2 } from "lucide-react";
import type { Submission } from "@/types/checkup";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_STORAGE_KEY = "crp_integration_settings";

export default function Resultados() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    // Get submission from navigation state
    const stateSubmission = location.state?.submission as Submission | undefined;
    
    if (!stateSubmission) {
      toast({
        title: "Erro",
        description: "Nenhum resultado encontrado. Por favor, refaça o checkup.",
        variant: "destructive",
      });
      navigate("/checkup");
      return;
    }

    setSubmission(stateSubmission);
    
    // Send webhook to n8n and wait for AI response
    sendWebhookAndWaitForResponse(stateSubmission);
  }, [location.state, navigate, toast]);

  const sendWebhookAndWaitForResponse = async (sub: Submission) => {
    try {
      // Get webhook settings from localStorage
      const settingsStr = localStorage.getItem(WEBHOOK_STORAGE_KEY);
      const settings = settingsStr ? JSON.parse(settingsStr) : null;
      
      if (!settings?.webhookUrl || !settings?.webhookEnabled) {
        // No webhook configured, just show results without AI content
        setIsLoading(false);
        return;
      }

      const payload = {
        event: "checkup.completed",
        submission_id: sub.id,
        created_at: sub.createdAt.toISOString(),
        identity: sub.identity,
        channels: sub.channels,
        answers: sub.answers,
        pillars: sub.pillars,
        crp: sub.crp,
        top_gaps: sub.topGaps,
        output: sub.output,
        integrations: {
          agenda_url: settings.agendaUrl || "",
        },
      };

      // Generate HMAC signature
      const signature = settings.webhookSecret 
        ? await generateHMAC(JSON.stringify(payload), settings.webhookSecret)
        : "no-secret";

      const response = await fetch(settings.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Ordus-Signature": `sha256=${signature}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        // Check if n8n returned AI-generated content
        if (data && (data.aiContent || data.content || data.message || data.text)) {
          const content = data.aiContent || data.content || data.message || data.text;
          setAiContent(content);
        }
      } else {
        console.error("Webhook failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error sending webhook:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = () => {
    const settingsStr = localStorage.getItem(WEBHOOK_STORAGE_KEY);
    const settings = settingsStr ? JSON.parse(settingsStr) : null;
    
    if (settings?.agendaUrl) {
      window.open(settings.agendaUrl, "_blank");
    } else {
      toast({
        title: "Agendamento",
        description: "O link de agendamento será configurado nas Integrações.",
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (submission) {
      const { downloadPDF } = await import("@/lib/pdfExporter");
      downloadPDF(submission);
      toast({
        title: "PDF",
        description: "O relatório será aberto para impressão/download.",
      });
    }
  };

  const handleDownloadMarkdown = async () => {
    if (submission) {
      const { downloadMarkdown } = await import("@/lib/markdownExporter");
      downloadMarkdown(submission);
      toast({
        title: "Markdown",
        description: "Arquivo .md baixado com sucesso.",
      });
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-muted" />
            <Loader2 className="w-20 h-20 absolute top-0 left-0 animate-spin text-accent" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Carregando resultados...
            </h2>
            <p className="text-muted-foreground max-w-md">
              Estamos analisando suas respostas e preparando um diagnóstico personalizado para sua marca.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <AppShell>
      <ResultView
        submission={submission}
        aiContent={aiContent}
        onSchedule={handleSchedule}
        onDownloadPDF={handleDownloadPDF}
        onDownloadMarkdown={handleDownloadMarkdown}
      />
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
