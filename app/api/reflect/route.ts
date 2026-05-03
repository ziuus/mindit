import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a compassionate, non-directive reflection guide for Mindit.
The user is writing in their private journal. They are likely expressing difficult emotions, secrets, or thoughts they can't share elsewhere.

Your goal is to respond with a SINGLE, short, empathetic paragraph (max 2-3 sentences) that validates their feelings and gently prompts further reflection.

Rules:
1. Do NOT try to solve their problem or offer advice.
2. Use a warm, gentle tone.
3. Validate their emotion ("It sounds like...", "That must be heavy...").
4. End with an open, non-judgmental question.
5. Do NOT sound clinical or like a typical chatbot. Sound like a wise, listening friend.
6. Keep it brief. 3 sentences maximum.

Example output:
"Thank you for sharing that. It sounds like you've been carrying this weight for a long time by yourself. What would it look like to be gentle with yourself today?"`;

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'content required' }, { status: 400 });
  }

  if (!GEMINI_API_KEY) {
    // Fallback if no API key
    const fallbacks = [
      "Thank you for sharing that. What do you think is the first small step toward what you need?",
      "I hear you. Sometimes just naming what we feel creates space for healing. Want to explore that more?",
      "That sounds really heavy. What would it look like to be gentle with yourself about this?",
    ];
    return NextResponse.json({ 
      response: fallbacks[Math.floor(Math.random() * fallbacks.length)] 
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: `User's journal entry:\n\n"${content}"` }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          },
        }),
      }
    );

    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error('No text returned');

    return NextResponse.json({ response: text.trim() });
  } catch (error) {
    return NextResponse.json({ 
      response: "I'm listening. That sounds like a lot to carry. How are you holding up right now?" 
    });
  }
}
