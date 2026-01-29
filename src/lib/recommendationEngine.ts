// RecommendationEngine - Pure, deterministic recommendation generator
// Based on prioritization rules and Tier mapping from the spec

import { PILLAR_NAMES, type Pillar, type RiskBand } from "./questionBank";
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

// Bullet templates by pillar (Tier mapping)
const BULLET_TEMPLATES: Record<Pillar, string[]> = {
  C: [
    "Definir Protocolo + One Page: promessa, ICP/anti-ICP e CTA principal, garantindo consistência nos canais.",
    "Revisar mensagem central para eliminar termos genéricos e explicar problema/resultado em 5 segundos.",
    "Padronizar narrativa entre Instagram, LinkedIn, GBP e site principal.",
  ],
  O: [
    "Padronizar origem/pipeline e criar Aplicação BANT para qualificar antes do repasse, com handover rastreável.",
    "Implementar CRM com estágios legíveis e critérios de passagem claros.",
    "Criar regra de prioridade para 'levantou a mão' com SLA de atendimento definido (ex: 48h úteis).",
  ],
  R: [
    "Montar Página de Prova (hub no domínio) com evidências verificáveis e organizadas para validação rápida.",
    "Catalogar provas com contexto, resultado e antes/depois — não apenas elogios genéricos.",
    "Distribuir provas em múltiplas fontes (GBP, vídeos, cases) para validação independente.",
  ],
  E: [
    "Criar ativo escalável (ex: webinar gravado) para reduzir repetição e acelerar intenção.",
    "Estruturar máquina de aquisição operável sem depender do fundador (processo, CRM, automação).",
    "Garantir continuidade operacional dos ativos principais sob controle do cliente (LPMS).",
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
  // Prioritize bullets from the pillar with highest risk, then from other pillars with gaps
  const bullets: string[] = [];
  const usedPillars = new Set<Pillar>();

  // First, add a bullet for the highest risk pillar
  if (BULLET_TEMPLATES[highestRiskPillar]) {
    bullets.push(BULLET_TEMPLATES[highestRiskPillar][0]);
    usedPillars.add(highestRiskPillar);
  }

  // Then add bullets based on top gaps (if different pillars)
  for (const gap of topGaps) {
    if (!usedPillars.has(gap.pillar) && bullets.length < 3) {
      const pillarBullets = BULLET_TEMPLATES[gap.pillar];
      if (pillarBullets && pillarBullets.length > 0) {
        bullets.push(pillarBullets[0]);
        usedPillars.add(gap.pillar);
      }
    }
  }

  // If we still don't have 2-3 bullets, add more from the highest risk pillar
  while (bullets.length < 2 && BULLET_TEMPLATES[highestRiskPillar]) {
    const remainingBullets = BULLET_TEMPLATES[highestRiskPillar].filter(
      (b) => !bullets.includes(b)
    );
    if (remainingBullets.length > 0) {
      bullets.push(remainingBullets[0]);
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
      action: BULLET_TEMPLATES[pillar][0],
      risk: pillars[pillar].risk,
    }))
    .slice(0, 4); // Max 4 action items
}
