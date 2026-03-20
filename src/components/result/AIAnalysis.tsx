import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="card-elevated border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-accent" />
            )}
          </div>
          <div>
            <CardTitle className="font-display text-2xl">Análise Personalizada</CardTitle>
            <CardDescription className="text-base">
              {isLoading
                ? "Gerando diagnóstico exclusivo…"
                : `Diagnóstico exclusivo para ${companyName}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-5">
            {/* Progress steps */}
            <div className="space-y-3">
              {[
                { label: "Processando suas respostas…", delay: "0s" },
                { label: "Aplicando modelo de risco percebido…", delay: "0.5s" },
                { label: "Gerando recomendações personalizadas…", delay: "1s" },
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
            {/* Skeleton lines */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-8/12" />
            </div>
          </div>
        ) : content ? (
          <div className="ai-content-wrapper space-y-6">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="font-display text-xl font-bold text-foreground mt-8 mb-4 pt-6 border-t border-accent/20 first:border-t-0 first:pt-0 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-display text-lg font-semibold text-foreground mt-6 mb-3">
                    {children}
                  </h3>
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
      </CardContent>
    </Card>
  );
}
