'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Shield, Lock, Activity } from 'lucide-react';

const ROTATING_PHRASES = [
  "What's weighing on you that no one knows about?",
  "What do you keep almost saying, but don't?",
  "What are you pretending is okay?",
  "What do you need right now that you haven't asked for?",
  "What would you say if no one was watching?",
];

const STATS = [
  { value: '40+', label: 'Voices heard' },
  { value: '2,000+', label: 'Resonances' },
  { value: '0', label: 'Names collected' },
];

export default function Home() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIdx(i => (i + 1) % ROTATING_PHRASES.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(127, 182, 154, 0.07) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(155, 142, 196, 0.06) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 11s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '640px', width: '100%' }}>

        {/* Live pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(127,182,154,0.08)', border: '1px solid rgba(127,182,154,0.2)', borderRadius: '20px', padding: '6px 16px', marginBottom: '28px' }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7fb69a', display: 'inline-block', boxShadow: '0 0 6px rgba(127,182,154,0.8)', animation: 'breathe 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '13px', color: '#7fb69a', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Anonymous · Safe · India</span>
        </motion.div>

        {/* Hero */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(48px, 8vw, 72px)', color: '#e8edf2', fontWeight: 700, marginBottom: '0px', letterSpacing: '-1.5px', lineHeight: 1.1 }}
        >
          Mindit
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(127, 182, 154, 0.5), transparent)', margin: '16px auto 28px', width: '160px' }}
        />

        {/* Rotating prompt */}
        <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          <motion.p
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(16px, 3vw, 20px)', color: '#a8b5c4', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.4, padding: '0 10px' }}
          >
            "{ROTATING_PHRASES[phraseIdx]}"
          </motion.p>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center', minWidth: '120px' }}>
              <p style={{ color: '#7fb69a', fontSize: '22px', fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>{value}</p>
              <p style={{ color: '#6b7a8d', fontSize: '11px', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}
        >
          <Link href="/feed" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Enter safely →
            </button>
          </Link>
          <Link href="/pulse" style={{ textDecoration: 'none' }}>
            <button style={{
              fontSize: '15px', padding: '14px 24px', borderRadius: '24px',
              border: '1px solid var(--border)', background: 'transparent',
              color: '#a8b5c4', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              display: 'flex', alignItems: 'center', gap: '7px',
            }}>
              <Activity size={15} color="#7fb69a" />
              See India's mood
            </button>
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {[
            { icon: Lock, text: 'No account required' },
            { icon: Shield, text: 'Crisis-aware safety layer' },
            { icon: Heart, text: 'Resonance, not reactions' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7a8d', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
              <Icon size={13} color="#7fb69a" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
