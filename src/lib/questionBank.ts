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
    text: "Ao visitar seu site, Instagram, Google Meu Negócio ou LinkedIn, um potencial cliente pode entender claramente o que você faz em 7 segundos?",
  },
  {
    id: "Q02",
    pillar: "C",
    order: 2,
    text: "Sua comunicação online deixa claro quem é o seu cliente ideal e quem não é?",
  },
  {
    id: "Q03",
    pillar: "C",
    order: 3,
    text: "Está claro qual é o problema que sua marca resolve e o resultado que o cliente pode esperar fechando negócios com você?",
  },
  {
    id: "Q04",
    pillar: "C",
    order: 4,
    text: "Existem vários botões e chamadas claras para o potencial cliente falar com sua equipe e avançar na negociação?",
  },
  {
    id: "Q05",
    pillar: "C",
    order: 5,
    text: "Os canais digitais têm a mesma comunicação de forma consistente (mesma promessa, mesma direção)?",
  },

  // Organização (O) - peso 25%
  {
    id: "Q06",
    pillar: "O",
    order: 6,
    text: "A empresa tem um CRM onde consegue identificar claramente a origem dos contatos e potenciais clientes?",
  },
  {
    id: "Q07",
    pillar: "O",
    order: 7,
    text: "Existe um pipeline mínimo no CRM com estágios bem definidos de acordo com a jornada do cliente?",
  },
  {
    id: "Q08",
    pillar: "O",
    order: 8,
    text: "Existe um formulário ou sequência de perguntas específicas que demonstra a qualificação do contato antes de repassar ao comercial?",
  },
  {
    id: "Q09",
    pillar: "O",
    order: 9,
    text: "Quando um contato demonstra interesse, se torna prioridade máxima e passa por um processo/formulário de qualificação para avançar o mais rápido possível?",
  },
  {
    id: "Q10",
    pillar: "O",
    order: 10,
    text: "Existe integração entre marketing e comercial repassando contatos qualificados contendo todas as informações essenciais para um fechamento rápido e confiável?",
  },

  // Reputação (R) - peso 30%
  {
    id: "Q11",
    pillar: "R",
    order: 11,
    text: "Existe uma página de prova, contendo depoimentos em vídeos, textos e imagens dos clientes satisfeitos?",
  },
  {
    id: "Q12",
    pillar: "R",
    order: 12,
    text: "As provas e depoimentos que estão nas redes sociais são específicos e verificáveis, e não apenas elogios genéricos?",
  },
  {
    id: "Q13",
    pillar: "R",
    order: 13,
    text: 'As provas e depoimentos enviados pelos clientes estão facilmente acessíveis e catalogados em uma fonte confiável, sem depender de "caçar no WhatsApp"?',
  },
  {
    id: "Q14",
    pillar: "R",
    order: 14,
    text: "Todas as reclamações e críticas dos clientes são tratadas e resolvidas da melhor maneira possível, de modo a serem transformadas em depoimentos?",
  },
  {
    id: "Q15",
    pillar: "R",
    order: 15,
    text: "Um novo cliente conseguiria validar sua credibilidade sem falar com você em menos de 10 minutos?",
  },

  // Expansão (E) - peso 15%
  {
    id: "Q16",
    pillar: "E",
    order: 16,
    text: "Existe um ativo escalável de convencimento (ex.: webinar/vídeo de vendas gravado) que reduz repetição de explicações e acelera intenção?",
  },
  {
    id: "Q17",
    pillar: "E",
    order: 17,
    text: "O seu departamento de marketing/comercial é operável sem depender do fundador (processo mínimo, CRM, automação e ativos)?",
  },
  {
    id: "Q18",
    pillar: "E",
    order: 18,
    text: "Os canais em que sua marca atua no digital (Instagram, Google Meu Negócio, Site, LinkedIn) conversam entre si e trabalham estratégias de crescimento de base (ex.: trocar um material por contatos interessados no assunto)?",
  },
  {
    id: "Q19",
    pillar: "E",
    order: 19,
    text: "Após um potencial cliente deixar seus dados, existem processos automatizados de recepção, aquecimento, follow-up e aquisição de informações relevantes para acelerar o processo de vendas?",
  },
  {
    id: "Q20",
    pillar: "E",
    order: 20,
    text: "O potencial cliente entende com clareza o próximo passo (o que acontece depois do contato) sem sensação de improviso ou ser \"pego de surpresa\"?",
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
