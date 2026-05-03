'use client';

import { useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { toggleResonance } from '@/lib/store';

interface ResonanceButtonProps {
  postId: string;
  initialCount: number;
  initialResonated: boolean;
  userId: string;
}

export default function ResonanceButton({
  postId,
  initialCount,
  initialResonated,
  userId,
}: ResonanceButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [resonated, setResonated] = useState(initialResonated);
  const [animating, setAnimating] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    
    // Optimistic update
    const nextResonated = !resonated;
    setResonated(nextResonated);
    setCount(prev => nextResonated ? prev + 1 : prev - 1);
    
    if (nextResonated) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    }

    setLoading(true);
    try {
      await toggleResonance(postId, userId);
    } catch (err) {
      // Revert on error
      setResonated(!nextResonated);
      setCount(prev => !nextResonated ? prev + 1 : prev - 1);
    } finally {
      setLoading(false);
    }
  }, [postId, userId, resonated, loading]);

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderRadius: '20px',
        border: resonated ? '1px solid rgba(127, 182, 154, 0.3)' : '1px solid var(--border)',
        background: resonated ? 'rgba(127, 182, 154, 0.1)' : 'transparent',
        color: resonated ? '#7fb69a' : '#a8b5c4',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {animating && (
        <span
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '24px',
            border: '2px solid rgba(127, 182, 154, 0.4)',
            animation: 'pulse-ring 0.6s ease-out forwards',
          }}
        />
      )}
      <Heart
        size={16}
        fill={resonated ? '#7fb69a' : 'none'}
        color={resonated ? '#7fb69a' : '#a8b5c4'}
      />
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>
      <span style={{ fontSize: '11px', opacity: 0.7 }}>I felt this too</span>
    </button>
  );
}
