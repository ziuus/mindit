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
    id: '1',
    pseudonym: 'QuietMountain42',
    avatarSeed: 'qm42',
    content: "I smiled at everyone today at work. No one knows I cried in the bathroom for 10 minutes before that meeting. I don't know how to stop performing happiness.",
    category: 'vent',
    mood: 'heavy',
    resonanceCount: 47,
    resonatedBy: [],
    safetyTier: 'safe',
    createdAt: new Date(Date.now() - 2 * 3600000),
    userId: 'seed1'
  },
  {
    id: '2',
    pseudonym: 'DriftingShore19',
    avatarSeed: 'ds19',
    content: "I'm the 'strong one' in my family. But sometimes I just want someone to ask me if I'm okay. Just once. Without me having to perform being fine.",
    category: 'secret',
    mood: 'numb',
    resonanceCount: 89,
    resonatedBy: [],
    safetyTier: 'watch',
    createdAt: new Date(Date.now() - 5 * 3600000),
    userId: 'seed2'
  },
  {
    id: '3',
    pseudonym: 'VelvetTide33',
    avatarSeed: 'vt33',
    content: "Unsent letter to my father: I forgive you. Not because what you did was okay, but because I'm tired of carrying it. I don't know if I'll ever send this.",
    category: 'unsent-letter',
    mood: 'hopeful',
    resonanceCount: 134,
    resonatedBy: [],
    safetyTier: 'safe',
    createdAt: new Date(Date.now() - 12 * 3600000),
    userId: 'seed3'
  },
  {
    id: '4',
    pseudonym: 'AmberMist77',
    avatarSeed: 'am77',
    content: "I turned down a job abroad to stay close to my parents. Now I resent them for it even though they never asked me to. I feel like a terrible person.",
    category: 'confession',
    mood: 'frustrated',
    resonanceCount: 62,
    resonatedBy: [],
    safetyTier: 'safe',
    createdAt: new Date(Date.now() - 18 * 3600000),
    userId: 'seed4'
  },
  {
    id: '5',
    pseudonym: 'SilverMeadow55',
    avatarSeed: 'sm55',
    content: "For the first time in 3 years, I cooked a proper meal for myself tonight. It sounds small but it felt like reclaiming something.",
    category: 'gratitude',
    mood: 'hopeful',
    resonanceCount: 201,
    resonatedBy: [],
    safetyTier: 'safe',
    createdAt: new Date(Date.now() - 24 * 3600000),
    userId: 'seed5'
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
