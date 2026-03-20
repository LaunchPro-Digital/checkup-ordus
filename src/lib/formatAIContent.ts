// Pre-process AI content for optimal display with proper spacing and bold titles
export function formatAIContent(content: string): string {
  const sectionTitles = [
    "resumo executivo",
    "leitura por pilar",
    "top gaps com direcao de correcao",
    "top gaps",
    "plano de acao",
    "plano de acao (14 dias)",
    "plano minimo",
    "cta final",
    "como esta o seu core hoje",
    "como esta seu core hoje",
    "analise por pilar",
    "recomendacoes",
    "proximos passos",
  ];

  const paragraphs = content.split(/\n\n+/);
  const formattedParagraphs: string[] = [];

  for (const paragraph of paragraphs) {
    const text = paragraph.trim();
    if (!text) continue;

    const plainText = text.replace(/\*\*/g, '');
    const lowerPlain = plainText.toLowerCase().replace(/[?:]/g, '').trim();

    const isTitle = sectionTitles.some(title =>
      lowerPlain === title || lowerPlain.startsWith(title)
    );

    if (isTitle) {
      const cleanTitle = plainText.replace(/^#+\s*/, '').trim();
      formattedParagraphs.push('## **' + cleanTitle + '**');
      continue;
    }

    const processedLines: string[] = [];
    for (let line of text.split('\n')) {
      line = line.trim();
      if (!line) continue;
      const bulletPillarMatch = line.match(/^-\s*(Clareza|Organiza[cç][aã]o|Reputa[cç][aã]o|Expans[aã]o):\s*(.+)/i);
      if (bulletPillarMatch) { processedLines.push('\n**' + bulletPillarMatch[1] + ':** ' + bulletPillarMatch[2] + '\n'); continue; }
      const pillarMatch = line.match(/^(Clareza|Organiza[cç][aã]o|Reputa[cç][aã]o|Expans[aã]o):\s*(.+)/i);
      if (pillarMatch) { processedLines.push('\n**' + pillarMatch[1] + ':** ' + pillarMatch[2] + '\n'); continue; }
      const numberedMatch = line.match(/^(\d+)\.\s*([^:]+):\s*(.+)/);
      if (numberedMatch) { processedLines.push('\n' + numberedMatch[1] + '. **' + numberedMatch[2].trim() + ':** ' + numberedMatch[3] + '\n'); continue; }
      processedLines.push(line);
    }
    formattedParagraphs.push(processedLines.join('\n'));
  }

  let result = formattedParagraphs.join('\n\n');
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.replace(/([^\n])\n(## )/g, '$1\n\n$2');
  return result.trim();
}
