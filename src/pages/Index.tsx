import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Target, Zap, TrendingDown, CheckCircle2 } from "lucide-react";
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
      {/* Hero Section - Premium Black & White */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent" />
        <div className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Diagnóstico completo em 5 minutos
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
              Descubra o CRP atual
              <br />
              <span className="text-accent">da sua marca</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              O <strong className="text-foreground">Coeficiente de Risco Percebido (CRP)</strong> mede o índice de desconfiança que o cliente tem sobre seu negócio.
              <br className="hidden md:block" />
              Quanto maior o índice, maior o risco e mais tempo ele demora para decidir. Ou desiste.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="text-base px-8 h-12 shadow-elevated"
                onClick={() => navigate("/checkup")}
              >
                Iniciar Checkup de Credibilidade
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              20 perguntas objetivas · Resultado imediato com plano de ação
            </p>
          </div>
        </div>
      </section>

      {/* What is CRP */}
      <section className="py-20 bg-card">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              O que é o CRP, na prática?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              <strong className="text-foreground">CRP = Coeficiente de Risco Percebido.</strong>
              <br />
              É o nível de risco que o decisor percebe ao considerar comprar da sua empresa.
              Ele não mede risco real — mede <em>o que o cliente acha que pode dar errado</em>.
            </p>
            <div className="grid gap-4 md:grid-cols-3 pt-4">
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Avanço de etapa</p>
                <p className="font-medium">Trava quando CRP alto</p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Velocidade da decisão</p>
                <p className="font-medium">Lenta quando CRP alto</p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Sustentação de preço</p>
                <p className="font-medium">Pressão quando CRP alto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Os 4 Pilares CORE
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Avaliamos sua empresa em 4 dimensões que impactam a decisão de compra.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {(["C", "O", "R", "E"] as Pillar[]).map((pillar, index) => {
              const Icon = PILLAR_ICONS[pillar];
              const descriptions = {
                C: "O decisor entende o que você faz, para quem e por que confiar?",
                O: "Sua operação parece uma máquina organizada ou improvisada?",
                R: "Outros já confiaram? Dá para validar sem falar com você?",
                E: "Isso funciona agora e continua funcionando depois?",
              };
              const weights = { C: "30%", O: "25%", R: "30%", E: "15%" };

              return (
                <Card
                  key={pillar}
                  className="border border-border hover:border-foreground/20 transition-colors animate-fade-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-background" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-display font-semibold text-lg text-foreground">
                            {PILLAR_NAMES[pillar]}
                          </h3>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            peso {weights[pillar]}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {descriptions[pillar]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Risk Bands Section */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              O que o CRP revela
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Seu resultado de 0 a 10 indica o nível de risco percebido antes da decisão.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
            <div className="rounded-xl border-2 border-risk-low p-6 text-center bg-risk-low/5">
              <div className="font-display text-4xl font-bold text-risk-low mb-3">0–2,9</div>
              <div className="font-semibold text-foreground mb-2">Risco Baixo</div>
              <p className="text-sm text-muted-foreground">
                Decisão flui. Você passa confiança rápido.
              </p>
            </div>
            <div className="rounded-xl border-2 border-risk-medium p-6 text-center bg-risk-medium/5">
              <div className="font-display text-4xl font-bold text-risk-medium mb-3">3,0–5,4</div>
              <div className="font-semibold text-foreground mb-2">Risco Médio</div>
              <p className="text-sm text-muted-foreground">
                Ciclo longo, fricção. Mais objeção.
              </p>
            </div>
            <div className="rounded-xl border-2 border-risk-high p-6 text-center bg-risk-high/5">
              <div className="font-display text-4xl font-bold text-risk-high mb-3">5,5–10</div>
              <div className="font-semibold text-foreground mb-2">Risco Alto</div>
              <p className="text-sm text-muted-foreground">
                Vendas travam. "Vou pensar".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Pronto para descobrir seu CRP?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            20 perguntas objetivas. Resultado imediato com os principais gargalos e plano de ação.
          </p>
          <Button
            size="lg"
            className="text-base px-8 h-12 shadow-elevated"
            onClick={() => navigate("/checkup")}
          >
            Iniciar Checkup
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
