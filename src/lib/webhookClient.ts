const DEFAULT_TIMEOUT_MS = 45_000;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1_000;

export async function fetchWithRetry(
  url: string,
  payload: unknown,
  options?: { timeoutMs?: number; maxRetries?: number }
): Promise<Response> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = options?.maxRetries ?? MAX_RETRIES;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) return response;

      // 5xx = retry, 4xx = fail immediately
      if (response.status >= 500 && attempt < maxRetries) {
        lastError = new Error(`HTTP ${response.status}`);
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      return response; // Return non-ok for caller to handle
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        lastError = new Error(`Timeout apos ${timeoutMs / 1000}s`);
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      if (attempt < maxRetries) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError ?? new Error("Webhook failed after max retries");
}
