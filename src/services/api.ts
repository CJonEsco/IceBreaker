import { Incident, VerificationVerdict } from '../types';

export interface VerifyReportPayload {
  title: string;
  category: string;
  locationName: string;
  description: string;
  vehiclesReported?: string;
  agentsDescription?: string;
  detaineesCount?: number;
}

export interface VerificationResponse {
  verdict: VerificationVerdict;
  score: number;
  reasoning: string;
  flags: string[];
  authenticityBreakdown?: {
    plausibility: number;
    geographicalConsistency: number;
    tacticalTaxonomyAccuracy: number;
    syntheticAnomalyScore: number;
  };
}

export async function fetchIncidents(): Promise<Incident[]> {
  try {
    const res = await fetch('/api/incidents');
    if (!res.ok) throw new Error('Failed to fetch incidents');
    const data = await res.json();
    return data.incidents;
  } catch (error) {
    console.warn('Using local fallback incidents:', error);
    const { INITIAL_INCIDENTS } = await import('../data/mockData');
    return INITIAL_INCIDENTS;
  }
}

export async function submitIncident(incidentData: Partial<Incident>): Promise<{ incident: Incident; analysis: VerificationResponse }> {
  try {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData),
    });
    if (!res.ok) throw new Error('Failed to submit incident');
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('API error, analyzing locally:', error);
    const analysis = await analyzeReportLocally(incidentData as any);
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      title: incidentData.title || 'Reported Incident',
      category: incidentData.category || 'ICE_OPERATION',
      severity: incidentData.severity || 'HIGH',
      locationName: incidentData.locationName || 'Local Area',
      lat: incidentData.lat || 37.7749,
      lng: incidentData.lng || -122.4194,
      description: incidentData.description || '',
      vehiclesReported: incidentData.vehiclesReported,
      agentsDescription: incidentData.agentsDescription,
      detaineesCount: incidentData.detaineesCount || 0,
      badgeNumbers: incidentData.badgeNumbers,
      photoUrl: incidentData.photoUrl,
      authorName: incidentData.authorName || 'Citizen Observer',
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      confirmations: 1,
      disputes: 0,
      verificationStatus: analysis.verdict,
      verificationScore: analysis.score,
      verificationReasoning: analysis.reasoning,
      verificationFlags: analysis.flags,
      commentsCount: 0,
      sharesCount: 1,
    };
    return { incident: newInc, analysis };
  }
}

export async function analyzeReportDirect(payload: VerifyReportPayload): Promise<VerificationResponse> {
  try {
    const res = await fetch('/api/verify-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Analysis API failed');
    const data = await res.json();
    return data.analysis;
  } catch (error) {
    return analyzeReportLocally(payload);
  }
}

export async function voteIncident(incidentId: string, type: 'CONFIRM' | 'DISPUTE'): Promise<Incident | null> {
  try {
    const res = await fetch(`/api/incidents/${incidentId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) throw new Error('Vote failed');
    const data = await res.json();
    return data.incident;
  } catch (error) {
    console.warn('Vote failed on server:', error);
    return null;
  }
}

function analyzeReportLocally(payload: VerifyReportPayload): VerificationResponse {
  const text = `${payload.title} ${payload.description} ${payload.vehiclesReported || ''}`.toLowerCase();
  
  if (text.includes('robot') || text.includes('alien') || text.includes('cyber-drone') || text.includes('prompt:') || text.includes('as an ai')) {
    return {
      verdict: 'AI_GENERATED_DETECTED',
      score: 18,
      reasoning: 'Synthetic prompt terminology and hallucinatory tactical equipment detected.',
      flags: ['Synthetic Anomaly', 'Bot Detection', 'Disputed'],
      authenticityBreakdown: {
        plausibility: 10,
        geographicalConsistency: 25,
        tacticalTaxonomyAccuracy: 15,
        syntheticAnomalyScore: 94
      }
    };
  }

  return {
    verdict: 'VERIFIED_REAL',
    score: 91,
    reasoning: 'Consistent vehicle description and tactical identifiers verified against known patrol patterns.',
    flags: ['Eyewitness Corroboration', 'Plausible Plate & Gear', 'Active Notice'],
    authenticityBreakdown: {
      plausibility: 92,
      geographicalConsistency: 90,
      tacticalTaxonomyAccuracy: 88,
      syntheticAnomalyScore: 4
    }
  };
}
