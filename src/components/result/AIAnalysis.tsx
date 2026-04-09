import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Loader2 } from "lucide-react";
import { formatAIContent } from "@/lib/formatAIContent";

interface AIAnalysisProps {
  content: string | null;
  companyName: string;
  isLoading?: boolean;
}

export function AIAnalysis({ content, companyName, isLoading = false }: AIAnalysisProps) {
  return (
    // DS: card-featured = roxo glow border — máx 1 uso por viewport, adequado para peça de destaque
    <div className="card-featured p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 text-accent" />
          )}
        </div>
        <div>
          <h2 className="text-2xl">Análise Personalizada</h2>
          <p className="text-muted-foreground text-base">
            {isLoading
              ? "Gerando diagnóstico exclusivo…"
              : `Diagnóstico exclusivo para ${companyName}`}
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-5">
          <div className="space-y-3">
            {[
              { label: "Processando suas respostas…",                 delay: "0s" },
              { label: "Aplicando modelo de risco percebido…",        delay: "0.5s" },
              { label: "Gerando recomendações personalizadas…",       delay: "1s" },
            ].map(({ label, delay }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div
                  className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0"
                  style={{ animationDelay: delay }}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-2">
            {[12, 11, 10, 12, 9, 12, 8].map((w, i) => (
              <Skeleton key={i} className={`h-4 w-${w}/12`} />
            ))}
          </div>
        </div>
      ) : content ? (
        <div className="ai-content-wrapper space-y-6">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-xl mt-8 mb-4 pt-6 border-t border-accent/20 first:border-t-0 first:pt-0 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-relaxed mb-5 text-base">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="text-foreground font-semibold">{children}</strong>
              ),
              ul: ({ children }) => <ul className="space-y-4 my-5">{children}</ul>,
              ol: ({ children }) => (
                <ol className="space-y-4 my-5 list-decimal list-inside">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-muted-foreground leading-relaxed pl-2 border-l-2 border-accent/30 ml-2">
                  {children}
                </li>
              ),
            }}
          >
            {formatAIContent(content)}
          </ReactMarkdown>
        </div>
      ) : null}
    </div>
  );
}
