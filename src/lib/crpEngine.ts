// CRPEngine - Pure, deterministic calculation engine
// Implements the exact formula from the spec document

import {
  QUESTIONS,
  PILLAR_WEIGHTS,
  getRiskBand,
  type Pillar,
  type RiskBand,
} from "./questionBank";
import type { Answer, PillarResult, CRPResult, TopGap } from "@/types/checkup";

export interface CRPCalculation {
  pillars: Record<Pillar, PillarResult>;
  crp: CRPResult;
  topGaps: TopGap[];
}

/**
 * Calculate the average score for a pillar (1-5 scale)
 */
function calculatePillarAverage(answers: Answer[], pillar: Pillar): number {
  const pillarQuestions = QUESTIONS.filter((q) => q.pillar === pillar);
  const pillarAnswers = answers.filter((a) =>
    pillarQuestions.some((q) => q.id === a.questionId)
  );

  if (pillarAnswers.length === 0) return 0;

  const sum = pillarAnswers.reduce((acc, a) => acc + a.score, 0);
  return sum / pillarAnswers.length;
}

/**
 * Convert average (1-5) to risk (0-10)
 * Formula: Risco = (5 - média) / 4 × 10
 */
function averageToRisk(avg: number): number {
  return ((5 - avg) / 4) * 10;
}

/**
 * Calculate weighted CRP from pillar risks
 * CRP = (RiscoC × 0.30) + (RiscoO × 0.25) + (RiscoR × 0.30) + (RiscoE × 0.15)
 */
function calculateWeightedCRP(pillarRisks: Record<Pillar, number>): number {
  return (
    pillarRisks.C * PILLAR_WEIGHTS.C +
    pillarRisks.O * PILLAR_WEIGHTS.O +
    pillarRisks.R * PILLAR_WEIGHTS.R +
    pillarRisks.E * PILLAR_WEIGHTS.E
  );
}

/**
 * Find top 3 gaps (lowest scoring questions)
 * Tiebreaker: lower question_id first (Q01 before Q02)
 */
function findTopGaps(answers: Answer[]): TopGap[] {
  const sortedAnswers = [...answers].sort((a, b) => {
    // First by score ascending (lower = worse = higher priority)
    if (a.score !== b.score) return a.score - b.score;
    // Tiebreaker: question_id ascending
    return a.questionId.localeCompare(b.questionId);
  });

  return sortedAnswers.slice(0, 3).map((answer) => {
    const question = QUESTIONS.find((q) => q.id === answer.questionId)!;
    return {
      questionId: answer.questionId,
      score: answer.score,
      pillar: question.pillar,
      text: question.text,
    };
  });
}

/**
 * Main CRP calculation function
 * Pure function with deterministic output
 */
export function calculateCRP(answers: Answer[]): CRPCalculation {
  if (answers.length !== 20) {
    throw new Error(`Expected 20 answers, got ${answers.length}`);
  }

  // Step 1: Calculate averages for each pillar
  const pillars: Pillar[] = ["C", "O", "R", "E"];
  const pillarResults: Record<Pillar, PillarResult> = {} as Record<Pillar, PillarResult>;
  const pillarRisks: Record<Pillar, number> = {} as Record<Pillar, number>;

  for (const pillar of pillars) {
    const avg = calculatePillarAverage(answers, pillar);
    const risk = averageToRisk(avg);

    pillarResults[pillar] = {
      avg: Number(avg.toFixed(2)),
      risk: Number(risk.toFixed(2)),
    };
    pillarRisks[pillar] = risk;
  }

  // Step 2: Calculate weighted CRP
  const crpScore = calculateWeightedCRP(pillarRisks);
  const crpBand = getRiskBand(crpScore);

  // Step 3: Find top 3 gaps
  const topGaps = findTopGaps(answers);

  return {
    pillars: pillarResults,
    crp: {
      score: Number(crpScore.toFixed(2)),
      band: crpBand,
    },
    topGaps,
  };
}

/**
 * Get pillars sorted by risk (highest first)
 * Used for prioritization in recommendations
 */
export function getPillarsByRisk(pillars: Record<Pillar, PillarResult>): Pillar[] {
  return (["C", "O", "R", "E"] as Pillar[]).sort(
    (a, b) => pillars[b].risk - pillars[a].risk
  );
}

/**
 * Test cases verification (for unit tests)
 */
export const TEST_FIXTURES = {
  // All 5s = risk 0, CRP 0, band low
  allFives: {
    answers: QUESTIONS.map((q) => ({ questionId: q.id, score: 5 as const })),
    expected: {
      crpScore: 0,
      band: "low" as RiskBand,
    },
  },
  // All 1s = risk 10, CRP 10, band high
  allOnes: {
    answers: QUESTIONS.map((q) => ({ questionId: q.id, score: 1 as const })),
    expected: {
      crpScore: 10,
      band: "high" as RiskBand,
    },
  },
  // All 3s = risk 5, CRP 5, band medium
  allThrees: {
    answers: QUESTIONS.map((q) => ({ questionId: q.id, score: 3 as const })),
    expected: {
      crpScore: 5,
      band: "medium" as RiskBand,
    },
  },
};
