import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Clock, TrendingDown } from "lucide-react";
import { QUESTION_BANK_VERSION, PILLAR_NAMES, type Pillar } from "@/lib/questionBank";
import { PILLAR_ICONS, PILLAR_DESCRIPTIONS, PILLAR_WEIGHTS_DISPLAY } from "@/data/pillarConfig";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO — DS Ordus: glow roxo, padrão dark, chip estilo DS ── */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
        {/* Glow vermelho-escuro no topo (como DS real) */}
        <div className="hero-bg-glow" />
        {/* Glow roxo radial no topo-centro */}
        <div className="hero-glow" />

        <div className="container max-w-5xl mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="text-center space-y-8 motion-safe:animate-fade-in">

            {/* Hero chip — DS style */}
            <div
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium mx-auto"
              style={{
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.09)',
                color: 'hsl(var(--foreground))',
              }}
            >
              <CheckCircle2 className="w-4 h-4" style={{ color: '#00D4A0' }} />
              <span className="font-label text-[11px]">Diagnóstico completo em 5 minutos</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.0] max-w-3xl mx-auto">
              Identifique por que seus clientes{' '}
              <span style={{ color: '#C060FF' }}>travam as decisões de compra</span>
            </h1>

            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
               style={{ color: 'rgba(240,240,243,.62)' }}>
              O <strong style={{ color: '#F0F0F3' }}>Coeficiente de Risco Percebido (CRP)</strong> mede
              o índice de desconfiança que o cliente tem sobre seu negócio. Quanto maior o índice,
              mais tempo ele demora para decidir — ou desiste.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                size="lg"
                variant="cta"
                className="text-sm px-8 h-12"
                onClick={() => navigate("/checkup")}
              >
                Iniciar Checkup de Credibilidade
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <p className="text-xs font-handle" style={{ color: 'rgba(240,240,243,.38)' }}>
              20 perguntas · resultado imediato · plano de ação
            </p>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#0D0D0D' }}>
        <div className="container max-w-5xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl">O que é o CRP, na prática?</h2>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl mb-3">Os 4 Pilares CORE</h2>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {(["C", "O", "R", "E"] as Pillar[]).map((pillar, index) => {
              const Icon = PILLAR_ICONS[pillar];
              return (
                <div key={pillar} className="card-elevated p-6 motion-safe:animate-fade-in group" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(154,17,233,.13)', border: '1px solid rgba(154,17,233,.20)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#C060FF' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm">{PILLAR_NAMES[pillar]}</h3>
                        <span className="font-label text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(154,17,233,.15)', color: '#C060FF', border: '1px solid rgba(154,17,233,.30)', letterSpacing: '0.08em' }}>peso {PILLAR_WEIGHTS_DISPLAY[pillar]}</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#6A6A6A' }}>{PILLAR_DESCRIPTIONS[pillar]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl mb-3">Por que fazer o Checkup?</h2>
          </div>
          <div className="grid gap-1 md:grid-cols-3">
            {[
              { icon: Shield, title: 'Diagnóstico preciso', desc: 'Mapeamos os 4 pilares que mais impactam a confiança do decisor B2B.' },
              { icon: Clock, title: 'Resultado em 5 min', desc: '20 perguntas objetivas. Sem enrolação. Score, pilares e plano de ação imediato.' },
              { icon: TrendingDown, title: 'Plano de redução', desc: 'Cada resultado vem com ações concretas para reduzir o risco percebido.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-[#1A1A1A] border-b-2 border-b-transparent hover:border-b-accent hover:bg-[#1F1F1F] transition-colors duration-150">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.09)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'rgba(240,240,243,.7)' }} />
                </div>
                <h3 className="text-sm mb-2">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6A6A6A' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div className="container max-w-3xl mx-auto px-4">
          <div className="cta-box-glass p-12 text-center">
            <span className="font-label text-[11px] mb-4 block" style={{ color: '#9A11E9', letterSpacing: '0.12em' }}>Checkup de Credibilidade · v{QUESTION_BANK_VERSION}</span>
            <h2 className="text-2xl md:text-3xl mb-4">Comece seu diagnóstico agora</h2>
            <p className="text-sm mb-8 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(240,240,243,.5)' }}>20 perguntas objetivas. Resultado imediato com gargalos mapeados e plano de ação.</p>
            <Button asChild size="lg" variant="cta" className="text-sm px-8 h-12">
              <Link to="/checkup">Descobrir meu CRP agora →</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
