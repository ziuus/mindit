'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Shield, Lock } from 'lucide-react';
import { getOrCreateUser, getAvatarUrl, generatePseudonym } from '@/lib/anonymity';

const WHY_OPTIONS = ['Overwhelmed', 'Healing', 'Curious', 'Lonely', 'Processing', 'Hopeful'];

export default function OnboardFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [selectedWhy, setSelectedWhy] = useState<string[]>([]);

  useEffect(() => {
    const onboarded = localStorage.getItem('mindit_onboarded');
    if (!onboarded) {
      setOpen(true);
      setUser(getOrCreateUser());
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('mindit_onboarded', 'true');
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const toggleWhy = (option: string) => {
    if (selectedWhy.includes(option)) {
      setSelectedWhy(selectedWhy.filter(w => w !== option));
    } else if (selectedWhy.length < 3) {
      setSelectedWhy([...selectedWhy, option]);
    }
  };

  if (!open || !user) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        background: 'rgba(10, 15, 20, 0.97)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#6b7a8d',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>

          {step === 1 && (
            <div>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 24px',
                border: '3px solid rgba(127, 182, 154, 0.3)',
              }}>
                <img
                  src={getAvatarUrl(user.avatarSeed)}
                  width={120}
                  height={120}
                  alt="avatar"
                  style={{ display: 'block' }}
                />
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                color: '#e8edf2',
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                You are...
              </h2>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '18px',
                color: 'var(--accent-sage)',
                marginBottom: '16px',
                fontWeight: 500,
              }}>
                {user.pseudonym}
              </p>
              <p style={{
                color: '#a8b5c4',
                fontSize: '14px',
                lineHeight: 1.6,
                marginBottom: '32px',
              }}>
                This is who you are here. No name, no email, no history.
              </p>
              <button onClick={nextStep} className="btn-primary" style={{ width: '100%' }}>
                This is me →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                color: '#e8edf2',
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                Why are you here?
              </h2>
              <p style={{
                color: '#a8b5c4',
                fontSize: '14px',
                marginBottom: '24px',
              }}>
                Pick up to 3 words that resonate (optional)
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '32px',
              }}>
                {WHY_OPTIONS.map(option => (
                  <button
                    key={option}
                    onClick={() => toggleWhy(option)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '20px',
                      border: `1px solid ${selectedWhy.includes(option) ? 'rgba(127, 182, 154, 0.4)' : 'var(--border)'}`,
                      background: selectedWhy.includes(option) ? 'rgba(127, 182, 154, 0.15)' : 'transparent',
                      color: selectedWhy.includes(option) ? '#7fb69a' : '#a8b5c4',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedWhy.includes(option) ? 500 : 400,
                      transition: 'all 0.2s ease',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button onClick={nextStep} className="btn-primary" style={{ width: '100%' }}>
                Continue →
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(127, 182, 154, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <Shield size={28} color="#7fb69a" />
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                color: '#e8edf2',
                marginBottom: '16px',
                fontWeight: 600,
              }}>
                You&apos;re safe here.
              </h2>
              <div style={{
                textAlign: 'left',
                marginBottom: '32px',
              }}>
                {[
                  { icon: <Lock size={16} />, text: 'Your identity stays hidden. Always.' },
                  { icon: <Shield size={16} />, text: 'We scan for crisis signals to offer help.' },
                  { icon: <Heart size={16} />, text: 'What you share helps others feel less alone.' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '16px',
                    color: '#a8b5c4',
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}>
                    <span style={{ color: '#7fb69a', marginTop: '2px' }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  handleClose();
                  window.location.href = '/feed';
                }}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Enter Mindit →
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
