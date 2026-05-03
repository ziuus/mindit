'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, X, Heart } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Post } from '@/lib/store';

const MOOD_META: Record<string, { label: string; color: string; emoji: string; bg: string }> = {
  hopeful:    { label: 'Hopeful',    color: '#7fb69a', emoji: '🤍', bg: 'rgba(127,182,154,0.08)' },
  numb:       { label: 'Numb',       color: '#a8b5c4', emoji: '😶', bg: 'rgba(168,181,196,0.06)' },
  heavy:      { label: 'Heavy',      color: '#e8a0a0', emoji: '😔', bg: 'rgba(232,160,160,0.07)' },
  scared:     { label: 'Scared',     color: '#9b8ec4', emoji: '😰', bg: 'rgba(155,142,196,0.08)' },
  frustrated: { label: 'Frustrated', color: '#d4a96a', emoji: '😤', bg: 'rgba(212,169,106,0.07)' },
};

interface Props {
  post: Post;
  onClose: () => void;
}

export default function ShareCard({ post, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const mood = MOOD_META[post.mood] || MOOD_META.hopeful;
  const excerpt = post.content.length > 200
    ? post.content.substring(0, 197) + '...'
    : post.content;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0a0f14',
      });
      const link = document.createElement('a');
      link.download = `mindit-${post.id.substring(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#0a0f14' });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'mindit.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Shared on Mindit',
          text: `"${post.content.substring(0, 100)}..." — mindit-gules.vercel.app`,
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(10,15,20,0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: '480px' }}
        >
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ color: '#a8b5c4', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              Save & share your card
            </p>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7a8d', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* The card itself — this gets captured */}
          <div
            ref={cardRef}
            style={{
              width: '100%',
              background: '#0a0f14',
              borderRadius: '20px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${mood.color}30`,
            }}
          >
            {/* Glow orbs */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: `radial-gradient(circle, ${mood.color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,142,196,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: '#e8edf2' }}>
                Mindit<span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#7fb69a', marginLeft: '4px', marginBottom: '2px', verticalAlign: 'middle' }} />
              </span>
              <span style={{ fontSize: '13px', color: mood.color, background: mood.bg, border: `1px solid ${mood.color}30`, borderRadius: '12px', padding: '4px 12px', fontFamily: "'Inter', sans-serif" }}>
                {mood.emoji} {mood.label}
              </span>
            </div>

            {/* Content */}
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '18px', fontStyle: 'italic', lineHeight: 1.65,
              color: '#e8edf2', marginBottom: '24px', fontWeight: 400,
            }}>
              "{excerpt}"
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: '16px' }}>
              <span style={{ fontSize: '12px', color: '#6b7a8d', fontFamily: "'JetBrains Mono', monospace" }}>
                — {post.pseudonym}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={12} fill={mood.color} color={mood.color} />
                <span style={{ fontSize: '12px', color: mood.color, fontFamily: "'Inter', sans-serif" }}>
                  {post.resonanceCount} felt this too
                </span>
              </div>
            </div>

            {/* Watermark URL */}
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'rgba(107,122,141,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px' }}>
              mindit-gules.vercel.app
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNativeShare}
              className="btn-primary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Share2 size={15} />
              Share to Stories
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              disabled={downloading}
              style={{
                padding: '12px 20px', borderRadius: '24px',
                border: '1px solid var(--border)', background: 'transparent',
                color: downloaded ? '#7fb69a' : '#a8b5c4',
                cursor: downloading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: "'Inter', sans-serif", fontSize: '14px',
                borderColor: downloaded ? 'rgba(127,182,154,0.4)' : 'var(--border)',
              }}
            >
              <Download size={15} />
              {downloading ? 'Saving...' : downloaded ? 'Saved!' : 'Download'}
            </motion.button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#6b7a8d', fontFamily: "'Inter', sans-serif" }}>
            Tap outside to close
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
