'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Heart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPost, toggleResonance } from '@/lib/store';
import { getOrCreateUser, getAvatarUrl } from '@/lib/anonymity';
import { timeAgo } from '@/lib/utils';

const MOOD_EMOJIS: Record<string, string> = {
  numb: '😶', heavy: '😔', frustrated: '😤', scared: '😰', hopeful: '🤍',
};
const CATEGORY_COLORS: Record<string, string> = {
  vent: '#e8a0a0', secret: '#9b8ec4', confession: '#d4a96a',
  'unsent-letter': '#7fb69a', gratitude: '#7fb69a',
};
const MOOD_ACCENT: Record<string, string> = {
  numb: '#a8b5c4', heavy: '#e8a0a0', frustrated: '#d4a96a',
  scared: '#9b8ec4', hopeful: '#7fb69a',
};

export default function PostPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [hasResonated, setHasResonated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      const u = getOrCreateUser();
      setUser(u);
      const found = await getPost(id);
      if (found) setPost(found);
    };
    load();
  }, [id]);

  const handleResonance = async () => {
    if (!user) return;
    const nextResonated = !hasResonated;
    setHasResonated(nextResonated);
    setPost((prev: any) => ({
      ...prev,
      resonanceCount: nextResonated ? prev.resonanceCount + 1 : prev.resonanceCount - 1
    }));
    try {
      await toggleResonance(id, user.id);
    } catch {
      setHasResonated(!nextResonated);
      setPost((prev: any) => ({
        ...prev,
        resonanceCount: !nextResonated ? prev.resonanceCount + 1 : prev.resonanceCount - 1
      }));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Someone shared something real on Mindit',
          text: post?.content?.substring(0, 140) + '...',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (_) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!post || !user) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="glass"
              style={{ height: i === 1 ? '60px' : '200px', borderRadius: '16px' }}
            />
          ))}
        </div>
      </div>
    );
  }

  const accent = MOOD_ACCENT[post.mood] || '#7fb69a';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: '680px', margin: '0 auto', padding: '20px' }}
    >
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', color: '#a8b5c4',
          cursor: 'pointer', fontSize: '14px', marginBottom: '24px',
          fontFamily: "'Inter', sans-serif",
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#e8edf2')}
        onMouseLeave={e => (e.currentTarget.style.color = '#a8b5c4')}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${accent}60`,
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Mood glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '200px', height: '200px', borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <img
            src={getAvatarUrl(post.avatarSeed)}
            width={44} height={44}
            style={{ borderRadius: '50%', border: `2px solid ${accent}30` }}
            alt="avatar"
          />
          <div style={{ flex: 1 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px', color: '#a8b5c4', fontWeight: 500,
            }}>
              {post.pseudonym}
            </span>
            <span style={{ color: '#6b7a8d', fontSize: '12px', marginLeft: '10px' }}>
              {timeAgo(post.createdAt)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>{MOOD_EMOJIS[post.mood] || '😶'}</span>
            <span style={{
              fontSize: '11px', padding: '3px 10px', borderRadius: '12px',
              background: `${CATEGORY_COLORS[post.category] || '#7fb69a'}15`,
              color: CATEGORY_COLORS[post.category] || '#7fb69a',
              border: `1px solid ${CATEGORY_COLORS[post.category] || '#7fb69a'}30`,
              fontWeight: 500,
            }}>
              #{post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '20px', lineHeight: 1.8,
          color: '#e8edf2', marginBottom: '28px', fontWeight: 400,
        }}>
          {post.content}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <motion.button
            onClick={handleResonance}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '20px',
              border: hasResonated ? `1px solid ${accent}40` : '1px solid var(--border)',
              background: hasResonated ? `${accent}15` : 'transparent',
              color: hasResonated ? accent : '#a8b5c4',
              cursor: 'pointer', fontSize: '14px',
              transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
              fontWeight: hasResonated ? 500 : 400,
            }}
          >
            <Heart size={16} fill={hasResonated ? accent : 'none'} color={hasResonated ? accent : '#a8b5c4'} />
            <span>{post.resonanceCount}</span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>I felt this too</span>
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '20px',
              border: copied ? '1px solid rgba(127,182,154,0.3)' : '1px solid var(--border)',
              background: copied ? 'rgba(127,182,154,0.08)' : 'transparent',
              color: copied ? '#7fb69a' : '#a8b5c4',
              cursor: 'pointer', fontSize: '14px',
              transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
            }}
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? 'Copied!' : 'Share'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
