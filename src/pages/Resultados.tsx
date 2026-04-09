import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ResultView } from "@/components/result/ResultView";
import type { Submission } from "@/types/checkup";
import { toast } from "sonner";
import { APP_CONFIG } from "@/data/appConfig";
import { fetchWithRetry } from "@/lib/webhookClient";

export default function Resultados() {
  const navigate = useNavigate();
  const location = useLocation();

  // AI loading is separate — the result renders immediately
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const stateSubmission = location.state?.submission as Submission | undefined;

    if (!stateSubmission) {
      toast.error("Erro", {
        description: "Nenhum resultado encontrado. Por favor, refaça o checkup.",
      });
      navigate("/checkup");
      return;
    }

    setSubmission(stateSubmission);
    // Fire both calls in parallel — GHL registration is fire-and-forget (lead never lost if AI fails)
    sendWebhookAndWaitForResponse(stateSubmission);
    registerLeadInGHL(stateSubmission);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fire-and-forget: register lead in GHL via Vercel serverless function.
   * Runs in parallel with AI analysis — if AI fails, lead is already captured.
   */
  const registerLeadInGHL = async (sub: Submission) => {
    try {
      const body = {
        name: sub.identity.personName,
        email: sub.identity.email,
        phone: sub.identity.whatsapp || undefined,
        empresa: sub.identity.companyName || undefined,
        segmento: sub.identity.segment || undefined,
        publico: sub.identity.targetAudience || undefined,
        crpScore: sub.crp.score,
        topGaps: sub.topGaps.map((g) => g.text),
        canais: sub.channels.map((c) => c.label || c.type),
      };

      const res = await fetch(APP_CONFIG.registerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('[GHL] Lead registered:', data.contactId, data.opportunityId);
        // Enrich the submission object in-state with GHL ids
        setSubmission((prev) =>
          prev
            ? {
                ...prev,
                ghlContactId: data.contactId,
                ghlOpportunityId: data.opportunityId,
                ghlRegisteredAt: new Date(),
              }
            : prev
        );
      } else {
        console.warn('[GHL] Registration failed:', res.status, await res.text());
      }
    } catch (err) {
      // Non-fatal — user still sees results
      console.error('[GHL] Registration error:', err);
    }
  };

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
          agenda_url: APP_CONFIG.agendaUrl,
        },
      };

      const response = await fetchWithRetry(APP_CONFIG.webhookUrl, payload);

      if (response.ok) {
        const data = await response.json();
        console.log("Webhook response:", JSON.stringify(data, null, 2));

        let content: string | null = null;

        const extractContent = (devolutiva: { markdown?: string; text?: string; html?: string }) =>
          devolutiva?.markdown || devolutiva?.text || null;

        if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          if (firstItem?.devolutiva) {
            content = extractContent(firstItem.devolutiva);
          } else if (firstItem?.aiContent || firstItem?.content || firstItem?.message || firstItem?.text) {
            content = firstItem.aiContent || firstItem.content || firstItem.message || firstItem.text;
          }
        } else if (data && typeof data === "object") {
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
      console.error("Webhook failed permanently:", error);
      toast.error("Análise indisponível", {
        description:
          "Não foi possível gerar a análise com IA. Os resultados básicos estão disponíveis abaixo.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSchedule = () => {
    const w = window.open(APP_CONFIG.agendaUrl, "_blank", "noopener,noreferrer");
    if (!w) {
      navigator.clipboard.writeText(APP_CONFIG.agendaUrl).then(
        () =>
          toast.info("Link copiado", {
            description:
              "Pop-up bloqueado. O link foi copiado para sua área de transferência.",
          }),
        () =>
          toast.error("Pop-up bloqueado", { description: `Acesse: ${APP_CONFIG.agendaUrl}` })
      );
    }
  };

  const handleDownloadPDF = async () => {
    if (submission) {
      const { downloadPDF } = await import("@/lib/pdfExporter");
      downloadPDF(submission, aiContent);
      toast.success("PDF", {
        description: "O relatório será aberto para impressão/download.",
      });
    }
  };

  const handleDownloadMarkdown = async () => {
    if (submission) {
      const { downloadMarkdown } = await import("@/lib/markdownExporter");
      downloadMarkdown(submission, aiContent);
      toast.success("Markdown", {
        description: "Arquivo .md baixado com sucesso.",
      });
    }
  };

  // Guard: redirect immediately if no submission data
  if (!submission) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Carregando…</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ResultView
        submission={submission}
        aiContent={aiContent}
        isAiLoading={isAiLoading}
        onSchedule={handleSchedule}
        onDownloadPDF={handleDownloadPDF}
        onDownloadMarkdown={handleDownloadMarkdown}
      />
    </AppShell>
  );
}
