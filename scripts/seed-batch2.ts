/**
 * Mindit Seed Batch 2
 * Run with: pnpm tsx scripts/seed-batch2.ts
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

const ADJECTIVES = ['Pale','Quiet','Hollow','Amber','Drifting','Tender','Muted','Twilight','Echoed','Burnt','Fracture','Woven','Silver','Distant','Gentle','Soft','Still','Velvet','Faded','Hidden','Sparse','Threadbare','Shattered','Slow','Bright'];
const NOUNS = ['Cedar','Moss','Tide','Stone','Ember','Leaf','Rain','Shore','Field','Horizon','Mist','Willow','Valley','Garden','Lantern','Cloud','River','Flame','Mountain','Ocean','Meadow','Forest','Creek','Dusk','Dawn'];

function pseudonym() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
}

const seedPosts = [
  // ---- VENTS ----
  {
    content: "I told my manager I was going through something personal and needed a lighter week. He said 'we all have personal issues, that's life.' I went home and cried in the shower for 20 minutes. I've never called in sick a single day in 4 years.",
    mood: 'heavy', category: 'vent', safety_tier: 'safe', resonance_count: 88, created_at: hoursAgo(1),
  },
  {
    content: "My parents are proud of my job. My salary. My 'stability'. I haven't told them I wake up at 3am sometimes and just stare at the ceiling because I don't know who I am outside of it.",
    mood: 'numb', category: 'vent', safety_tier: 'watch', resonance_count: 203, created_at: hoursAgo(3),
  },
  {
    content: "I used to write. Not for anyone else. Just for me. Short stories, diary entries, nonsense poetry. Somewhere between 22 and 27 I stopped. I don't know why. I'm trying to remember who that person was.",
    mood: 'heavy', category: 'vent', safety_tier: 'safe', resonance_count: 147, created_at: hoursAgo(7),
  },
  {
    content: "I've been in three therapy sessions and each time the therapist asks 'how does that make you feel?' I say 'fine' and move on. I don't know why I can't just say it. I'm paying them to listen. I still can't do it.",
    mood: 'numb', category: 'vent', safety_tier: 'watch', resonance_count: 176, created_at: hoursAgo(11),
  },
  {
    content: "The loneliest I've ever felt wasn't when I was alone. It was at a birthday dinner surrounded by 12 of my closest friends, laughing at everything, and feeling completely invisible.",
    mood: 'numb', category: 'vent', safety_tier: 'watch', resonance_count: 341, created_at: hoursAgo(15),
  },
  {
    content: "I moved to Bengaluru alone at 24 with a suitcase and a salary letter. Everyone said I was so brave. I was terrified every single day for 8 months and never told a single person.",
    mood: 'scared', category: 'vent', safety_tier: 'safe', resonance_count: 264, created_at: hoursAgo(20),
  },
  {
    content: "I get anxious when people are too nice to me. I start looking for the catch. I think I've been disappointed so many times that kindness feels like a setup now. I don't know how to fix that.",
    mood: 'scared', category: 'vent', safety_tier: 'watch', resonance_count: 198, created_at: hoursAgo(27),
  },
  // ---- CONFESSIONS ----
  {
    content: "I pretend to have plans on weekends so my family won't ask why I'm not going out. The truth is I spend most weekends alone and I like it, but saying that out loud feels like admitting something shameful.",
    mood: 'numb', category: 'confession', safety_tier: 'safe', resonance_count: 312, created_at: hoursAgo(35),
  },
  {
    content: "I've been comparing my salary with my batchmates from college for 3 years. I keep a mental spreadsheet. I hate myself for it but I can't stop.",
    mood: 'frustrated', category: 'confession', safety_tier: 'safe', resonance_count: 187, created_at: hoursAgo(40),
  },
  {
    content: "I told my parents I don't believe in God anymore. They went quiet for three days. I've spent the last month googling 'how to reconnect with parents after religion argument'. We still haven't talked about it.",
    mood: 'scared', category: 'confession', safety_tier: 'safe', resonance_count: 233, created_at: hoursAgo(46),
  },
  {
    content: "I chose engineering because everyone around me did. I never even asked myself if I wanted to. 10 years later I work in finance. I have no idea what I would have become if I had been asked.",
    mood: 'numb', category: 'confession', safety_tier: 'safe', resonance_count: 289, created_at: hoursAgo(52),
  },
  {
    content: "Sometimes I cancel plans not because I'm tired, but because I'm scared I'll say the wrong thing and everyone will realize I'm not as okay as I look.",
    mood: 'scared', category: 'confession', safety_tier: 'safe', resonance_count: 376, created_at: hoursAgo(58),
  },
  // ---- SECRETS ----
  {
    content: "I haven't told my husband that I cried at his mom's house when she called my cooking 'not proper'. It's been six months. I smile every time we visit. I don't know why I haven't said anything.",
    mood: 'heavy', category: 'secret', safety_tier: 'safe', resonance_count: 144, created_at: hoursAgo(64),
  },
  {
    content: "I secretly applied to a master's program abroad last year. Got in. Turned it down because I didn't want to disappoint my family. I still check the university's Instagram sometimes.",
    mood: 'heavy', category: 'secret', safety_tier: 'safe', resonance_count: 398, created_at: hoursAgo(70),
  },
  {
    content: "I have a folder on my phone called 'someday' — screenshots of places I want to go, things I want to do, books to read. I've been adding to it for 5 years. I've done almost nothing in it.",
    mood: 'numb', category: 'secret', safety_tier: 'safe', resonance_count: 223, created_at: hoursAgo(76),
  },
  {
    content: "My best friend doesn't know I cried at their wedding. Not from happiness. Because I realized I had no one who would be crying for me on mine. I was the loudest person at the reception.",
    mood: 'heavy', category: 'secret', safety_tier: 'watch', resonance_count: 267, created_at: hoursAgo(82),
  },
  // ---- UNSENT LETTERS ----
  {
    content: "To the version of me who stayed in that relationship two years too long — I understand now. You weren't weak. You just believed in something that didn't believe back. That's not stupidity. That's love going wrong.",
    mood: 'hopeful', category: 'unsent-letter', safety_tier: 'safe', resonance_count: 489, created_at: hoursAgo(88),
  },
  {
    content: "To my father who doesn't understand why I need space — I love you. The distance isn't rejection. I'm trying to become a person you can be proud of in a way that I can actually sustain. Please wait for me.",
    mood: 'hopeful', category: 'unsent-letter', safety_tier: 'safe', resonance_count: 302, created_at: hoursAgo(94),
  },
  {
    content: "To the professor who told me I was 'average' in front of the whole class in second year — I just shipped a product used by 40,000 people. I don't think about you often, but I thought about you today.",
    mood: 'hopeful', category: 'unsent-letter', safety_tier: 'safe', resonance_count: 561, created_at: hoursAgo(100),
  },
  {
    content: "To my 16-year-old self: the things you're ashamed of right now — the way you talk, the music you love, the things you care too much about — those are the things that will make you interesting. Stop shrinking.",
    mood: 'hopeful', category: 'unsent-letter', safety_tier: 'safe', resonance_count: 634, created_at: hoursAgo(108),
  },
  // ---- GRATITUDE ----
  {
    content: "My flatmate knocked on my door at midnight with a cup of chai because she 'just had a feeling'. I had been sitting in the dark for an hour. I didn't say why. She didn't ask. She just sat with me. That was enough.",
    mood: 'hopeful', category: 'gratitude', safety_tier: 'safe', resonance_count: 447, created_at: hoursAgo(116),
  },
  {
    content: "I started journaling again after 3 years. Just bullet points. 3 sentences before bed. It's been 11 days. I feel... lighter somehow. Like I've been putting things down instead of carrying them all night.",
    mood: 'hopeful', category: 'gratitude', safety_tier: 'safe', resonance_count: 189, created_at: hoursAgo(121),
  },
  {
    content: "I called a random helpline number at 2am during a really bad panic attack. A woman named Priya picked up. She talked to me for 42 minutes about nothing important. I didn't know strangers could be that kind.",
    mood: 'hopeful', category: 'gratitude', safety_tier: 'safe', resonance_count: 502, created_at: hoursAgo(126),
  },
  {
    content: "My doctor asked me today how I was feeling — not medically, just personally. No one had asked me that in weeks. I started crying in the consultation room. She handed me a tissue and said 'that's okay, take your time.' Small acts.",
    mood: 'hopeful', category: 'gratitude', safety_tier: 'safe', resonance_count: 378, created_at: hoursAgo(132),
  },
  {
    content: "Today I walked to the beach and sat for an hour doing nothing. No phone. No music. Just the waves. For the first time in months my brain went quiet. I don't know how to explain it but I feel like I exhaled something I'd been holding for a very long time.",
    mood: 'hopeful', category: 'gratitude', safety_tier: 'safe', resonance_count: 413, created_at: hoursAgo(140),
  },
];

async function seed() {
  console.log(`🌱 Seeding batch 2 — ${seedPosts.length} posts...\n`);
  let ok = 0;

  for (const post of seedPosts) {
    const { error } = await supabase.from('posts').insert({
      user_id: `seed_${randomId()}`,
      pseudonym: pseudonym(),
      avatar_seed: randomId(),
      content: post.content,
      mood: post.mood,
      category: post.category,
      safety_tier: post.safety_tier,
      resonance_count: post.resonance_count,
      created_at: post.created_at,
    });

    if (error) {
      console.error(`❌  ${error.message}`, error.hint || '');
    } else {
      ok++;
      console.log(`✅ [${post.mood}/${post.category}] "${post.content.substring(0, 55)}..."`);
    }
  }

  console.log(`\n✨ Done. ${ok}/${seedPosts.length} posts seeded.`);
}

seed();
