'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const PROMPTS = [
  "What's the thing you keep almost saying, but don't?",
  "What are you pretending is okay?",
  "What do you wish someone would ask you?",
  "What would you tell yourself from a year ago?",
  "What's weighing on you that no one knows about?",
  "What feeling have you been avoiding today?",
  "What do you need right now that you haven't asked for?",
  "What part of you are you hiding from the people closest to you?",
  "What would you say if you knew no one would judge you?",
  "When was the last time you felt truly understood?",
  "What are you carrying that isn't yours to carry?",
  "What do you miss that you've never told anyone you miss?",
];

function getTodaysPrompt(): string {
  // Deterministic daily rotation based on date
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  return PROMPTS[dayIndex % PROMPTS.length];
}

export default function DailyPrompt() {
  const [prompt, setPrompt] = useState('');
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed today
    const dismissedDate = localStorage.getItem('mindit_prompt_dismissed');
    const today = new Date().toDateString();
    if (dismissedDate === today) {
      setDismissed(true);
      return;
    }
    setPrompt(getTodaysPrompt());
  }, []);

  const handleDismiss = () => {
    const today = new Date().toDateString();
    localStorage.setItem('mindit_prompt_dismissed', today);
    setVisible(false);
    setTimeout(() => setDismissed(true), 400);
  };

  if (dismissed || !prompt) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: '28px',
            background: 'linear-gradient(135deg, rgba(127, 182, 154, 0.07) 0%, rgba(155, 142, 196, 0.05) 100%)',
            border: '1px solid rgba(127, 182, 154, 0.2)',
            borderRadius: '16px',
            padding: '20px 24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle glow orb */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(127, 182, 154, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(127, 182, 154, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Feather size={16} color="#7fb69a" />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '11px',
                color: '#7fb69a',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '6px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Today's Prompt
              </p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '17px',
                fontStyle: 'italic',
                color: '#e8edf2',
                lineHeight: 1.5,
                marginBottom: '14px',
              }}>
                {prompt}
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link
                  href={`/compose?prompt=${encodeURIComponent(prompt)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    color: '#7fb69a',
                    fontWeight: 500,
                    textDecoration: 'none',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Respond to this <ChevronRight size={14} />
                </Link>
                <span style={{ color: '#6b7a8d', fontSize: '12px', marginLeft: 'auto', cursor: 'pointer' }}
                  onClick={handleDismiss}>
                  Dismiss
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
