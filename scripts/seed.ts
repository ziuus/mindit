/**
 * Mindit Seed Script
 * Run with: npx tsx scripts/seed.ts
 * Seeds the Supabase database with authentic-feeling posts.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function randomId() {
  return Math.random().toString(36).substring(2, 15);
}

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

const ADJECTIVES = ['Quiet','Wandering','Still','Gentle','Distant','Velvet','Silver','Hollow','Woven','Faded','Amber','Drifting','Soft','Hidden','Pale','Tender','Muted','Twilight','Echoed','Spare'];
const NOUNS = ['Mountain','River','Forest','Ocean','Ember','Cloud','Field','Horizon','Garden','Lantern','Shore','Valley','Meadow','Willow','Tide','Stone','Leaf','Flame','Rain','Mist'];

function pseudonym() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
}

const seedPosts = [
  {
    content: "I smiled at everyone at work today. No one knows I cried in the bathroom before that 10am meeting. I don't know how to stop performing happiness.",
    mood: 'heavy',
    category: 'vent',
    safety_tier: 'safe',
    resonance_count: 47,
    created_at: hoursAgo(2),
  },
  {
    content: "I'm the 'strong one' in my family. Everyone comes to me with their problems. But sometimes I just want someone to ask me if I'm okay. Just once. Without me having to ask first.",
    mood: 'numb',
    category: 'secret',
    safety_tier: 'watch',
    resonance_count: 89,
    created_at: hoursAgo(5),
  },
  {
    content: "Unsent letter to my father: I forgive you. Not because what you did was okay, but because I'm tired of carrying it. I don't know if I'll ever send this. I don't know if I need to.",
    mood: 'hopeful',
    category: 'unsent-letter',
    safety_tier: 'safe',
    resonance_count: 134,
    created_at: hoursAgo(12),
  },
  {
    content: "I turned down a job abroad to stay close to my parents. Now I resent them for it even though they never even asked me to stay. I feel like a terrible person for feeling this way.",
    mood: 'frustrated',
    category: 'confession',
    safety_tier: 'safe',
    resonance_count: 62,
    created_at: hoursAgo(18),
  },
  {
    content: "For the first time in 3 years, I cooked a proper meal for myself tonight. Daal and rice. It sounds so small but it felt like reclaiming something I had lost.",
    mood: 'hopeful',
    category: 'gratitude',
    safety_tier: 'safe',
    resonance_count: 201,
    created_at: hoursAgo(24),
  },
  {
    content: "My therapist asked me what brings me joy. I sat in silence for two full minutes. I couldn't think of anything. I laughed it off in the session. I'm still thinking about it.",
    mood: 'numb',
    category: 'vent',
    safety_tier: 'watch',
    resonance_count: 178,
    created_at: hoursAgo(30),
  },
  {
    content: "I have a good job, a good family, no real problems. And I feel hollow every single day. I'm ashamed to even say this out loud because other people have real struggles.",
    mood: 'numb',
    category: 'confession',
    safety_tier: 'watch',
    resonance_count: 243,
    created_at: hoursAgo(36),
  },
  {
    content: "To the version of me from 2 years ago: you were right to leave. I know you didn't believe you deserved better. You did. You do.",
    mood: 'hopeful',
    category: 'unsent-letter',
    safety_tier: 'safe',
    resonance_count: 317,
    created_at: hoursAgo(42),
  },
  {
    content: "My parents still introduce me to relatives using my old job title. The one I quit a year ago because it was destroying me. I haven't told them why I left.",
    mood: 'heavy',
    category: 'secret',
    safety_tier: 'safe',
    resonance_count: 95,
    created_at: hoursAgo(48),
  },
  {
    content: "I rehearse conversations in my head for hours before having them. I've been rehearsing telling my best friend that I've been struggling. It's been 6 months. I still haven't said it.",
    mood: 'scared',
    category: 'vent',
    safety_tier: 'watch',
    resonance_count: 156,
    created_at: hoursAgo(54),
  },
  {
    content: "I deleted Instagram today. Not for a 'digital detox'. Just because I was tired of watching everyone else's curated life while sitting in my room at 11pm eating chips alone.",
    mood: 'heavy',
    category: 'vent',
    safety_tier: 'safe',
    resonance_count: 88,
    created_at: hoursAgo(60),
  },
  {
    content: "I sent a voice note to my old school friend I haven't talked to in 2 years. Just said I missed them. They replied in 4 minutes. We talked for an hour. People want connection. We're all just scared to ask first.",
    mood: 'hopeful',
    category: 'gratitude',
    safety_tier: 'safe',
    resonance_count: 412,
    created_at: hoursAgo(66),
  },
  {
    content: "Confession: I pretend to be busier than I am so people don't notice I have no one to spend time with. It's easier than explaining why I'm so lonely in a city of millions.",
    mood: 'numb',
    category: 'confession',
    safety_tier: 'watch',
    resonance_count: 301,
    created_at: hoursAgo(72),
  },
  {
    content: "To the boy who said I was 'too emotional' — you were right. I feel everything deeply. I've spent years trying to fix that. I'm done. It's not a flaw.",
    mood: 'frustrated',
    category: 'unsent-letter',
    safety_tier: 'safe',
    resonance_count: 267,
    created_at: hoursAgo(80),
  },
  {
    content: "I'm scared I'm becoming my mother. Not the bad parts. All of it. The way she sacrificed herself quietly. I don't want to disappear like that. I don't know how to stop it.",
    mood: 'scared',
    category: 'vent',
    safety_tier: 'watch',
    resonance_count: 192,
    created_at: hoursAgo(90),
  },
];

async function seed() {
  console.log('🌱 Seeding Mindit database...\n');

  for (const post of seedPosts) {
    const userId = `seed_${randomId()}`;
    const avatarSeed = randomId();

    const { error } = await supabase.from('posts').insert({
      user_id: userId,
      pseudonym: pseudonym(),
      avatar_seed: avatarSeed,
      content: post.content,
      mood: post.mood,
      category: post.category,
      safety_tier: post.safety_tier,
      resonance_count: post.resonance_count,
      created_at: post.created_at,
    });

    if (error) {
      console.error(`❌ Failed to insert post: ${error.message}`);
      console.error('   Hint:', error.details || error.hint);
    } else {
      console.log(`✅ [${post.mood} / ${post.category}] "${post.content.substring(0, 60)}..."`);
    }
  }

  console.log('\n✨ Seed complete. Check your feed!');
}

seed();
