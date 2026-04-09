import type { Pillar, RiskBand } from "@/lib/questionBank";

export interface Identity {
  companyName: string;
  personName: string;
  email: string;
  whatsapp: string;
  segment: string;
  targetAudience: string;
}

export interface Channel {
  type: ChannelType;
  url: string;
  label?: string;
}

export type ChannelType =
  | "website"
  | "instagram"
  | "linkedin"
  | "whatsapp"
  | "youtube"
  | "tiktok"
  | "google_business"
  | "other";

export const CHANNEL_OPTIONS: { type: ChannelType; label: string; placeholder: string }[] = [
  { type: "website", label: "Site / One Page", placeholder: "https://seusite.com.br" },
  { type: "instagram", label: "Instagram", placeholder: "https://instagram.com/seuusuario" },
  { type: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/suaempresa" },
  { type: "whatsapp", label: "WhatsApp Business", placeholder: "https://wa.me/5511999999999" },
  { type: "youtube", label: "YouTube", placeholder: "https://youtube.com/@seucanal" },
  { type: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@seuusuario" },
  { type: "google_business", label: "Google Meu Negócio", placeholder: "Link do perfil" },
];

export interface Answer {
  questionId: string;
  score: 1 | 2 | 3 | 4 | 5;
}

export interface PillarResult {
  avg: number;
  risk: number;
}

export interface CRPResult {
  score: number;
  band: RiskBand;
}

export interface TopGap {
  questionId: string;
  score: number;
  pillar: Pillar;
  text: string;
}

export interface RecommendationOutput {
  sentence: string;
  bullets: string[];
}

export interface Submission {
  id: string;
  createdAt: Date;
  identity: Identity;
  channels: Channel[];
  answers: Answer[];
  pillars: Record<Pillar, PillarResult>;
  crp: CRPResult;
  topGaps: TopGap[];
  output: RecommendationOutput;
  agendaUrlSnapshot?: string;
  webhookUrlSnapshot?: string;
  webhookDeliveryStatus?: "pending" | "sent" | "failed";
  webhookLastError?: string;
  // GHL integration tracking (populated after /api/register completes)
  ghlContactId?: string;
  ghlOpportunityId?: string;
  ghlRegisteredAt?: Date;
}

export interface WizardDraft {
  step: number;
  identity: Partial<Identity>;
  channels: Channel[];
  answers: Answer[];
  lastUpdated: Date;
}
