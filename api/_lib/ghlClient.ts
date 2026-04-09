/**
 * GHL Client — server-side wrapper for GoHighLevel REST API v2
 * All calls run server-side (Vercel Function) — pitToken never exposed to browser.
 *
 * Subconta: Ordus Digital
 * locationId: C7Zw4DpSudSwERSPNq60
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const PIT_TOKEN = process.env.GHL_PIT_TOKEN!;
const LOCATION_ID = process.env.GHL_LOCATION_ID || 'C7Zw4DpSudSwERSPNq60';
const API_VERSION = '2021-07-28';

// ── Custom field IDs (created in Ordus Digital subconta) ──────────────────
export const CF = {
  crp_score:      'beliL4MobxQAL4XQToI7',  // NUMERICAL
  crp_band:       'Jj6GjutZySzxyeaigYAb',  // RADIO  (Critico/Alto/Moderado/Baixo)
  segmento:       'zo4lOjxG292fPuJct3B3',  // TEXT
  publico:        'yTnGhP2BrfItiz9MvurZ',  // TEXT
  top_gaps:       'bwtYnhCAT6HZxER0hcaG',  // LARGE_TEXT
  canais:         'hEnJ9Lxqufb1pqKurmoj',  // LARGE_TEXT
  devolutiva_ia:  'Lt23sw1FWwJpTwy9A8bK',  // LARGE_TEXT
} as const;

function headers() {
  return {
    Authorization: `Bearer ${PIT_TOKEN}`,
    Version: API_VERSION,
    'Content-Type': 'application/json',
  };
}

// ── Contact ───────────────────────────────────────────────────────────────

export interface ContactPayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  customFields?: { id: string; value: string | number }[];
  tags?: string[];
  source?: string;
}

/** Search for a contact by email within the location */
export async function findContactByEmail(email: string): Promise<string | null> {
  const url = `${GHL_BASE}/contacts/search/duplicate?locationId=${LOCATION_ID}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.contact?.id ?? null;
}

/** Create a new contact */
export async function createContact(payload: ContactPayload): Promise<string> {
  const body = {
    locationId: LOCATION_ID,
    ...payload,
  };
  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GHL createContact failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.contact.id;
}

/** Update an existing contact (partial update) */
export async function updateContact(
  contactId: string,
  payload: Partial<ContactPayload>
): Promise<void> {
  const res = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GHL updateContact failed: ${res.status} ${err}`);
  }
}

/** Upsert: find by email → update if exists, create if not */
export async function upsertContact(payload: ContactPayload): Promise<string> {
  const existingId = await findContactByEmail(payload.email);
  if (existingId) {
    await updateContact(existingId, payload);
    return existingId;
  }
  return createContact(payload);
}

// ── Opportunity ───────────────────────────────────────────────────────────

export interface OpportunityPayload {
  name: string;
  pipelineId: string;
  stageId: string;   // mapped to pipelineStageId in the API call
  contactId: string;
  status?: 'open' | 'won' | 'lost' | 'abandoned';
  monetaryValue?: number;
  source?: string;
}

/** Create a new opportunity linked to a contact */
export async function createOpportunity(payload: OpportunityPayload): Promise<string> {
  const { stageId, ...rest } = payload;
  const body = {
    locationId: LOCATION_ID,
    status: 'open',
    ...rest,
    pipelineStageId: stageId, // GHL v2 uses pipelineStageId not stageId
  };
  const res = await fetch(`${GHL_BASE}/opportunities/`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GHL createOpportunity failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.opportunity.id;
}
