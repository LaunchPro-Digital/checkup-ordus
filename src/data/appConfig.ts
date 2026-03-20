// App configuration - reads from environment variables with fallbacks
export const APP_CONFIG = {
  webhookUrl: import.meta.env.VITE_WEBHOOK_URL || "https://flow.launchpro.digital/webhook/crp-analyze",
  agendaUrl: import.meta.env.VITE_AGENDA_URL || "https://devolutiva.ordusdigital.com.br/checkup-de-credibilidade",
} as const;
