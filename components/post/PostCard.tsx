'use client';

import { getAvatarUrl } from '@/lib/anonymity';
import { timeAgo } from '@/lib/utils';
import ResonanceButton from './ResonanceButton';
import Link from 'next/link';

interface PostCardProps {
  post: {
    id: string;
    pseudonym: string;
    avatarSeed: string;
    content: string;
    category: string;
    mood: string;
    resonanceCount: number;
    resonatedBy: string[];
    createdAt: Date;
    userId: string;
  };
  currentUserId: string;
}

const MOOD_EMOJIS: Record<string, string> = {
  numb: '😶',
  heavy: '😔',
  frustrated: '😤',
  scared: '😰',
  hopeful: '🤍',
};

const CATEGORY_COLORS: Record<string, string> = {
  vent: '#e8a0a0',
  secret: '#9b8ec4',
  confession: '#d4a96a',
  'unsent-letter': '#7fb69a',
  gratitude: '#7fb69a',
};

const MOOD_BORDER: Record<string, string> = {
  numb: 'rgba(168, 181, 196, 0.3)',
  heavy: 'rgba(232, 160, 160, 0.4)',
  frustrated: 'rgba(212, 169, 106, 0.4)',
  scared: 'rgba(155, 142, 196, 0.4)',
  hopeful: 'rgba(127, 182, 154, 0.4)',
};

export default function PostCard({ post, currentUserId }: PostCardProps) {
  // In Phase 1 with Supabase, we default to false and let ResonanceButton handle local state
  const hasResonated = false; 

  return (
    <div
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: `3px solid ${MOOD_BORDER[post.mood] || 'var(--border)'}`,
        borderRight: '1px solid var(--border)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '20px 24px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-glass-hover)';
        e.currentTarget.style.borderRightColor = 'var(--border-hover)';
        e.currentTarget.style.borderTopColor = 'var(--border-hover)';
        e.currentTarget.style.borderBottomColor = 'var(--border-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-glass)';
        e.currentTarget.style.borderRightColor = 'var(--border)';
        e.currentTarget.style.borderTopColor = 'var(--border)';
        e.currentTarget.style.borderBottomColor = 'var(--border)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <img
          src={getAvatarUrl(post.avatarSeed)}
          width={36}
          height={36}
          style={{ borderRadius: '50%' }}
          alt="avatar"
        />
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              color: '#a8b5c4',
              fontWeight: 500,
            }}
          >
            {post.pseudonym}
          </span>
          <span style={{ color: '#6b7a8d', fontSize: '12px', marginLeft: '8px' }}>
            {timeAgo(post.createdAt)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '18px' }}>{MOOD_EMOJIS[post.mood] || '😶'}</span>
          <span
            style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '12px',
              background: `${CATEGORY_COLORS[post.category] || '#7fb69a'}15`,
              color: CATEGORY_COLORS[post.category] || '#7fb69a',
              border: `1px solid ${CATEGORY_COLORS[post.category] || '#7fb69a'}30`,
              fontWeight: 500,
            }}
          >
            #{post.category}
          </span>
        </div>
      </div>

      <Link href={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '16px',
            lineHeight: 1.7,
            color: '#e8edf2',
            marginBottom: '16px',
            fontWeight: 400,
          }}
        >
          {post.content}
        </p>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ResonanceButton
          postId={post.id}
          initialCount={post.resonanceCount}
          initialResonated={hasResonated}
          userId={currentUserId}
        />
      </div>
    </div>
  );
}
