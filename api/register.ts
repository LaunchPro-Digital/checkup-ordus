/**
 * POST /api/register
 *
 * Vercel Serverless Function — runs server-side only.
 * Called immediately on checkup completion (fire-and-forget from browser).
 *
 * Responsibilities:
 *  1. Upsert GHL contact with all checkup custom fields
 *  2. Create opportunity in correct pipeline stage (based on CRP band)
 *  3. Return { contactId, opportunityId } in < 1s
 *
 * GHL_PIT_TOKEN is stored as a Vercel env var — NEVER sent to the browser.
 */

// Vercel passes Node.js req/res — use type assertions to avoid @vercel/node dep
import type { IncomingMessage, ServerResponse } from 'http';
import { upsertContact, createOpportunity, CF } from './_lib/ghlClient';
import { getBandConfig, getBandLabel } from './_lib/crpBanding';

interface RegisterBody {
  // Identity
  name: string;
  email: string;
  phone?: string;
  empresa?: string;
  segmento?: string;
  publico?: string;
  // CRP result
  crpScore: number;
  topGaps?: string[];    // array of gap labels
  canais?: string[];     // array of channel ids/names
  devolutivaIA?: string; // AI analysis text (populated later via n8n)
}

export default async function handler(req: IncomingMessage & { body?: RegisterBody }, res: ServerResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', (req.headers.origin as string) || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const body = req.body as RegisterBody;

    // Validate required fields
    if (!body?.name || !body?.email || body?.crpScore === undefined) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing required fields: name, email, crpScore' }));
      return;
    }

    const bandConfig = getBandConfig(body.crpScore);
    const bandLabel = getBandLabel(body.crpScore);

    // Split name into first/last
    const nameParts = body.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || undefined;

    // ── 1. Upsert Contact ─────────────────────────────────────────────────
    const contactId = await upsertContact({
      firstName,
      lastName,
      email: body.email,
      phone: body.phone,
      companyName: body.empresa,
      source: 'Checkup CRP',
      tags: [...bandConfig.tags],
      customFields: [
        { id: CF.crp_score,  value: body.crpScore },
        { id: CF.crp_band,   value: bandLabel },
        ...(body.segmento ? [{ id: CF.segmento, value: body.segmento }] : []),
        ...(body.publico   ? [{ id: CF.publico,  value: body.publico }]  : []),
        ...(body.topGaps?.length
          ? [{ id: CF.top_gaps, value: body.topGaps.join(', ') }]
          : []),
        ...(body.canais?.length
          ? [{ id: CF.canais, value: body.canais.join(', ') }]
          : []),
        ...(body.devolutivaIA
          ? [{ id: CF.devolutiva_ia, value: body.devolutivaIA }]
          : []),
      ],
    });

    // ── 2. Create Opportunity ─────────────────────────────────────────────
    const opportunityName = `${body.name} — CRP ${bandConfig.label} (${body.crpScore.toFixed(1)})`;

    const opportunityId = await createOpportunity({
      name: opportunityName,
      pipelineId: bandConfig.pipelineId,
      stageId: bandConfig.stageId,
      contactId,
      status: 'open',
      source: 'Checkup CRP',
    });

    // ── 3. Respond ────────────────────────────────────────────────────────
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      contactId,
      opportunityId,
      band: bandLabel,
      stage: bandConfig.stageId,
    }));

  } catch (err: unknown) {
    console.error('[api/register] error:', err);
    const message = err instanceof Error ? err.message : 'Internal error';
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }
}
