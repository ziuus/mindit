'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { getUserResonanceCounts } from '@/lib/store';
import { getOrCreateUser } from '@/lib/anonymity';

const STORAGE_KEY = 'mindit_resonance_snapshot';

export default function ResonanceNotification() {
  const [newCount, setNewCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = async () => {
      const user = getOrCreateUser();
      if (!user || user.id === 'server') return;

      const current = await getUserResonanceCounts(user.id);
      if (Object.keys(current).length === 0) return;

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      
      let gained = 0;
      for (const [postId, count] of Object.entries(current)) {
        const prev = stored[postId] ?? count; // first visit: no delta
        if ((count as number) > (prev as number)) {
          gained += (count as number) - (prev as number);
        }
      }

      // Save new snapshot
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

      if (gained > 0 && Object.keys(stored).length > 0) {
        setNewCount(gained);
        setShow(true);
        // Auto-dismiss after 6s
        setTimeout(() => setShow(false), 6000);
      }
    };

    // Small delay so the page loads first
    const t = setTimeout(check, 2000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: '96px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            background: 'rgba(17, 24, 32, 0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(127, 182, 154, 0.25)',
            borderRadius: '14px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(127,182,154,0.1)',
            minWidth: '280px',
            maxWidth: '360px',
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(127, 182, 154, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            animation: 'breathe 3s ease-in-out infinite',
          }}>
            <Heart size={18} color="#7fb69a" fill="rgba(127,182,154,0.3)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              color: '#e8edf2',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              marginBottom: '2px',
            }}>
              {newCount === 1
                ? 'Someone felt this too'
                : `${newCount} people felt this too`}
            </p>
            <p style={{
              color: '#6b7a8d',
              fontSize: '12px',
              fontFamily: "'Inter', sans-serif",
            }}>
              Your words are reaching people.
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7a8d',
              cursor: 'pointer',
              padding: '4px',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
