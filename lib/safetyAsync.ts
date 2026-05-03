/**
 * Client-side async safety check
 * Calls /api/safety for AI-enhanced analysis
 * Falls back to local keyword check if API fails
 */

import { analyzeSafety, type SafetyTier } from './safety';

export interface AsyncSafetyResult {
  tier: SafetyTier;
  reason: string | null;
  source: 'ai' | 'keyword';
  loading: boolean;
}

export async function analyzeContentSafety(content: string): Promise<AsyncSafetyResult> {
  // Instant pre-check for crisis keywords so UX is not blocked
  const instant = analyzeSafety(content);
  if (instant.tier === 'crisis') {
    return { tier: 'crisis', reason: null, source: 'keyword', loading: false };
  }

  try {
    const res = await fetch('/api/safety', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
      signal: AbortSignal.timeout(5000), // 5s timeout — never block UX
    });

    if (!res.ok) throw new Error('safety api failed');
    const data = await res.json();
    return {
      tier: data.tier as SafetyTier,
      reason: data.reason || null,
      source: data.source,
      loading: false,
    };
  } catch {
    // Graceful fallback to keyword
    return { tier: instant.tier, reason: null, source: 'keyword', loading: false };
  }
}
