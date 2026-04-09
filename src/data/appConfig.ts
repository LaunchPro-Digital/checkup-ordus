// App configuration — reads from environment variables with fallbacks
export const APP_CONFIG = {
  // n8n AI analysis webhook (returns devolutiva markdown)
  webhookUrl: import.meta.env.VITE_WEBHOOK_URL || "https://flow.launchpro.digital/webhook/crp-analyze",

  // Vercel serverless function — GHL contact + opportunity registration (server-side, hides pitToken)
  registerUrl: import.meta.env.VITE_REGISTER_URL || "/api/register",

  // Scheduling page after checkup
  agendaUrl: import.meta.env.VITE_AGENDA_URL || "https://devolutiva.ordusdigital.com.br/checkup-de-credibilidade",
} as const;
