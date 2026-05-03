# MINDIT — Full Phase 1 Build Task

You are building **Mindit** — a dark-themed, anonymous mental health platform for India. Users can express thoughts they've never told anyone, under a pseudonym, with a safety system that detects crisis signals.

## Tech stack already installed
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- framer-motion, lucide-react, recharts, next-themes
- clsx, tailwind-merge

## DESIGN SYSTEM — implement this EXACTLY

### globals.css — replace completely with:
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-primary: #0a0f14;
  --bg-secondary: #111820;
  --bg-tertiary: #161e28;
  --bg-glass: rgba(255, 255, 255, 0.04);
  --bg-glass-hover: rgba(255, 255, 255, 0.07);
  --accent-sage: #7fb69a;
  --accent-sage-dim: rgba(127, 182, 154, 0.15);
  --accent-lavender: #9b8ec4;
  --accent-lavender-dim: rgba(155, 142, 196, 0.15);
  --accent-blush: #e8a0a0;
  --accent-amber: #d4a96a;
  --text-primary: #e8edf2;
  --text-secondary: #a8b5c4;
  --text-muted: #6b7a8d;
  --border: rgba(255, 255, 255, 0.07);
  --border-hover: rgba(255, 255, 255, 0.14);
  --glow-sage: 0 0 40px rgba(127, 182, 154, 0.15);
  --glow-lavender: 0 0 40px rgba(155, 142, 196, 0.12);
  --radius: 16px;
  --radius-sm: 10px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

.font-display { font-family: 'Playfair Display', serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.glass {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.glass:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-hover);
}

.btn-primary {
  background: var(--accent-sage);
  color: #0a0f14;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-sm);
  padding: 12px 24px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #8fc9aa;
  transform: translateY(-1px);
  box-shadow: var(--glow-sage);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  border-color: var(--border-hover);
  color: var(--text-primary);
  background: var(--bg-glass);
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.04); opacity: 1; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.animate-breathe { animation: breathe 4s ease-in-out infinite; }
.animate-float { animation: float 6s ease-in-out infinite; }
.fade-up { animation: fadeUp 0.5s ease forwards; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }

::selection { background: var(--accent-sage-dim); color: var(--accent-sage); }
```

## FILES TO CREATE

### 1. `lib/utils.ts`
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

### 2. `lib/anonymity.ts`
Generate pseudonyms and avatar seeds. No external deps needed.
```ts
const ADJECTIVES = ['Quiet', 'Wandering', 'Still', 'Gentle', 'Distant', 'Velvet', 'Silver', 'Hollow', 'Woven', 'Faded', 'Amber', 'Drifting', 'Soft', 'Hidden', 'Pale', 'Tender', 'Muted', 'Twilight', 'Echoed', 'Spare'];
const NOUNS = ['Mountain', 'River', 'Forest', 'Ocean', 'Ember', 'Cloud', 'Field', 'Horizon', 'Garden', 'Lantern', 'Shore', 'Valley', 'Meadow', 'Willow', 'Tide', 'Stone', 'Leaf', 'Flame', 'Rain', 'Mist'];

export function generatePseudonym(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
}

export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0a0f14&shapeColor=7fb69a`;
}

export function getOrCreateUser(): { pseudonym: string; avatarSeed: string; id: string } {
  if (typeof window === 'undefined') return { pseudonym: 'QuietMountain42', avatarSeed: 'default', id: 'server' };
  const stored = localStorage.getItem('mindit_user');
  if (stored) return JSON.parse(stored);
  const user = {
    id: crypto.randomUUID(),
    pseudonym: generatePseudonym(),
    avatarSeed: crypto.randomUUID(),
  };
  localStorage.setItem('mindit_user', JSON.stringify(user));
  return user;
}
```

### 3. `lib/safety.ts`
Keyword-only safety pipeline (no ML needed for MVP):
```ts
export type SafetyTier = 'safe' | 'watch' | 'hold' | 'crisis';
export interface SafetyResult { tier: SafetyTier; score: number; triggers: string[]; }

const CRISIS_KEYWORDS = [
  'want to die', 'end it all', "can't go on", 'no point living', 'kill myself',
  'end my life', 'suicide', 'self harm', 'hurt myself', 'not worth living',
  'khatam karna', 'jeena nahi', 'bas kar diya', 'sab khatam', 'thak gaya hun',
  'mar jana chahta', 'zindagi nahi chahiye'
];
const WATCH_KEYWORDS = [
  'hopeless', 'worthless', 'no one cares', 'burden', 'empty inside',
  'trapped', 'exhausted', 'breaking down', 'can\'t cope', 'falling apart',
  'nobody understands', 'alone forever', 'hate myself', 'give up'
];

export function analyzeSafety(text: string): SafetyResult {
  const lower = text.toLowerCase();
  const triggers: string[] = [];
  let score = 0;

  for (const kw of CRISIS_KEYWORDS) {
    if (lower.includes(kw)) {
      score = Math.max(score, 0.88);
      triggers.push(`crisis_keyword:${kw}`);
    }
  }
  for (const kw of WATCH_KEYWORDS) {
    if (lower.includes(kw)) {
      score = Math.max(score, 0.42);
      triggers.push(`watch_keyword:${kw}`);
    }
  }

  let tier: SafetyTier = 'safe';
  if (score >= 0.85) tier = 'crisis';
  else if (score >= 0.6) tier = 'hold';
  else if (score >= 0.35) tier = 'watch';

  return { tier, score, triggers };
}
```

### 4. `lib/store.ts`
In-memory mock store (no Supabase needed for MVP demo):
```ts
export interface Post {
  id: string;
  pseudonym: string;
  avatarSeed: string;
  content: string;
  category: 'vent' | 'secret' | 'confession' | 'unsent-letter' | 'gratitude';
  mood: 'numb' | 'heavy' | 'frustrated' | 'scared' | 'hopeful';
  resonanceCount: number;
  resonatedBy: string[];
  safetyTier: string;
  createdAt: Date;
  userId: string;
}

const SEED_POSTS: Post[] = [
  {
    id: '1', pseudonym: 'QuietMountain42', avatarSeed: 'qm42',
    content: "I smiled at everyone today at work. No one knows I cried in the bathroom for 10 minutes before that meeting. I don't know how to stop performing happiness.",
    category: 'vent', mood: 'heavy', resonanceCount: 47, resonatedBy: [], safetyTier: 'safe',
    createdAt: new Date(Date.now() - 2 * 3600000), userId: 'seed1'
  },
  {
    id: '2', pseudonym: 'DriftingShore19', avatarSeed: 'ds19',
    content: "I'm the 'strong one' in my family. But sometimes I just want someone to ask me if I'm okay. Just once. Without me having to perform being fine.",
    category: 'secret', mood: 'numb', resonanceCount: 89, resonatedBy: [], safetyTier: 'watch',
    createdAt: new Date(Date.now() - 5 * 3600000), userId: 'seed2'
  },
  {
    id: '3', pseudonym: 'VelvetTide33', avatarSeed: 'vt33',
    content: "Unsent letter to my father: I forgive you. Not because what you did was okay, but because I'm tired of carrying it. I don't know if I'll ever send this.",
    category: 'unsent-letter', mood: 'hopeful', resonanceCount: 134, resonatedBy: [], safetyTier: 'safe',
    createdAt: new Date(Date.now() - 12 * 3600000), userId: 'seed3'
  },
  {
    id: '4', pseudonym: 'AmberMist77', avatarSeed: 'am77',
    content: "I turned down a job abroad to stay close to my parents. Now I resent them for it even though they never asked me to. I feel like a terrible person.",
    category: 'confession', mood: 'frustrated', resonanceCount: 62, resonatedBy: [], safetyTier: 'safe',
    createdAt: new Date(Date.now() - 18 * 3600000), userId: 'seed4'
  },
  {
    id: '5', pseudonym: 'SilverMeadow55', avatarSeed: 'sm55',
    content: "For the first time in 3 years, I cooked a proper meal for myself tonight. It sounds small but it felt like reclaiming something.",
    category: 'gratitude', mood: 'hopeful', resonanceCount: 201, resonatedBy: [], safetyTier: 'safe',
    createdAt: new Date(Date.now() - 24 * 3600000), userId: 'seed5'
  },
];

let posts: Post[] = [...SEED_POSTS];

export function getPosts(filter?: { category?: string; mood?: string }): Post[] {
  let filtered = [...posts].reverse();
  if (filter?.category && filter.category !== 'all') {
    filtered = filtered.filter(p => p.category === filter.category);
  }
  if (filter?.mood && filter.mood !== 'all') {
    filtered = filtered.filter(p => p.mood === filter.mood);
  }
  return filtered;
}

export function getPost(id: string): Post | undefined {
  return posts.find(p => p.id === id);
}

export function addPost(post: Post): void {
  posts = [post, ...posts];
}

export function toggleResonance(postId: string, userId: string): Post | undefined {
  const post = posts.find(p => p.id === postId);
  if (!post) return undefined;
  if (post.resonatedBy.includes(userId)) {
    post.resonatedBy = post.resonatedBy.filter(id => id !== userId);
    post.resonanceCount--;
  } else {
    post.resonatedBy.push(userId);
    post.resonanceCount++;
  }
  return post;
}

export function getUserPosts(userId: string): Post[] {
  return posts.filter(p => p.userId === userId).reverse();
}
```

### 5. `components/layout/Navbar.tsx`
Dark glassmorphic top navbar. Shows logo "Mindit" in Playfair Display with sage accent dot. Right side: avatar + pseudonym if user exists. Desktop only (bottom nav on mobile).

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrCreateUser, getAvatarUrl } from '@/lib/anonymity';

export default function Navbar() {
  const [user, setUser] = useState<{ pseudonym: string; avatarSeed: string } | null>(null);
  useEffect(() => { setUser(getOrCreateUser()); }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10,15,20,0.85)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '64px',
    }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#e8edf2' }}>
          Mindit
        </span>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7fb69a', display: 'inline-block', marginBottom: '2px' }} />
      </Link>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/feed" style={{ color: '#a8b5c4', textDecoration: 'none', fontSize: '14px', padding: '6px 14px' }}>Feed</Link>
        <Link href="/reflect" style={{ color: '#a8b5c4', textDecoration: 'none', fontSize: '14px', padding: '6px 14px' }}>Reflect</Link>
        {user && (
          <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '4px 12px 4px 4px' }}>
            <img src={getAvatarUrl(user.avatarSeed)} width={28} height={28} style={{ borderRadius: '50%' }} alt="avatar" />
            <span style={{ color: '#a8b5c4', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>{user.pseudonym}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
```

### 6. `components/layout/BottomNav.tsx`
Mobile bottom navigation (hidden on md+):
```tsx
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
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10,15,20,0.92)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    }} className="md:hidden">
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            textDecoration: 'none', padding: '4px',
            color: active ? '#7fb69a' : '#6b7a8d',
          }}>
            <Icon size={22} strokeWidth={active ? 2 : 1.5} />
            <span style={{ fontSize: '11px', fontWeight: active ? 500 : 400 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

### 7. `components/post/PostCard.tsx`
Beautiful glassmorphic post card. Shows: avatar, pseudonym (JetBrains Mono), time ago, category badge, mood emoji, post content (Playfair Display for content body), resonance button.

Mood emojis: numb=😶, heavy=😔, frustrated=😤, scared=😰, hopeful=🤍
Category colors: vent=#e8a0a0, secret=#9b8ec4, confession=#d4a96a, unsent-letter=#7fb69a, gratitude=#7fb69a

Include a subtle left border color based on mood.

### 8. `components/post/ResonanceButton.tsx`
"I felt this too" button. On click: animate with a pulse ring, toggle resonated state. Shows count. When resonated: glows sage green.

### 9. `components/post/PostComposer.tsx`
Full-screen dark overlay composer. Elements:
- Top: "What's on your mind?" in Playfair Display italic
- Large textarea (no border, transparent, Inter font, placeholder "Say what you can't say anywhere else...")
- Mood row: 5 emoji buttons (😶 Numb, 😔 Heavy, 😤 Frustrated, 😰 Scared, 🤍 Hopeful) — horizontal scroll on mobile
- Category row: pill buttons for vent / secret / confession / unsent-letter / gratitude
- Character count (bottom right, JetBrains Mono, fades in after 20 chars)
- Submit button: "Share this" — runs safety check, shows crisis banner if needed
- X button to close/dismiss

### 10. `components/safety/CrisisBanner.tsx`
For 'watch' tier posts — shown as a gentle toast after publishing:
- Sage-tinted glass card
- Text: "🌿 We noticed this one felt heavy. You're not alone in carrying it."
- Two buttons: "See free support" (opens SafetyModal) and "I'm okay" (dismiss)
- Slides in from bottom, auto-dismisses after 10s if not interacted with

### 11. `components/safety/SafetyModal.tsx`
For 'crisis' tier — full modal blocking submission:
- Dark overlay
- Title: "Before you share this, we want to check in on you."
- Subtitle: "What you're feeling matters."
- Helpline list (styled nicely):
  - 📞 iCall (TISS Mumbai): 9152987821 — Mon–Sat, 8am–10pm
  - 📞 Vandrevala Foundation: 1860-2662-345 — 24/7
  - 💬 iChat (text): ichat.iitb.ac.in
  - 📞 Snehi: 044-24640050
- Two buttons: "Talk to someone now" (opens tel: link) and "I'm safe, share anyway" (proceeds)

### 12. `components/onboarding/OnboardFlow.tsx`
3-step modal that shows on first visit:
- Step 1: "You are..." — show generated pseudonym + DiceBear avatar. Big, centered. Subtext: "This is who you are here. No name, no email, no history." Button: "This is me →"
- Step 2: "Why are you here?" — 6 word pills to pick (up to 3): Overwhelmed / Healing / Curious / Lonely / Processing / Hopeful. Button: "Continue →"
- Step 3: "You're safe here." — 3 bullet points about privacy. CTA: "Enter Mindit →" which navigates to /feed

Animated transitions between steps using framer-motion (slide left).

### 13. Landing page `app/page.tsx`
Full-screen dark hero:
- Animated background: subtle floating gradient orbs (sage + lavender, very dim, CSS animation)
- Center: "Mindit" in Playfair Display, ~72px, with a thin horizontal line under it
- Tagline: "Say what you can't say anywhere else." in Inter Light
- Subtext (smaller, muted): "Anonymous. Safe. Yours."
- CTA button: "Enter safely →" (btn-primary)
- Below: 3 subtle stat cards (glassmorphic): "300M+ Indians" / "Judgment-free" / "Crisis-aware"
- On CTA click: trigger OnboardFlow modal if first visit, else go to /feed

### 14. Feed page `app/(main)/feed/page.tsx`  
- Filter bar: category pills + mood pills (horizontal scroll)
- Post cards in a single column, max-width 680px, centered
- Animated entry with framer-motion stagger (0.08s delay per card)
- Floating "Write" FAB button (bottom right, desktop) that opens PostComposer
- Empty state: breathing animation with text "Be the first to speak."

### 15. Compose page `app/(main)/compose/page.tsx`
Full-page PostComposer (for mobile bottom nav "Write" tab).

### 16. Profile/Vault page `app/(main)/profile/page.tsx`
- Shows user's pseudonym + avatar large at top
- Their posts in timeline (reverse chronological)
- Mood distribution mini-chart (recharts PieChart or simple colored bars)
- Empty state if no posts

### 17. Reflect page `app/(main)/reflect/page.tsx`
- Dark, minimal writing space
- Prompts cycling at top (fade in/out): "What's weighing on you today?", "What do you wish someone would ask you?", "What are you pretending is okay?", "What would you tell yourself from a year ago?"
- Textarea below
- Submit: "Reflect" button — saves locally to localStorage
- Below: show past reflection entries (date + preview)
- AI response: static thoughtful follow-up questions (no API needed for MVP)

### 18. `app/layout.tsx`
Root layout with Navbar + BottomNav. Dark background. Proper meta tags for Mindit.

### 19. Single Post page `app/(main)/post/[id]/page.tsx`
Show full post + resonance count + share button (copies link to clipboard). Back button.

## IMPORTANT NOTES

1. Use INLINE STYLES where possible alongside Tailwind for the custom CSS vars (since Tailwind v4 config is different).
2. All pages need proper padding-top (80px) to account for fixed Navbar and padding-bottom (80px) for mobile BottomNav.
3. The OnboardFlow should only show once (check localStorage key 'mindit_onboarded').
4. All animations must respect `prefers-reduced-motion`.
5. Mobile-first: test at 375px width mentally.
6. No hardcoded Supabase calls — use the in-memory store from lib/store.ts.
7. The PostComposer should run `analyzeSafety` from lib/safety.ts on submit.
8. Category badges should use these exact labels: #vent, #secret, #confession, #unsent-letter, #gratitude.

## TAILWIND CONFIG
Tailwind v4 uses CSS-based config. Keep `tailwind.config.ts` minimal since design tokens are in globals.css custom properties. Add `md:hidden` and responsive utilities as needed.

## WHAT TO BUILD (in order):
1. app/globals.css (replace default)
2. lib/utils.ts, lib/anonymity.ts, lib/safety.ts, lib/store.ts
3. components/layout/Navbar.tsx, BottomNav.tsx
4. components/safety/CrisisBanner.tsx, SafetyModal.tsx
5. components/post/ResonanceButton.tsx, PostCard.tsx, PostComposer.tsx
6. components/onboarding/OnboardFlow.tsx
7. app/layout.tsx (update)
8. app/page.tsx (landing)
9. app/(main)/feed/page.tsx
10. app/(main)/compose/page.tsx
11. app/(main)/post/[id]/page.tsx
12. app/(main)/profile/page.tsx
13. app/(main)/reflect/page.tsx

Build all of these completely. Do not skip any file. Make every component visually stunning with the design system specified.
