import { createClient } from '@/utils/supabase/client';

export interface PulseStats {
  totalPosts: number;
  totalResonances: number;
  moodDistribution: { mood: string; count: number; percentage: number }[];
  categoryDistribution: { category: string; count: number; percentage: number }[];
  moodTrend: { hour: string; numb: number; heavy: number; frustrated: number; scared: number; hopeful: number }[];
  topPost: { content: string; resonanceCount: number; mood: string; pseudonym: string } | null;
  activeUsers: number; // approximated from unique user_ids
}

const MOOD_ORDER = ['hopeful', 'numb', 'heavy', 'scared', 'frustrated'];
const CATEGORY_ORDER = ['vent', 'confession', 'secret', 'unsent-letter', 'gratitude'];

export async function getPulseStats(): Promise<PulseStats> {
  const supabase = createClient();

  // Parallel queries
  const [postsRes, resonancesRes, moodRes, categoryRes, topPostRes, usersRes] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact', head: true }),
    supabase.from('resonances').select('id', { count: 'exact', head: true }),
    supabase.from('posts').select('mood'),
    supabase.from('posts').select('category'),
    supabase.from('posts').select('content, resonance_count, mood, pseudonym').order('resonance_count', { ascending: false }).limit(1).single(),
    supabase.from('posts').select('user_id'),
  ]);

  const totalPosts = postsRes.count ?? 0;
  const totalResonances = resonancesRes.count ?? 0;

  // Mood distribution
  const moodCounts: Record<string, number> = {};
  for (const p of (moodRes.data || [])) {
    moodCounts[p.mood] = (moodCounts[p.mood] || 0) + 1;
  }
  const moodDistribution = MOOD_ORDER.map(mood => ({
    mood,
    count: moodCounts[mood] || 0,
    percentage: totalPosts > 0 ? Math.round(((moodCounts[mood] || 0) / totalPosts) * 100) : 0,
  }));

  // Category distribution
  const catCounts: Record<string, number> = {};
  for (const p of (categoryRes.data || [])) {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  }
  const categoryDistribution = CATEGORY_ORDER.map(cat => ({
    category: cat,
    count: catCounts[cat] || 0,
    percentage: totalPosts > 0 ? Math.round(((catCounts[cat] || 0) / totalPosts) * 100) : 0,
  }));

  // Mood trend: last 7 days bucketed by day
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const { data: trendData } = await supabase
    .from('posts')
    .select('mood, created_at')
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: true });

  const dayMap: Record<string, Record<string, number>> = {};
  for (const p of (trendData || [])) {
    const day = new Date(p.created_at).toLocaleDateString('en-IN', { weekday: 'short' });
    if (!dayMap[day]) dayMap[day] = { numb: 0, heavy: 0, frustrated: 0, scared: 0, hopeful: 0 };
    dayMap[day][p.mood] = (dayMap[day][p.mood] || 0) + 1;
  }
  const moodTrend = Object.entries(dayMap).map(([hour, moods]) => ({ hour, ...moods as any }));

  // Unique users
  const uniqueUsers = new Set((usersRes.data || []).map((p: any) => p.user_id)).size;

  const topPost = topPostRes.data ? {
    content: topPostRes.data.content,
    resonanceCount: topPostRes.data.resonance_count,
    mood: topPostRes.data.mood,
    pseudonym: topPostRes.data.pseudonym,
  } : null;

  return {
    totalPosts,
    totalResonances,
    moodDistribution,
    categoryDistribution,
    moodTrend,
    topPost,
    activeUsers: uniqueUsers,
  };
}
