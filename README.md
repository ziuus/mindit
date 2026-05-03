<div align="center">

# 🌿 Mindit

### *Say what you can't say anywhere else.*

An anonymous, Web3-powered mental health sanctuary for India — where pseudonyms protect you, AI watches over you, and resonance reminds you that you're not alone.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ✨ What is Mindit?

Mindit is a **judgment-free digital space** built for the 300 million Indians who carry thoughts they can't voice anywhere — not to family, not to friends, not to colleagues.

You arrive as a pseudonym. You share what you need to share. Others resonate. No names. No history. No judgment.

The platform runs a real-time **AI safety pipeline** that detects crisis signals in posts — and connects at-risk users directly to certified Indian mental health organisations (iCall, Vandrevala Foundation) before they hit publish.

---

## 🎯 Core Principles

| Principle | What it means in practice |
|---|---|
| **Anonymous by default** | Auto-generated pseudonyms (e.g. `QuietMountain42`), no email required |
| **Safety-first** | Every post is scanned for crisis signals before publishing |
| **Resonance over reaction** | No likes, no comments — only *"I felt this too"* |
| **Privacy as architecture** | No IP logging, content on IPFS, wallet optional |
| **Calming, not clinical** | The UI feels like a safe exhale, not a hospital form |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), TypeScript |
| **Styling** | Tailwind CSS v4 + custom CSS design system |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Avatars** | DiceBear (pseudonym-seeded, no real identity) |
| **Safety (Phase 1)** | Keyword-based NLP pipeline (client-side) |
| **Safety (Phase 3)** | Python FastAPI + HuggingFace transformers (Hindi/Hinglish) |
| **Blockchain (Phase 2)** | Solidity + Hardhat + Polygon + Wagmi |
| **Database (Phase 2+)** | Supabase (Postgres) |
| **Storage (Phase 2+)** | IPFS via web3.storage |

---

## 🎨 Design System

```css
/* Palette */
--bg-primary:      #0a0f14  /* Deep midnight */
--accent-sage:     #7fb69a  /* Calming green — primary */
--accent-lavender: #9b8ec4  /* Trust purple — secondary */
--accent-blush:    #e8a0a0  /* Gentle alert */

/* Typography */
Display:  Playfair Display  (emotional, literary)
Body:     Inter             (clean, readable)
Mono:     JetBrains Mono    (pseudonyms, labels)
```

Glassmorphism cards · Floating particle background · Staggered entrance animations · Breathing empty states

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm (`npm install -g pnpm`)

### Run locally

```bash
git clone https://github.com/ziuus/mindit.git
cd mindit
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment variables

Create a `.env.local` file (all optional for Phase 1 local dev):

```env
# Phase 2+ (Supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Safety (Gemini 1.5 Flash)
# Get a free key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=

# Phase 2+ (Blockchain)
NEXT_PUBLIC_ALCHEMY_ID=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Phase 3+ (OpenAI for Reflect journal)
OPENAI_API_KEY=
```

> Phase 1 can run entirely without environment variables using an in-memory store and keyword-based safety. Supabase + Gemini are needed for production.

---

## 🗺️ Pages

| Route | Description |
|---|---|
| `/` | Landing — conversion-optimised animated hero with rotating prompts |
| `/feed` | Anonymous post feed with mood + category filters (Realtime updates) |
| `/compose` | Full-screen writing composer with AI Safety Check |
| `/pulse` | Live data dashboard showing India's anonymous mood |
| `/post/[id]` | Single post view + dynamic OG share cards |
| `/profile` | Private vault — your posts + mood chart |
| `/reflect` | Private AI reflection journal |

---

## 🚨 Safety System

Every post passes through a 4-tier pipeline before publishing:

| Tier | Score | Action |
|---|---|---|
| `safe` | 0–0.34 | Publish immediately |
| `watch` | 0.35–0.59 | Publish + soft "We're here" banner |
| `hold` | 0.60–0.84 | Queue for human review (< 2hr SLA) |
| `crisis` | 0.85–1.0 | Block + show full crisis resource modal |

### 🇮🇳 Crisis resources (always accessible in-app)
- **iCall (TISS Mumbai):** 9152987821 — Mon–Sat, 8am–10pm
- **Vandrevala Foundation:** 1860-2662-345 — 24/7
- **iChat (text):** ichat.iitb.ac.in
- **Snehi:** 044-24640050

---

## 🗓️ Roadmap

### ✅ Phase 1.5 — Production & Scale (Complete)
- Supabase Postgres persistence + Realtime feed
- Gemini 1.5 Flash AI Safety Pipeline (hybrid with local fallback)
- Live "Pulse" data dashboard (`/pulse`)
- Dynamic OG Share Cards (`next/og`)
- Downloadable/Shareable Mood Cards via `html-to-image`
- Growth-optimised landing page

### 🔜 Phase 2 — Web3 Layer
- Wallet connect (Wagmi + RainbowKit)
- `MinditPost.sol` — ERC-721 post ownership
- `MinditToken.sol` — ERC-20 `$MNDT` reward token
- Polygon Mumbai testnet deployment
- IPFS post storage

### 🔮 Phase 3 — Intelligence
- Python NLP microservice (HuggingFace, Hindi/Hinglish fine-tuned)
- iCall/Vandrevala partner webhook integration
- AI Reflection journal (GPT-4o non-directive therapy style)
- Human moderation dashboard

### 🌐 Phase 4 — Scale
- DAO governance (Snapshot)
- Razorpay premium tiers
- PWA + push notifications
- ZK proof identity layer (Semaphore)

---

## 🤝 Contributing

This is an open-source mental health project — contributions that improve safety, privacy, or accessibility are especially welcome.

```bash
# Fork → Branch → PR
git checkout -b feat/your-feature-name
```

Please read the safety system docs before modifying anything in `lib/safety.ts` or any crisis intervention component.

---

## 📄 License

MIT — free to use, modify, and distribute. If you build on this, please keep the crisis helplines in the app.

---

<div align="center">

*Built for the 300 million Indians who carry things they cannot say.*

**🌿 [mindit.app](https://mindit.app)** · Made with care in India

</div>
