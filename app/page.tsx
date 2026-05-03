'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import OnboardFlow from '@/components/onboarding/OnboardFlow';

export default function Home() {
  const [showOnboard, setShowOnboard] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem('mindit_onboarded');
    if (!onboarded) {
      setShowOnboard(true);
    }
  }, []);

  const handleEnter = () => {
    const onboarded = localStorage.getItem('mindit_onboarded');
    if (!onboarded) {
      setShowOnboard(true);
    } else {
      window.location.href = '/feed';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(127, 182, 154, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155, 142, 196, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '600px' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '72px',
            color: '#e8edf2',
            fontWeight: 700,
            marginBottom: '8px',
            letterSpacing: '-1px',
          }}
        >
          Mindit
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(127, 182, 154, 0.5), transparent)',
            margin: '0 auto 24px',
            width: '200px',
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontSize: '20px',
            color: '#a8b5c4',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            marginBottom: '8px',
          }}
        >
          Say what you can&apos;t say anywhere else.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            fontSize: '14px',
            color: '#6b7a8d',
            marginBottom: '48px',
          }}
        >
          Anonymous. Safe. Yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <button onClick={handleEnter} className="btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
            Enter safely →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '64px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: '300M+ Indians', sub: 'Need mental health support' },
            { label: 'Judgment-free', sub: 'Express freely' },
            { label: 'Crisis-aware', sub: 'We watch for signals' },
          ].map(({ label, sub }) => (
            <div
              key={label}
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px 24px',
                textAlign: 'center',
                minWidth: '160px',
              }}
            >
              <p style={{ color: '#7fb69a', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                {label}
              </p>
              <p style={{ color: '#6b7a8d', fontSize: '12px' }}>
                {sub}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
