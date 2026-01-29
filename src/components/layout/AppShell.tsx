import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { QUESTION_BANK_VERSION } from "@/lib/questionBank";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const isIntegrations = location.pathname === "/integrations";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
          </Link>
          <Link
            to="/integrations"
            className={cn(
              "p-2 rounded-lg transition-colors",
              isIntegrations ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title="Integrações"
          >
            <Settings className="w-5 h-5" />
          </Link>
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
