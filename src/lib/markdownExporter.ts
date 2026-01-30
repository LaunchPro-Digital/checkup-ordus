// MarkdownExporter - Generate markdown report from submission

import { PILLAR_NAMES, RISK_BANDS, QUESTION_BANK_VERSION } from "./questionBank";
import type { Submission } from "@/types/checkup";

export function generateMarkdown(submission: Submission, aiContent?: string | null): string {
  const { identity, crp, pillars, topGaps, output, channels, createdAt } = submission;
  const riskInfo = RISK_BANDS[crp.band];

  const pillarKeys: ("C" | "O" | "R" | "E")[] = ["C", "O", "R", "E"];
  const sortedPillars = [...pillarKeys].sort((a, b) => pillars[b].risk - pillars[a].risk);

  const lines: string[] = [];

  // Header
  lines.push(`# Checkup de Credibilidade (CRP)`);
  lines.push(``);
  lines.push(`**Empresa:** ${identity.companyName}`);
  lines.push(`**Responsável:** ${identity.personName}`);
  lines.push(`**E-mail:** ${identity.email}`);
  lines.push(`**Segmento:** ${identity.segment}`);
  lines.push(`**Público-alvo:** ${identity.targetAudience}`);
  lines.push(``);
  lines.push(`**Data:** ${new Date(createdAt).toLocaleDateString("pt-BR")}`);
  lines.push(`**Versão:** ${QUESTION_BANK_VERSION}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // CRP Score
  lines.push(`## Resultado CRP`);
  lines.push(``);
  lines.push(`| Métrica | Valor |`);
  lines.push(`|---------|-------|`);
  lines.push(`| **CRP Score** | ${crp.score.toFixed(1)} / 10 |`);
  lines.push(`| **Faixa de Risco** | ${riskInfo.label} |`);
  lines.push(`| **Interpretação** | ${riskInfo.description} |`);
  lines.push(``);

  // Pillar breakdown
  lines.push(`## Diagnóstico por Pilar`);
  lines.push(``);
  lines.push(`| Pilar | Média (1-5) | Risco (0-10) |`);
  lines.push(`|-------|-------------|--------------|`);
  for (const pillar of sortedPillars) {
    const result = pillars[pillar];
    lines.push(`| ${PILLAR_NAMES[pillar]} | ${result.avg.toFixed(1)} | ${result.risk.toFixed(1)} |`);
  }
  lines.push(``);

  // Top gaps
  lines.push(`## Top 3 Gargalos`);
  lines.push(``);
  for (let i = 0; i < topGaps.length; i++) {
    const gap = topGaps[i];
    lines.push(`### ${i + 1}. ${gap.questionId} — ${PILLAR_NAMES[gap.pillar]} (Nota ${gap.score})`);
    lines.push(``);
    lines.push(`> ${gap.text}`);
    lines.push(``);
  }

  // AI Content or Recommendation
  if (aiContent) {
    lines.push(`## Análise Personalizada`);
    lines.push(``);
    lines.push(aiContent);
    lines.push(``);
  } else {
    lines.push(`## Recomendação`);
    lines.push(``);
    lines.push(`**${output.sentence}**`);
    lines.push(``);
    lines.push(`### Próximos Passos`);
    lines.push(``);
    for (const bullet of output.bullets) {
      lines.push(`- ${bullet}`);
    }
    lines.push(``);
  }

  // Channels
  if (channels.length > 0) {
    lines.push(`## Canais Analisados`);
    lines.push(``);
    for (const channel of channels) {
      const label = channel.label || channel.type;
      lines.push(`- **${label}:** ${channel.url}`);
    }
    lines.push(``);
  }

  // Footer
  lines.push(`---`);
  lines.push(``);
  lines.push(`*Gerado pelo Checkup de Credibilidade (CRP) - Assessoria CORE · Ordus*`);

  return lines.join("\n");
}

export function downloadMarkdown(submission: Submission, aiContent?: string | null): void {
  const content = generateMarkdown(submission, aiContent);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `crp-${submission.identity.companyName.toLowerCase().replace(/\s+/g, "-")}-${new Date(submission.createdAt).toISOString().split("T")[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
