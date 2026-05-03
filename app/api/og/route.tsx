import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('id');

  let content = "Say what you can't say anywhere else.";
  let pseudonym = 'Anonymous';
  let mood = 'hopeful';
  let category = 'vent';
  let resonanceCount = 0;

  if (postId) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from('posts')
        .select('content, pseudonym, mood, category, resonance_count')
        .eq('id', postId)
        .single();

      if (data) {
        content = data.content;
        pseudonym = data.pseudonym;
        mood = data.mood;
        category = data.category;
        resonanceCount = data.resonance_count || 0;
      }
    } catch (_) {}
  }

  // Truncate content for OG card
  const truncated = content.length > 200 ? content.substring(0, 197) + '...' : content;

  const MOOD_EMOJI: Record<string, string> = {
    numb: '😶', heavy: '😔', frustrated: '😤', scared: '😰', hopeful: '🤍',
  };

  const MOOD_COLOR: Record<string, string> = {
    numb: '#a8b5c4',
    heavy: '#e8a0a0',
    frustrated: '#d4a96a',
    scared: '#9b8ec4',
    hopeful: '#7fb69a',
  };

  const accentColor = MOOD_COLOR[mood] || '#7fb69a';
  const moodEmoji = MOOD_EMOJI[mood] || '🤍';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0f14',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155,142,196,0.08) 0%, transparent 70%)',
        }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#e8edf2',
              letterSpacing: '-0.5px',
            }}>
              Mindit
            </span>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#7fb69a',
            }} />
          </div>
          <div style={{
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}40`,
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '14px',
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>{moodEmoji}</span>
            <span>#{category}</span>
          </div>
        </div>

        {/* Post content */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '40px 0',
        }}>
          <p style={{
            fontSize: truncated.length > 120 ? '28px' : '34px',
            lineHeight: 1.55,
            color: '#e8edf2',
            fontStyle: 'italic',
            fontWeight: 400,
            maxWidth: '900px',
          }}>
            "{truncated}"
          </p>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: '24px',
        }}>
          <span style={{
            fontSize: '16px',
            color: '#6b7a8d',
            fontFamily: 'monospace',
          }}>
            — {pseudonym}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', color: accentColor }}>🤍</span>
            <span style={{ fontSize: '16px', color: '#a8b5c4' }}>
              {resonanceCount} {resonanceCount === 1 ? 'person' : 'people'} felt this too
            </span>
          </div>
          <span style={{
            fontSize: '14px',
            color: '#6b7a8d',
          }}>
            mindit-gules.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
