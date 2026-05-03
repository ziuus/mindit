'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Cell } from 'recharts';
import { Activity, Users, Heart, MessageSquare, TrendingUp, Zap } from 'lucide-react';
import { getPulseStats, type PulseStats } from '@/lib/pulse';
import Link from 'next/link';

const MOOD_META: Record<string, { label: string; color: string; emoji: string }> = {
  hopeful:    { label: 'Hopeful',    color: '#7fb69a', emoji: '🤍' },
  numb:       { label: 'Numb',       color: '#a8b5c4', emoji: '😶' },
  heavy:      { label: 'Heavy',      color: '#e8a0a0', emoji: '😔' },
  scared:     { label: 'Scared',     color: '#9b8ec4', emoji: '😰' },
  frustrated: { label: 'Frustrated', color: '#d4a96a', emoji: '😤' },
};

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  vent:           { label: 'Venting',       color: '#e8a0a0' },
  confession:     { label: 'Confessions',   color: '#d4a96a' },
  secret:         { label: 'Secrets',       color: '#9b8ec4' },
  'unsent-letter':{ label: 'Unsent Letters',color: '#7fb69a' },
  gratitude:      { label: 'Gratitude',     color: '#7fb69a' },
};

function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{val.toLocaleString('en-IN')}</>;
}

function StatCard({ icon: Icon, label, value, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px', borderRadius: '50%',
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
      }} />
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={color} />
      </div>
      <p style={{ color: '#6b7a8d', fontSize: '12px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label}
      </p>
      <p style={{ fontSize: '32px', fontWeight: 700, color: '#e8edf2', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
        <CountUp target={value} />
      </p>
    </motion.div>
  );
}

export default function PulsePage() {
  const [stats, setStats] = useState<PulseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPulseStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const dominantMood = stats?.moodDistribution.reduce((a, b) => a.count > b.count ? a : b, { mood: 'hopeful', count: 0, percentage: 0 });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', background: '#7fb69a',
            animation: 'breathe 2s ease-in-out infinite', boxShadow: '0 0 8px rgba(127,182,154,0.6)',
          }} />
          <span style={{ color: '#7fb69a', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px', textTransform: 'uppercase' }}>
            Live · Updated now
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '40px', fontWeight: 700, color: '#e8edf2', marginBottom: '8px', lineHeight: 1.2,
        }}>
          How is India feeling?
        </h1>
        <p style={{ color: '#6b7a8d', fontSize: '16px', fontFamily: "'Inter', sans-serif" }}>
          A real-time pulse of anonymous thoughts shared on Mindit.
          {dominantMood && stats && !loading && (
            <span style={{ color: MOOD_META[dominantMood.mood]?.color }}>
              {' '}Right now, the dominant mood is <strong>{MOOD_META[dominantMood.mood]?.label}</strong> {MOOD_META[dominantMood.mood]?.emoji}
            </span>
          )}
        </p>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[1,2,3,4].map(i => (
            <motion.div key={i} className="glass" animate={{ opacity: [0.3,0.5,0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i*0.1 }} style={{ height: '130px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <StatCard icon={MessageSquare} label="Posts Shared" value={stats.totalPosts} color="#7fb69a" delay={0} />
          <StatCard icon={Heart} label="Resonances" value={stats.totalResonances} color="#e8a0a0" delay={0.1} />
          <StatCard icon={Users} label="Voices" value={stats.activeUsers} color="#9b8ec4" delay={0.2} />
          <StatCard icon={Activity} label="In 48h Trending" value={stats.moodDistribution.reduce((a,b) => a+b.count, 0)} color="#d4a96a" delay={0.3} />
        </div>
      )}

      {/* Two-column: Mood Bars + Category Rings */}
      {stats && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>

          {/* Mood Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}
          >
            <p style={{ color: '#a8b5c4', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>
              Mood Breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.moodDistribution.map(({ mood, count, percentage }) => (
                <div key={mood}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#e8edf2', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{MOOD_META[mood]?.emoji}</span>
                      {MOOD_META[mood]?.label}
                    </span>
                    <span style={{ fontSize: '12px', color: MOOD_META[mood]?.color, fontFamily: "'JetBrains Mono', monospace" }}>
                      {percentage}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                      style={{ height: '100%', background: MOOD_META[mood]?.color, borderRadius: '3px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}
          >
            <p style={{ color: '#a8b5c4', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>
              What People Share
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.categoryDistribution.map(({ category, count, percentage }) => (
                <div key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#e8edf2', fontFamily: "'Inter', sans-serif" }}>
                      #{CATEGORY_META[category]?.label || category}
                    </span>
                    <span style={{ fontSize: '12px', color: CATEGORY_META[category]?.color, fontFamily: "'JetBrains Mono', monospace" }}>
                      {count}
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                      style={{ height: '100%', background: CATEGORY_META[category]?.color || '#7fb69a', borderRadius: '3px', opacity: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* 7-day trend chart */}
      {stats && !loading && stats.moodTrend.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
          style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}
        >
          <p style={{ color: '#a8b5c4', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>
            7-Day Mood Trend
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.moodTrend}>
              <XAxis dataKey="hour" tick={{ fill: '#6b7a8d', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#111820', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px', color: '#e8edf2' }}
                labelStyle={{ color: '#a8b5c4' }}
              />
              {Object.entries(MOOD_META).map(([mood, meta]) => (
                <Line key={mood} type="monotone" dataKey={mood} stroke={meta.color} strokeWidth={2} dot={false} strokeOpacity={0.8} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
            {Object.entries(MOOD_META).map(([mood, meta]) => (
              <span key={mood} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#6b7a8d', fontFamily: "'Inter', sans-serif" }}>
                <span style={{ width: '12px', height: '2px', background: meta.color, display: 'inline-block', borderRadius: '1px' }} />
                {meta.label}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Top resonated post */}
      {stats?.topPost && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}
          style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid rgba(127,182,154,0.2)', borderLeft: '3px solid rgba(127,182,154,0.5)', borderRadius: '16px', padding: '24px', marginBottom: '40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingUp size={14} color="#7fb69a" />
            <p style={{ color: '#7fb69a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
              Most Resonated
            </p>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontStyle: 'italic', color: '#e8edf2', lineHeight: 1.65, marginBottom: '12px' }}>
            "{stats.topPost.content.length > 220 ? stats.topPost.content.substring(0, 217) + '...' : stats.topPost.content}"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6b7a8d', fontFamily: "'JetBrains Mono', monospace" }}>— {stats.topPost.pseudonym}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#7fb69a' }}>
              <Heart size={11} fill="#7fb69a" />
              {stats.topPost.resonanceCount.toLocaleString('en-IN')} felt this too
            </span>
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }}
        style={{ textAlign: 'center', padding: '48px 20px', background: 'linear-gradient(135deg, rgba(127,182,154,0.06) 0%, rgba(155,142,196,0.04) 100%)', border: '1px solid rgba(127,182,154,0.15)', borderRadius: '20px' }}
      >
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontStyle: 'italic', color: '#e8edf2', marginBottom: '8px' }}>
          Your voice belongs here too.
        </p>
        <p style={{ color: '#6b7a8d', fontSize: '14px', marginBottom: '28px', fontFamily: "'Inter', sans-serif" }}>
          No account. No name. Just you and the people who'll say "I felt this too."
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/compose" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '15px', padding: '12px 28px' }}>
              Share something →
            </button>
          </Link>
          <Link href="/feed" style={{ textDecoration: 'none' }}>
            <button style={{
              fontSize: '15px', padding: '12px 28px', borderRadius: '24px',
              border: '1px solid var(--border)', background: 'transparent',
              color: '#a8b5c4', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}>
              Read the feed
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
