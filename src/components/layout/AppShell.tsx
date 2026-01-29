import { ReactNode } from "react";
import { QUESTION_BANK_VERSION } from "@/lib/questionBank";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">
                CRP
              </span>
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg text-foreground">
                Checkup de Credibilidade
              </h1>
              <p className="text-xs text-muted-foreground">
                Coeficiente de Risco Percebido
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="container max-w-4xl mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Assessoria CORE · Ordus</span>
          <span>Checkup v{QUESTION_BANK_VERSION}</span>
        </div>
      </footer>
    </div>
  );
}
