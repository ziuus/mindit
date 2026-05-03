'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PenLine, Archive, Brain } from 'lucide-react';

const tabs = [
  { href: '/feed', icon: Home, label: 'Home' },
  { href: '/compose', icon: PenLine, label: 'Write' },
  { href: '/profile', icon: Archive, label: 'Vault' },
  { href: '/reflect', icon: Brain, label: 'Reflect' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10,15,20,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
      }}
      className="md:hidden"
    >
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              padding: '4px',
              color: active ? '#7fb69a' : '#6b7a8d',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.5} />
            <span style={{ fontSize: '11px', fontWeight: active ? 500 : 400 }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
