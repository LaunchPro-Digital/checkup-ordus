// QuestionBank v1 - Source of Truth (Immutable)
// Changes require new version (questionBank.v2.ts)

export const QUESTION_BANK_VERSION = "2026-01";

export type Pillar = "C" | "O" | "R" | "E";

export const PILLAR_NAMES: Record<Pillar, string> = {
  C: "Clareza",
  O: "Organização",
  R: "Reputação",
  E: "Expansão",
};

export const PILLAR_DESCRIPTIONS: Record<Pillar, string> = {
  C: "O decisor entende o que você faz, para quem e por que confiar?",
  O: "Isso parece uma máquina organizada ou improvisada, até a qualificação e o repasse ao comercial?",
  R: "Outros já confiaram? Dá pra validar sem falar com você?",
  E: "Isso funciona agora e continua funcionando depois (sem depender do fundador e sem improviso)?",
};

export const PILLAR_WEIGHTS: Record<Pillar, number> = {
  C: 0.30,
  O: 0.25,
  R: 0.30,
  E: 0.15,
};

export interface Question {
  id: string;
  pillar: Pillar;
  text: string;
  order: number;
}

export const QUESTIONS: Question[] = [
  // Clareza (C) - peso 30%
  {
    id: "Q01",
    pillar: "C",
    order: 1,
    text: "Em até 5 segundos, alguém externo entende o que você faz e para quem ao ver sua presença principal (One Page/página inicial)?",
  },
  {
    id: "Q02",
    pillar: "C",
    order: 2,
    text: "Sua mensagem deixa claro quem é o cliente ideal e quem NÃO é (anti-ICP)?",
  },
  {
    id: "Q03",
    pillar: "C",
    order: 3,
    text: 'Sua proposta central explica o problema principal e o resultado esperado sem termos genéricos ("solução completa", "qualidade", "excelência")?',
  },
  {
    id: "Q04",
    pillar: "C",
    order: 4,
    text: "Existem CTAs claros para as intenções principais: falar com a equipe e entrar na base (lead magnet)?",
  },
  {
    id: "Q05",
    pillar: "C",
    order: 5,
    text: "A narrativa está consistente entre Instagram, GBP/GMN, LinkedIn e One Page (mesma promessa, mesma direção)?",
  },

  // Organização (O) - peso 25%
  {
    id: "Q06",
    pillar: "O",
    order: 6,
    text: 'A origem do lead é identificável e registrada no CRM (ex.: "Lead do Site", "Lead Magnet/Base")?',
  },
  {
    id: "Q07",
    pillar: "O",
    order: 7,
    text: 'Existe um pipeline mínimo no CRM com estágios legíveis e critérios de passagem claros (sem "status aleatório")?',
  },
  {
    id: "Q08",
    pillar: "O",
    order: 8,
    text: "Existe uma Aplicação (Cadastro Avançado) que coleta BANT e padroniza a qualificação antes de repassar ao comercial?",
  },
  {
    id: "Q09",
    pillar: "O",
    order: 9,
    text: '"Levantou a mão" (respondeu e-mail/WhatsApp pedindo contato) vira prioridade e vai para Aplicação BANT (mesmo sem webinar)?',
  },
  {
    id: "Q10",
    pillar: "O",
    order: 10,
    text: "O repasse ao Closer acontece com rastreio (card no CRM + notificação + informações essenciais) e prazo de atendimento combinado (ex.: 48h úteis)?",
  },

  // Reputação (R) - peso 30%
  {
    id: "Q11",
    pillar: "R",
    order: 11,
    text: "Existe uma Página de Prova (hub no domínio) com provas organizadas em vídeo, imagem e texto?",
  },
  {
    id: "Q12",
    pillar: "R",
    order: 12,
    text: "As provas são específicas e verificáveis (contexto, resultado, antes/depois quando aplicável), e não apenas elogios genéricos?",
  },
  {
    id: "Q13",
    pillar: "R",
    order: 13,
    text: 'As provas estão catalogadas e acessíveis (ex.: documento no Drive com links/arquivos + contexto), sem depender de "caçar no WhatsApp"?',
  },
  {
    id: "Q14",
    pillar: "R",
    order: 14,
    text: "Você tem provas distribuídas em mais de uma fonte confiável (ex.: GBP/avaliações, vídeos, cases, posts), e não apenas prints soltos?",
  },
  {
    id: "Q15",
    pillar: "R",
    order: 15,
    text: "Um novo cliente conseguiria validar sua credibilidade sem falar com você, em menos de 10 minutos?",
  },

  // Expansão (E) - peso 15%
  {
    id: "Q16",
    pillar: "E",
    order: 16,
    text: "Existe um ativo escalável de convencimento (ex.: webinar gravado) que reduz repetição de explicações e acelera intenção?",
  },
  {
    id: "Q17",
    pillar: "E",
    order: 17,
    text: "Sua máquina de aquisição e aquecimento é operável sem depender do fundador (processo mínimo, CRM, automação e ativos)?",
  },
  {
    id: "Q18",
    pillar: "E",
    order: 18,
    text: "Sua presença cobre pontos de contato complementares (social + busca local + rede profissional) e direciona para entradas claras (One Page/Lead Magnet)?",
  },
  {
    id: "Q19",
    pillar: "E",
    order: 19,
    text: "Os ativos principais (One Page, CRM, automação, sequência) têm continuidade operacional sob controle do cliente (mantendo LPMS)?",
  },
  {
    id: "Q20",
    pillar: "E",
    order: 20,
    text: 'O prospect entende com clareza o próximo passo (o que acontece depois do contato) sem sensação de improviso?',
  },
];

export const getQuestionsByPillar = (pillar: Pillar): Question[] => {
  return QUESTIONS.filter((q) => q.pillar === pillar);
};

export const SCALE_LABELS = {
  1: "Muito fraco / inexistente",
  2: "Fraco",
  3: "Inconsistente",
  4: "Bom",
  5: "Forte e consistente",
} as const;

export const RISK_BANDS = {
  low: { min: 0, max: 2.9, label: "Baixo", description: "Decisão flui" },
  medium: { min: 3.0, max: 5.4, label: "Médio", description: "Ciclo longo, fricção" },
  high: { min: 5.5, max: 10, label: "Alto", description: "Travamento, pressão por preço" },
} as const;

export type RiskBand = keyof typeof RISK_BANDS;

export const getRiskBand = (score: number): RiskBand => {
  if (score <= 2.9) return "low";
  if (score <= 5.4) return "medium";
  return "high";
};
