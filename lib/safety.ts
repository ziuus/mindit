export type SafetyTier = 'safe' | 'watch' | 'hold' | 'crisis';

export interface SafetyResult {
  tier: SafetyTier;
  score: number;
  triggers: string[];
}

const CRISIS_KEYWORDS = [
  'want to die', 'end it all', "can't go on", 'no point living', 'kill myself',
  'end my life', 'suicide', 'self harm', 'hurt myself', 'not worth living',
  'khatam karna', 'jeena nahi', 'bas kar diya', 'sab khatam', 'thak gaya hun',
  'mar jana chahta', 'zindagi nahi chahiye'
];

const WATCH_KEYWORDS = [
  'hopeless', 'worthless', 'no one cares', 'burden', 'empty inside',
  'trapped', 'exhausted', 'breaking down', "can't cope", 'falling apart',
  'nobody understands', 'alone forever', 'hate myself', 'give up'
];

export function analyzeSafety(text: string): SafetyResult {
  const lower = text.toLowerCase();
  const triggers: string[] = [];
  let score = 0;

  for (const kw of CRISIS_KEYWORDS) {
    if (lower.includes(kw)) {
      score = Math.max(score, 0.88);
      triggers.push(`crisis_keyword:${kw}`);
    }
  }

  for (const kw of WATCH_KEYWORDS) {
    if (lower.includes(kw)) {
      score = Math.max(score, 0.42);
      triggers.push(`watch_keyword:${kw}`);
    }
  }

  let tier: SafetyTier = 'safe';
  if (score >= 0.85) tier = 'crisis';
  else if (score >= 0.6) tier = 'hold';
  else if (score >= 0.35) tier = 'watch';

  return { tier, score, triggers };
}
