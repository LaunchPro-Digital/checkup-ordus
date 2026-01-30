import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ResultView } from "@/components/result/ResultView";
import { Loader2, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Submission } from "@/types/checkup";
import { useToast } from "@/hooks/use-toast";

// URLs fixas (protegidas no código)
const WEBHOOK_URL = "https://webhook.launchpro.digital/webhook/checkup_respostas";
const AGENDA_URL = "https://devolutiva.ordusdigital.com.br/checkup-de-credibilidade";

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
          agenda_url: AGENDA_URL,
        },
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Webhook response:", JSON.stringify(data, null, 2));
        
        // Parse n8n response - prefer markdown format for best formatting
        let content: string | null = null;
        
        // Helper to extract content from devolutiva object - prefer markdown format
        const extractContent = (devolutiva: { markdown?: string; text?: string; html?: string }) => {
          // Prefer markdown format for best formatting with proper line breaks
          return devolutiva?.markdown || devolutiva?.text || null;
        };
        
        // Check if response is an array (n8n format)
        if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          // n8n returns { devolutiva: { markdown: "...", text: "...", html: "..." } }
          if (firstItem?.devolutiva) {
            content = extractContent(firstItem.devolutiva);
          } else if (firstItem?.aiContent || firstItem?.content || firstItem?.message || firstItem?.text) {
            content = firstItem.aiContent || firstItem.content || firstItem.message || firstItem.text;
          }
        } 
        // Check if response is a direct object
        else if (data && typeof data === "object") {
          if (data.devolutiva) {
            content = extractContent(data.devolutiva);
          } else if (data.aiContent || data.content || data.message || data.text) {
            content = data.aiContent || data.content || data.message || data.text;
          }
        }
        
        if (content) {
          console.log("AI content found:", content.substring(0, 100) + "...");
          setAiContent(content);
        } else {
          console.warn("No AI content found in webhook response");
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
    window.open(AGENDA_URL, "_blank");
  };

  const handleDownloadPDF = async () => {
    if (submission) {
      const { downloadPDF } = await import("@/lib/pdfExporter");
      downloadPDF(submission, aiContent);
      toast({
        title: "PDF",
        description: "O relatório será aberto para impressão/download.",
      });
    }
  };

  const handleDownloadMarkdown = async () => {
    if (submission) {
      const { downloadMarkdown } = await import("@/lib/markdownExporter");
      downloadMarkdown(submission, aiContent);
      toast({
        title: "Markdown",
        description: "Arquivo .md baixado com sucesso.",
      });
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-8 animate-fade-in">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>

          {/* Gauge skeleton */}
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <Skeleton className="w-64 h-32 rounded-t-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-accent" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-6 w-80 mx-auto" />
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>
          </div>

          {/* AI Analysis skeleton */}
          <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-9/12" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-foreground animate-pulse">
              Analisando suas respostas com IA...
            </p>
            <p className="text-sm text-muted-foreground">
              Isso pode levar até 1 minuto. Por favor, aguarde.
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

