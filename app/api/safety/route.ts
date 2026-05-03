import { NextRequest, NextResponse } from 'next/server';
import { analyzeSafety } from '@/lib/safety';
import type { SafetyTier } from '@/lib/safety';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a compassionate mental health safety analyst for Mindit, an anonymous mental health platform for India.

Your task: analyze the emotional content of a user's post and classify its safety level.

Return ONLY valid JSON in this exact format:
{
  "tier": "safe" | "watch" | "hold" | "crisis",
  "confidence": 0.0-1.0,
  "reason": "brief empathetic reason in 1 sentence",
  "needsIntervention": true | false
}

Tier definitions:
- "safe": Normal emotional expression. Venting, confessions, gratitude, reflections. No distress signals.
- "watch": Elevated distress. Feelings of emptiness, hopelessness, isolation, or persistent sadness. Not acute crisis.
- "hold": Significant distress. Expressions of feeling trapped, like a burden, or passive ideation ("I wish I wasn't here"). Needs gentle support prompt.
- "crisis": Active crisis signals. Direct expressions of suicidal ideation, self-harm intent, or immediate danger. Needs immediate intervention.

Context: This is India. Users may express distress using cultural idioms, metaphors, or indirect language. Read between the lines. A post saying "I'm just tired of everything" from someone who described isolation and hopelessness is a "watch". Someone saying "I don't want to be here anymore" is at minimum a "hold".

Be compassionate but accurate. Err on the side of care when uncertain between tiers.`;

async function analyzeWithGemini(content: string): Promise<{ tier: SafetyTier; reason: string; confidence: number } | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: `Analyze this post:\n\n"${content}"` }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 256,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    return {
      tier: parsed.tier as SafetyTier,
      reason: parsed.reason || '',
      confidence: parsed.confidence || 0.8,
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { content } = await req.json();
  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'content required' }, { status: 400 });
  }

  // Fast keyword pass first
  const keywordResult = analyzeSafety(content);

  // If clearly safe via keywords AND no Gemini key, return fast
  if (keywordResult.tier === 'safe' && !GEMINI_API_KEY) {
    return NextResponse.json({ tier: 'safe', source: 'keyword', reason: null });
  }

  // If keyword flags crisis, don't wait for Gemini — escalate immediately
  if (keywordResult.tier === 'crisis') {
    return NextResponse.json({
      tier: 'crisis',
      source: 'keyword',
      reason: 'We noticed some heavy words in what you shared.',
    });
  }

  // For watch/hold or when Gemini key is present, do AI analysis
  const aiResult = await analyzeWithGemini(content);

  if (!aiResult) {
    // Fall back to keyword result gracefully
    return NextResponse.json({ tier: keywordResult.tier, source: 'keyword', reason: null });
  }

  // Escalate to higher tier if AI disagrees
  const TIER_ORDER: SafetyTier[] = ['safe', 'watch', 'hold', 'crisis'];
  const keywordIdx = TIER_ORDER.indexOf(keywordResult.tier);
  const aiIdx = TIER_ORDER.indexOf(aiResult.tier);
  const finalTier = TIER_ORDER[Math.max(keywordIdx, aiIdx)];

  return NextResponse.json({
    tier: finalTier,
    source: 'ai',
    reason: aiResult.reason,
    confidence: aiResult.confidence,
  });
}
