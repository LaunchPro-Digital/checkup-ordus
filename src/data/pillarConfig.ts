import { Target, Zap, Shield, TrendingDown } from "lucide-react";
import type { Pillar } from "@/lib/questionBank";

export const PILLAR_ICONS: Record<Pillar, React.ElementType> = {
  C: Target,
  O: Zap,
  R: Shield,
  E: TrendingDown,
};

export const PILLAR_DESCRIPTIONS: Record<Pillar, string> = {
  C: "O decisor entende o que você faz, para quem e por que confiar?",
  O: "Sua operação parece uma máquina organizada ou improvisada?",
  R: "Outros já confiaram? Dá para validar sem falar com você?",
  E: "Isso funciona agora e continua funcionando depois?",
};

export const PILLAR_WEIGHTS_DISPLAY: Record<Pillar, string> = {
  C: "30%",
  O: "25%",
  R: "30%",
  E: "15%",
};

export const PILLAR_COLORS: Record<Pillar, string> = {
  C: "border-pillar-c/40 bg-pillar-c/8",
  O: "border-pillar-o/40 bg-pillar-o/8",
  R: "border-pillar-r/40 bg-pillar-r/8",
  E: "border-pillar-e/40 bg-pillar-e/8",
};

export const PILLAR_BADGE_COLORS: Record<Pillar, string> = {
  C: "bg-pillar-c text-white",
  O: "bg-pillar-o text-white",
  R: "bg-pillar-r text-white",
  E: "bg-pillar-e text-white",
};

export const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: "bg-risk-low/10", text: "text-risk-low", border: "border-risk-low" },
  medium: { bg: "bg-risk-medium/10", text: "text-risk-medium", border: "border-risk-medium" },
  high: { bg: "bg-risk-high/10", text: "text-risk-high", border: "border-risk-high" },
};
