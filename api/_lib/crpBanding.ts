/**
 * CRP Banding — maps CRP score to pipeline stage, band label, and tags
 * Pipeline: "3. Lead Magnets" (id: 7wpKT8aZQsfu0KBryULp)
 */

export type CRPBand = 'Critico' | 'Alto' | 'Moderado' | 'Baixo';

export interface BandConfig {
  band: CRPBand;
  label: string; // Portuguese display label
  pipelineId: string;
  stageId: string;
  tags: string[];
  priority: number; // 1=highest for opportunity priority
}

const PIPELINE_ID = '7wpKT8aZQsfu0KBryULp';

const BAND_MAP: BandConfig[] = [
  {
    band: 'Critico',
    label: 'Crítico',
    pipelineId: PIPELINE_ID,
    stageId: 'a8064c19-8b98-43ff-aecc-8a82f82ec256', // Qualificados
    tags: ['checkup', 'crp-critico', 'urgente'],
    priority: 1,
  },
  {
    band: 'Alto',
    label: 'Alto',
    pipelineId: PIPELINE_ID,
    stageId: '2660e8a7-9c21-4ab5-8640-35503572647f', // Interessados
    tags: ['checkup', 'crp-alto'],
    priority: 2,
  },
  {
    band: 'Moderado',
    label: 'Moderado',
    pipelineId: PIPELINE_ID,
    stageId: '2a25e76a-d740-45de-98d7-4ef8f646ecf5', // Em Nutrição
    tags: ['checkup', 'crp-moderado'],
    priority: 3,
  },
  {
    band: 'Baixo',
    label: 'Baixo',
    pipelineId: PIPELINE_ID,
    stageId: 'dc1a9581-3f37-4610-940e-748e7e193b6b', // Novos Leads
    tags: ['checkup', 'crp-baixo'],
    priority: 4,
  },
];

export function getBandConfig(score: number): BandConfig {
  if (score >= 8) return BAND_MAP[0]; // Critico
  if (score >= 6) return BAND_MAP[1]; // Alto
  if (score >= 4) return BAND_MAP[2]; // Moderado
  return BAND_MAP[3];                 // Baixo
}

export function getBandLabel(score: number): CRPBand {
  return getBandConfig(score).band;
}
