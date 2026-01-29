// MockDataEngine - Generate fake submissions for testing

import { QUESTIONS, type Pillar, type RiskBand } from "./questionBank";
import { calculateCRP } from "./crpEngine";
import { generateRecommendation } from "./recommendationEngine";
import type { Identity, Channel, Answer, Submission } from "@/types/checkup";

// Faker-like data
const COMPANY_NAMES = [
  "Tech Solutions Ltda",
  "Consultoria Alpha",
  "Grupo Omega",
  "Serviços Beta",
  "Indústria Delta",
  "Agência Sigma",
  "Startup Gamma",
  "Empresa Epsilon",
];

const PERSON_NAMES = [
  "João Silva",
  "Maria Santos",
  "Pedro Costa",
  "Ana Oliveira",
  "Carlos Pereira",
  "Lucia Ferreira",
  "Roberto Almeida",
  "Patricia Lima",
];

const SEGMENTS = [
  "Consultoria B2B",
  "SaaS Mid-Market",
  "Indústria Técnica",
  "Serviços Profissionais",
  "Agência Digital",
  "E-commerce B2B",
];

const AUDIENCES = [
  "Diretores de marketing de PMEs",
  "CTOs de startups",
  "Gestores de operações",
  "Empresários do varejo",
  "Gerentes de RH",
  "Executivos C-level",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomEmail(name: string): string {
  const firstName = name.split(" ")[0].toLowerCase();
  const domains = ["empresa.com.br", "consultoria.com", "tech.io", "grupo.com.br"];
  return `${firstName}@${randomItem(domains)}`;
}

function randomPhone(): string {
  const ddd = ["11", "21", "31", "41", "51"][Math.floor(Math.random() * 5)];
  const number = Math.floor(Math.random() * 900000000 + 100000000);
  return `+55 ${ddd} ${String(number).slice(0, 5)}-${String(number).slice(5)}`;
}

/**
 * Generate answers that will result in a specific risk band
 */
function generateAnswersForBand(targetBand: RiskBand, maxAttempts = 20): Answer[] {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const answers: Answer[] = QUESTIONS.map((q) => {
      let score: 1 | 2 | 3 | 4 | 5;
      
      if (targetBand === "low") {
        // Mostly 4-5
        score = Math.random() < 0.8 
          ? (Math.random() < 0.5 ? 5 : 4) 
          : (Math.random() < 0.5 ? 3 : 4) as 1 | 2 | 3 | 4 | 5;
      } else if (targetBand === "medium") {
        // Mostly 2-4
        const rand = Math.random();
        if (rand < 0.2) score = 2;
        else if (rand < 0.5) score = 3;
        else if (rand < 0.85) score = 4;
        else score = 5;
      } else {
        // High risk: Mostly 1-3
        const rand = Math.random();
        if (rand < 0.4) score = 1;
        else if (rand < 0.7) score = 2;
        else score = 3;
      }
      
      return { questionId: q.id, score };
    });

    // Validate the result
    try {
      const result = calculateCRP(answers);
      if (result.crp.band === targetBand) {
        return answers;
      }
    } catch {
      continue;
    }
  }

  // Fallback: generate deterministic answers
  return QUESTIONS.map((q) => ({
    questionId: q.id,
    score: (targetBand === "low" ? 5 : targetBand === "medium" ? 3 : 1) as 1 | 2 | 3 | 4 | 5,
  }));
}

/**
 * Generate a complete mock submission
 */
export function generateMockSubmission(targetBand: RiskBand = "medium"): Submission {
  const personName = randomItem(PERSON_NAMES);
  const companyName = randomItem(COMPANY_NAMES);

  const identity: Identity = {
    companyName,
    personName,
    email: randomEmail(personName),
    whatsapp: randomPhone(),
    segment: randomItem(SEGMENTS),
    targetAudience: randomItem(AUDIENCES),
  };

  const channels: Channel[] = [
    { type: "website", url: `https://${companyName.toLowerCase().replace(/\s+/g, "")}.com.br` },
    { type: "linkedin", url: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, "-")}` },
    { type: "instagram", url: `https://instagram.com/${companyName.toLowerCase().replace(/\s+/g, "")}` },
  ];

  const answers = generateAnswersForBand(targetBand);
  const crpResult = calculateCRP(answers);
  const recommendation = generateRecommendation(
    crpResult.crp.band,
    crpResult.pillars,
    crpResult.topGaps
  );

  // Generate a proper UUID
  const id = crypto.randomUUID ? crypto.randomUUID() : `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    createdAt: new Date(),
    identity,
    channels,
    answers,
    pillars: crpResult.pillars,
    crp: crpResult.crp,
    topGaps: crpResult.topGaps,
    output: recommendation,
  };
}
