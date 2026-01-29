import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Target, TrendingDown, Zap } from "lucide-react";
import { QUESTION_BANK_VERSION, PILLAR_NAMES, type Pillar } from "@/lib/questionBank";

const PILLAR_ICONS: Record<Pillar, React.ElementType> = {
  C: Target,
  O: Zap,
  R: Shield,
  E: TrendingDown,
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-[0.03]" />
        <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent font-medium">
              <Shield className="w-4 h-4" />
              Diagnóstico gratuito
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Checkup de{" "}
              <span className="text-gradient">Credibilidade</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra o que está travando suas vendas. O CRP mede o{" "}
              <strong className="text-foreground">risco percebido</strong> pelo seu cliente —
              o que ele acha que pode dar errado antes de comprar de você.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={() => navigate("/checkup")}
              >
                Iniciar Checkup Gratuito
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              20 perguntas · 5 minutos · Resultado imediato
            </p>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 border-t border-border">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Os 4 Pilares do Risco Percebido
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Avaliamos sua empresa em 4 dimensões que impactam diretamente
              a decisão de compra do seu cliente.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(["C", "O", "R", "E"] as Pillar[]).map((pillar, index) => {
              const Icon = PILLAR_ICONS[pillar];
              const colors = [
                "border-pillar-c/30 bg-pillar-c/5",
                "border-pillar-o/30 bg-pillar-o/5",
                "border-pillar-r/30 bg-pillar-r/5",
                "border-pillar-e/30 bg-pillar-e/5",
              ];
              const iconColors = [
                "text-pillar-c",
                "text-pillar-o",
                "text-pillar-r",
                "text-pillar-e",
              ];

              return (
                <Card
                  key={pillar}
                  className={`border ${colors[index]} transition-all hover:shadow-md animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-card flex items-center justify-center mb-4 shadow-sm`}>
                      <Icon className={`w-6 h-6 ${iconColors[index]}`} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {PILLAR_NAMES[pillar]}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pillar === "C" && "O decisor entende o que você faz, para quem e por que confiar?"}
                      {pillar === "O" && "Sua operação parece organizada ou improvisada?"}
                      {pillar === "R" && "Outros já confiaram? Dá para validar sem falar com você?"}
                      {pillar === "E" && "Isso funciona sem depender do fundador?"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Risk Bands Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              O que o CRP revela
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Seu resultado de 0 a 10 indica o nível de risco que o cliente percebe
              antes de decidir comprar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
            <div className="rounded-lg border border-risk-low/30 bg-risk-low/5 p-6 text-center">
              <div className="font-display text-3xl font-bold text-risk-low mb-2">0–2,9</div>
              <div className="font-medium text-foreground mb-1">Risco Baixo</div>
              <p className="text-sm text-muted-foreground">
                Decisão flui. Você passa confiança rápido.
              </p>
            </div>
            <div className="rounded-lg border border-risk-medium/30 bg-risk-medium/5 p-6 text-center">
              <div className="font-display text-3xl font-bold text-risk-medium mb-2">3,0–5,4</div>
              <div className="font-medium text-foreground mb-1">Risco Médio</div>
              <p className="text-sm text-muted-foreground">
                Ciclo longo, fricção. Mais objeção e comparação.
              </p>
            </div>
            <div className="rounded-lg border border-risk-high/30 bg-risk-high/5 p-6 text-center">
              <div className="font-display text-3xl font-bold text-risk-high mb-2">5,5–10</div>
              <div className="font-medium text-foreground mb-1">Risco Alto</div>
              <p className="text-sm text-muted-foreground">
                Vendas travam. "Vou pensar", pressão por preço.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Pronto para descobrir seu CRP?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Responda 20 perguntas e receba um diagnóstico personalizado
            com os principais gargalos e recomendações.
          </p>
          <Button
            size="lg"
            className="text-lg px-8"
            onClick={() => navigate("/checkup")}
          >
            Começar Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card">
        <div className="container max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>Assessoria CORE · Ordus</span>
          <span>Checkup v{QUESTION_BANK_VERSION}</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
