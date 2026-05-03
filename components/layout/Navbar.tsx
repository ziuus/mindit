'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrCreateUser, getAvatarUrl } from '@/lib/anonymity';

export default function Navbar() {
  const [user, setUser] = useState<{ pseudonym: string; avatarSeed: string } | null>(null);

  useEffect(() => {
    setUser(getOrCreateUser());
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10,15,20,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: '64px',
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px',
            fontWeight: 700,
            color: '#e8edf2',
          }}
        >
          Mindit
        </span>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#7fb69a',
            display: 'inline-block',
            marginBottom: '2px',
          }}
        />
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link
          href="/feed"
          style={{
            color: '#a8b5c4',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '6px 14px',
          }}
        >
          Feed
        </Link>
        <Link
          href="/reflect"
          style={{
            color: '#a8b5c4',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '6px 14px',
          }}
        >
          Reflect
        </Link>
        <Link
          href="/pulse"
          style={{
            color: '#a8b5c4',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7fb69a', display: 'inline-block', boxShadow: '0 0 6px rgba(127,182,154,0.6)', animation: 'breathe 2s ease-in-out infinite' }} />
          Pulse
        </Link>
        {user && (
          <Link
            href="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '4px 12px 4px 4px',
            }}
          >
            <img
              src={getAvatarUrl(user.avatarSeed)}
              width={28}
              height={28}
              style={{ borderRadius: '50%' }}
              alt="avatar"
            />
            <span
              style={{
                color: '#a8b5c4',
                fontSize: '13px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {user.pseudonym}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
