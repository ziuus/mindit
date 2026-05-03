'use client';

import { X } from 'lucide-react';

interface SafetyModalProps {
  onClose: () => void;
  onProceed: () => void;
}

export default function SafetyModal({ onClose, onProceed }: SafetyModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        background: 'rgba(10, 15, 20, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'varpx',
          padding: '32px',
          maxWidth: '480px',
          width: '100%',
          animation: 'fadeUp 0.3s ease forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            float: 'right',
            background: 'none',
            border: 'none',
            color: '#a8b5c4',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '24px',
          color: '#e8edf2',
          marginBottom: '8px',
          fontWeight: 600,
        }}>
          Before you share this, we want to check in on you.
        </h2>
        <p style={{
          color: 'var(--accent-sage)',
          fontSize: '15px',
          marginBottom: '24px',
        }}>
          What you&apos;re feeling matters.
        </p>

        <div style={{
          background: 'var(--bg-tertiary)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <p style={{
            color: '#a8b5c4',
            fontSize: '13px',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Free helplines in India
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { emoji: '📞', name: 'iCall (TISS Mumbai)', number: '9152987821', hours: 'Mon–Sat, 8am–10pm' },
              { emoji: '📞', name: 'Vandrevala Foundation', number: '1860-2662-345', hours: '24/7' },
              { emoji: '💬', name: 'iChat (text)', number: 'ichat.iitb.ac.in', hours: '' },
              { emoji: '📞', name: 'Snehi', number: '044-24640050', hours: '' },
            ].map(({ emoji, name, number, hours }) => (
              <div key={number} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{ fontSize: '18px', marginTop: '2px' }}>{emoji}</span>
                <div>
                  <p style={{ color: '#e8edf2', fontSize: '14px', fontWeight: 500 }}>
                    {name}
                  </p>
                  <p style={{ color: 'var(--accent-sage)', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace" }}>
                    {number}
                  </p>
                  {hours && (
                    <p style={{ color: '#6b7a8d', fontSize: '12px', marginTop: '2px' }}>
                      {hours}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="tel:9152987821"
            className="btn-primary"
            style={{
              flex: 1,
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Talk to someone now
          </a>
          <button
            onClick={onProceed}
            className="btn-ghost"
            style={{ flex: 1 }}
          >
            I&apos;m safe, share anyway
          </button>
        </div>
      </div>
    </div>
  );
}
