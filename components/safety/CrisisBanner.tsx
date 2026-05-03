'use client';

import { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';

interface CrisisBannerProps {
  onDismiss: () => void;
  onShowSupport: () => void;
}

export default function CrisisBanner({ onDismiss, onShowSupport }: CrisisBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 10000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '16px',
        right: '16px',
        zIndex: 40,
        background: 'rgba(127, 182, 154, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(127, 182, 154, 0.2)',
        borderRadius: '16px',
        padding: '16px 20px',
        animation: 'fadeUp 0.5s ease forwards',
      }}
    >
      <button
        onClick={() => { setVisible(false); onDismiss(); }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          color: '#a8b5c4',
          cursor: 'pointer',
          padding: '4px',
        }}
      >
        <X size={16} />
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>🌿</span>
        <div style={{ flex: 1 }}>
          <p style={{
            color: '#e8edf2',
            fontSize: '14px',
            lineHeight: 1.5,
            marginBottom: '12px',
          }}>
            We noticed this one felt heavy. You&apos;re not alone in carrying it.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onShowSupport}
              className="btn-primary"
              style={{
                fontSize: '13px',
                padding: '8px 16px',
              }}
            >
              <Heart size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              See free support
            </button>
            <button
              onClick={() => { setVisible(false); onDismiss(); }}
              className="btn-ghost"
              style={{
                fontSize: '13px',
                padding: '8px 16px',
              }}
            >
              I&apos;m okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
