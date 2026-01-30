// RecommendationEngine - Pure, deterministic recommendation generator
// Based on prioritization rules and Tier mapping from the spec

import { PILLAR_NAMES, QUESTIONS, type Pillar, type RiskBand } from "./questionBank";
import type { PillarResult, TopGap, RecommendationOutput } from "@/types/checkup";
import { getPillarsByRisk } from "./crpEngine";

// Sentence templates by risk band
const SENTENCE_TEMPLATES: Record<RiskBand, (pillar: string) => string> = {
  high: (pillar) =>
    `Seu risco percebido está alto porque sinais de ${pillar} ainda deixam o decisor inseguro antes de avançar.`,
  medium: (pillar) =>
    `Você já tem sinais de credibilidade, mas com fricção; o ganho mais rápido está em fortalecer ${pillar} para encurtar a decisão.`,
  low: (pillar) =>
    `Seu risco percebido está controlado; o foco é reforçar ${pillar} para manter consistência.`,
};

// Detailed impact explanations by risk band
const IMPACT_EXPLANATIONS: Record<RiskBand, string> = {
  high: `Com um CRP alto, seu potencial cliente está em estado de alerta máximo. Ele percebe riscos significativos em fazer negócios com você, mesmo que esses riscos não sejam reais. O resultado? Ciclos de venda extremamente longos, objeções constantes sobre preço e, na maioria dos casos, ele simplesmente desaparece com um "vou pensar". Cada dia que passa com esse nível de risco percebido, você está perdendo vendas para concorrentes que transmitem mais segurança, mesmo que ofereçam menos valor real.`,
  medium: `Seu CRP médio indica que você está "no meio do caminho". O cliente vê potencial na sua oferta, mas ainda sente fricção — aquela sensação de que algo pode dar errado. Isso se traduz em negociações arrastadas, pedidos de desconto e a necessidade de muito mais esforço do seu comercial para fechar cada venda. Você não está perdendo todos os negócios, mas está deixando dinheiro na mesa e gastando energia desnecessária para compensar a falta de sinais claros de credibilidade.`,
  low: `Seu CRP baixo é uma vantagem competitiva real. O cliente percebe baixo risco em fazer negócios com você, o que acelera decisões e reduz objeções. No entanto, não se acomode: a manutenção desse status exige consistência. Qualquer falha de comunicação ou experiência negativa pode elevar rapidamente o risco percebido. O foco agora é consolidar os ativos que te trouxeram até aqui e garantir que eles continuem operando com excelência.`,
};

// CTA explanations for why implement the credibility machine
const CTA_EXPLANATIONS: Record<RiskBand, string> = {
  high: `Uma Máquina de Geração de Credibilidade é um sistema integrado de ativos digitais (One Page, provas catalogadas, CRM, automação) que trabalham 24/7 para reduzir o risco percebido antes mesmo do primeiro contato comercial. Para o seu nível atual de CRP, isso não é opcional — é emergencial. Sem essa estrutura, você continuará dependendo exclusivamente do esforço humano para convencer cada cliente, um processo insustentável e caro.`,
  medium: `A implementação de uma Máquina de Geração de Credibilidade vai eliminar a fricção que está travando suas vendas. Com ativos organizados e integrados, você para de "apagar incêndios" de credibilidade a cada negociação e passa a receber contatos que já chegam mais confiantes. O resultado é um time comercial mais eficiente, menos tempo explicando o básico e mais tempo fechando negócios de maior valor.`,
  low: `Mesmo com um CRP controlado, a construção de uma Máquina de Geração de Credibilidade garante que você não dependa de fatores externos ou da sorte para manter esse resultado. Ela sistematiza o que está funcionando, documenta suas provas de resultado e cria um ativo escalável que pode ser operado por qualquer membro da equipe. É a diferença entre ter um negócio que funciona e ter um negócio que funciona sem você.`,
};

// Bullet templates by pillar with detailed explanations
interface ActionTemplate {
  action: string;
  why: string;
  impact: string;
}

const ACTION_TEMPLATES: Record<Pillar, ActionTemplate[]> = {
  C: [
    {
      action: "Definir Protocolo + One Page: promessa, ICP/anti-ICP e CTA principal",
      why: "Sem clareza sobre o que você faz e para quem, o cliente gasta energia mental tentando te categorizar — e quando ele não consegue, classifica como 'arriscado'.",
      impact: "Com uma comunicação clara em 7 segundos, você elimina a primeira barreira de desconfiança e permite que o decisor avance para avaliar sua proposta de valor.",
    },
    {
      action: "Revisar mensagem central para eliminar termos genéricos",
      why: "Palavras como 'qualidade', 'excelência' e 'solução completa' são ruído — todo mundo usa e ninguém acredita. Elas aumentam o risco percebido porque parecem que você está escondendo algo.",
      impact: "Uma mensagem específica (problema + resultado esperado) posiciona você como especialista e reduz a percepção de risco associada a generalistas.",
    },
    {
      action: "Padronizar narrativa entre todos os canais digitais",
      why: "Quando o cliente encontra mensagens diferentes no Instagram, LinkedIn e site, ele percebe desorganização — e desorganização gera desconfiança.",
      impact: "Consistência entre canais reforça que você sabe o que está fazendo e tem controle sobre sua comunicação.",
    },
  ],
  O: [
    {
      action: "Implementar CRM com origem rastreável e pipeline estruturado",
      why: "Sem saber de onde vem cada lead e em que estágio está, você não consegue priorizar e perde oportunidades quentes enquanto atende leads frios.",
      impact: "Com rastreabilidade, você identifica quais canais trazem os melhores leads e aloca recursos onde realmente funciona.",
    },
    {
      action: "Criar processo de qualificação antes do repasse ao comercial",
      why: "Quando o comercial recebe leads não qualificados, ele perde tempo e motivação. Pior: o lead percebe que você não entende suas necessidades.",
      impact: "Com qualificação estruturada (BANT ou similar), o comercial foca em leads prontos para comprar e fecha mais rápido.",
    },
    {
      action: "Definir SLA de atendimento para leads que 'levantam a mão'",
      why: "Um lead que pede contato e espera dias para ser atendido conclui que você não é organizado — e projeta essa desorganização no pós-venda.",
      impact: "Atendimento rápido (ex: 48h úteis) demonstra profissionalismo e reduz o risco percebido de ser mal atendido depois da compra.",
    },
  ],
  R: [
    {
      action: "Criar Página de Prova com depoimentos em vídeo, texto e imagem",
      why: "O cliente precisa validar sua credibilidade SEM falar com você. Se ele não encontra provas facilmente, assume que não existem — e isso é risco máximo.",
      impact: "Uma página de prova organizada permite validação rápida e independente, removendo uma das maiores barreiras de decisão.",
    },
    {
      action: "Catalogar provas com contexto, resultado e antes/depois",
      why: "Elogios genéricos ('ótimo trabalho!') não convencem ninguém. O cliente quer ver situação similar à dele com resultado mensurável.",
      impact: "Provas específicas e verificáveis criam identificação e permitem que o cliente projete o mesmo resultado para si.",
    },
    {
      action: "Distribuir provas em múltiplas fontes confiáveis",
      why: "Provas apenas no seu site podem parecer fabricadas. O cliente quer ver avaliações no Google, posts no LinkedIn, menções independentes.",
      impact: "Múltiplas fontes criam a percepção de reputação consolidada, não apenas auto-promoção.",
    },
  ],
  E: [
    {
      action: "Criar ativo escalável de convencimento (webinar/vídeo de vendas)",
      why: "Se você precisa explicar a mesma coisa para cada lead, não escala. Além disso, o cliente pode preferir consumir informação no seu tempo.",
      impact: "Um ativo de convencimento funciona 24/7, qualifica leads automaticamente e libera seu tempo para focar em negociações quentes.",
    },
    {
      action: "Estruturar operação para funcionar sem depender do fundador",
      why: "Se tudo depende de você, o cliente percebe fragilidade: 'e se algo acontecer com ele?' Isso é risco de continuidade.",
      impact: "Processos documentados e equipe treinada transmitem solidez e reduzem o medo de depender de uma pessoa só.",
    },
    {
      action: "Implementar automação de recepção, aquecimento e follow-up",
      why: "Leads que ficam 'esfriando' enquanto você não tem tempo de atender vão para a concorrência ou simplesmente desistem.",
      impact: "Automação mantém o lead engajado e aquecido até que você tenha tempo de atendê-lo pessoalmente.",
    },
  ],
};

/**
 * Generate recommendation output based on CRP results
 * Pure function with deterministic output
 */
export function generateRecommendation(
  band: RiskBand,
  pillars: Record<Pillar, PillarResult>,
  topGaps: TopGap[]
): RecommendationOutput {
  // Get pillars sorted by risk (highest first)
  const sortedPillars = getPillarsByRisk(pillars);
  const highestRiskPillar = sortedPillars[0];
  const highestRiskPillarName = PILLAR_NAMES[highestRiskPillar];

  // For low risk, use the weakest pillar (which might still be relatively strong)
  const targetPillar = band === "low" ? sortedPillars[0] : highestRiskPillar;
  const targetPillarName = PILLAR_NAMES[targetPillar];

  // Generate sentence
  const sentence = SENTENCE_TEMPLATES[band](targetPillarName);

  // Generate bullets based on top gaps
  const bullets: string[] = [];
  const usedPillars = new Set<Pillar>();

  // First, add a bullet for the highest risk pillar
  if (ACTION_TEMPLATES[highestRiskPillar]) {
    bullets.push(ACTION_TEMPLATES[highestRiskPillar][0].action);
    usedPillars.add(highestRiskPillar);
  }

  // Then add bullets based on top gaps (if different pillars)
  for (const gap of topGaps) {
    if (!usedPillars.has(gap.pillar) && bullets.length < 3) {
      const pillarActions = ACTION_TEMPLATES[gap.pillar];
      if (pillarActions && pillarActions.length > 0) {
        bullets.push(pillarActions[0].action);
        usedPillars.add(gap.pillar);
      }
    }
  }

  // If we still don't have 2-3 bullets, add more from the highest risk pillar
  while (bullets.length < 2 && ACTION_TEMPLATES[highestRiskPillar]) {
    const remainingActions = ACTION_TEMPLATES[highestRiskPillar].filter(
      (a) => !bullets.includes(a.action)
    );
    if (remainingActions.length > 0) {
      bullets.push(remainingActions[0].action);
    } else {
      break;
    }
  }

  return {
    sentence,
    bullets: bullets.slice(0, 3), // Max 3 bullets
  };
}

/**
 * Generate detailed emergency actions with full explanations
 */
export function generateDetailedActions(
  band: RiskBand,
  pillars: Record<Pillar, PillarResult>,
  topGaps: TopGap[]
): {
  impactExplanation: string;
  ctaExplanation: string;
  actions: Array<{
    pillar: Pillar;
    pillarName: string;
    action: string;
    why: string;
    impact: string;
  }>;
} {
  const sortedPillars = getPillarsByRisk(pillars);
  const actions: Array<{
    pillar: Pillar;
    pillarName: string;
    action: string;
    why: string;
    impact: string;
  }> = [];
  const usedPillars = new Set<Pillar>();

  // Prioritize actions based on top gaps
  for (const gap of topGaps) {
    if (!usedPillars.has(gap.pillar) && actions.length < 3) {
      const pillarActions = ACTION_TEMPLATES[gap.pillar];
      if (pillarActions && pillarActions.length > 0) {
        actions.push({
          pillar: gap.pillar,
          pillarName: PILLAR_NAMES[gap.pillar],
          ...pillarActions[0],
        });
        usedPillars.add(gap.pillar);
      }
    }
  }

  // If we don't have 3 actions yet, add from sorted pillars
  for (const pillar of sortedPillars) {
    if (!usedPillars.has(pillar) && actions.length < 3) {
      const pillarActions = ACTION_TEMPLATES[pillar];
      if (pillarActions && pillarActions.length > 0) {
        actions.push({
          pillar,
          pillarName: PILLAR_NAMES[pillar],
          ...pillarActions[0],
        });
        usedPillars.add(pillar);
      }
    }
  }

  return {
    impactExplanation: IMPACT_EXPLANATIONS[band],
    ctaExplanation: CTA_EXPLANATIONS[band],
    actions,
  };
}

/**
 * Get tier classification for a pillar gap
 * Clareza, Organização = Tier 1
 * Reputação, Expansão = Tier 2
 */
export function getTierForPillar(pillar: Pillar): 1 | 2 {
  if (pillar === "C" || pillar === "O") return 1;
  return 2;
}

/**
 * Get action items sorted by tier and risk priority
 */
export function getActionItems(
  pillars: Record<Pillar, PillarResult>,
  topGaps: TopGap[]
): Array<{
  tier: 1 | 2;
  pillar: Pillar;
  pillarName: string;
  action: string;
  risk: number;
}> {
  const sortedPillars = getPillarsByRisk(pillars);

  return sortedPillars
    .filter((p) => pillars[p].risk > 0)
    .map((pillar) => ({
      tier: getTierForPillar(pillar),
      pillar,
      pillarName: PILLAR_NAMES[pillar],
      action: ACTION_TEMPLATES[pillar][0].action,
      risk: pillars[pillar].risk,
    }))
    .slice(0, 4); // Max 4 action items
}