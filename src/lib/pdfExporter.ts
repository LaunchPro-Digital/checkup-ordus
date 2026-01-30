// PDFExporter - Generate PDF report from submission
// Uses browser print functionality for reliable cross-browser PDF generation

import { PILLAR_NAMES, RISK_BANDS, QUESTION_BANK_VERSION } from "./questionBank";
import type { Submission } from "@/types/checkup";

function generatePDFHTML(submission: Submission): string {
  const { identity, crp, pillars, topGaps, output, channels, createdAt } = submission;
  const riskInfo = RISK_BANDS[crp.band];

  const pillarKeys: ("C" | "O" | "R" | "E")[] = ["C", "O", "R", "E"];
  const sortedPillars = [...pillarKeys].sort((a, b) => pillars[b].risk - pillars[a].risk);

  const riskColor = crp.band === "low" ? "#0e7490" : crp.band === "medium" ? "#eab308" : "#ef4444";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Checkup de Credibilidade - ${identity.companyName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 28px; margin-bottom: 8px; font-weight: 700; }
    h2 { font-size: 20px; margin: 32px 0 16px; font-weight: 600; border-bottom: 2px solid #e5e5e5; padding-bottom: 8px; }
    h3 { font-size: 16px; margin: 16px 0 8px; font-weight: 600; }
    p { margin-bottom: 12px; }
    .header { margin-bottom: 32px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 4px; }
    .score-card {
      background: #fafafa;
      border: 2px solid ${riskColor};
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 24px;
      margin: 24px 0;
    }
    .score-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 4px solid ${riskColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .score-value { font-size: 32px; font-weight: 700; color: ${riskColor}; }
    .score-label { font-size: 12px; color: #666; }
    .score-info { flex: 1; }
    .risk-band { 
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      background: ${riskColor};
      margin-bottom: 8px;
    }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
    th { font-weight: 600; background: #fafafa; }
    .gap-card {
      background: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 16px;
      margin: 12px 0;
    }
    .gap-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .gap-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #fee2e2;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }
    .gap-badge {
      font-size: 12px;
      padding: 2px 8px;
      background: #e5e5e5;
      border-radius: 4px;
    }
    .gap-score {
      font-size: 12px;
      padding: 2px 8px;
      background: #fee2e2;
      color: #ef4444;
      border-radius: 4px;
    }
    .recommendation {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 20px;
      margin: 16px 0;
    }
    .recommendation-title { font-weight: 600; margin-bottom: 12px; }
    ul { margin: 12px 0; padding-left: 20px; }
    li { margin: 8px 0; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #666; }
    @media print {
      body { padding: 20px; }
      .score-card { page-break-inside: avoid; }
      .gap-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Checkup de Credibilidade (CRP)</h1>
    <p class="meta"><strong>Empresa:</strong> ${identity.companyName}</p>
    <p class="meta"><strong>Responsável:</strong> ${identity.personName}</p>
    <p class="meta"><strong>E-mail:</strong> ${identity.email}</p>
    <p class="meta"><strong>Segmento:</strong> ${identity.segment}</p>
    <p class="meta"><strong>Data:</strong> ${new Date(createdAt).toLocaleDateString("pt-BR")} | <strong>Versão:</strong> ${QUESTION_BANK_VERSION}</p>
  </div>

  <div class="score-card">
    <div class="score-circle">
      <span class="score-value">${crp.score.toFixed(1)}</span>
      <span class="score-label">de 10</span>
    </div>
    <div class="score-info">
      <span class="risk-band">Risco ${riskInfo.label}</span>
      <p>${riskInfo.description}</p>
      <p style="font-size: 13px; color: #666;">CRP baixo (0–2,9) = decisão flui · médio (3–5,4) = fricção · alto (5,5–10) = travamento</p>
    </div>
  </div>

  <h2>Diagnóstico por Pilar</h2>
  <table>
    <thead>
      <tr>
        <th>Pilar</th>
        <th>Média (1-5)</th>
        <th>Risco (0-10)</th>
      </tr>
    </thead>
    <tbody>
      ${sortedPillars
        .map(
          (pillar) => `
        <tr>
          <td><strong>${PILLAR_NAMES[pillar]}</strong></td>
          <td>${pillars[pillar].avg.toFixed(1)}</td>
          <td>${pillars[pillar].risk.toFixed(1)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <h2>Top 3 Gargalos</h2>
  ${topGaps
    .map(
      (gap, i) => `
    <div class="gap-card">
      <div class="gap-header">
        <span class="gap-number">${i + 1}</span>
        <span class="gap-badge">${PILLAR_NAMES[gap.pillar]}</span>
        <span class="gap-badge">${gap.questionId}</span>
        <span class="gap-score">Nota ${gap.score}</span>
      </div>
      <p>${gap.text}</p>
    </div>
  `
    )
    .join("")}

  <h2>Recomendação</h2>
  <div class="recommendation">
    <p class="recommendation-title">${output.sentence}</p>
    <h3>Próximos Passos</h3>
    <ul>
      ${output.bullets.map((b) => `<li>${b}</li>`).join("")}
    </ul>
  </div>

  ${
    channels.length > 0
      ? `
  <h2>Canais Analisados</h2>
  <ul>
    ${channels.map((c) => `<li><strong>${c.label || c.type}:</strong> ${c.url}</li>`).join("")}
  </ul>
  `
      : ""
  }

  <div class="footer">
    <p>Gerado pelo Checkup de Credibilidade (CRP) - Assessoria CORE · Ordus</p>
  </div>
</body>
</html>
  `;
}

export function downloadPDF(submission: Submission): void {
  const html = generatePDFHTML(submission);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Wait for styles to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
