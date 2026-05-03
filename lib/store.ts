import { createClient } from '@/utils/supabase/client';

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

const supabase = createClient();

export async function getPosts(filter?: { category?: string; mood?: string }): Promise<Post[]> {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter?.category && filter.category !== 'all') {
    query = query.eq('category', filter.category);
  }
  if (filter?.mood && filter.mood !== 'all') {
    query = query.eq('mood', filter.mood);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return (data || []).map(mapDbPostToPost);
}

export async function getPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapDbPostToPost(data);
}

export async function addPost(post: Omit<Post, 'id' | 'createdAt' | 'resonanceCount' | 'resonatedBy'>): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      user_id: post.userId,
      pseudonym: post.pseudonym,
      avatar_seed: post.avatarSeed,
      content: post.content,
      category: post.category,
      mood: post.mood,
      safety_tier: post.safetyTier,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding post:', error);
    return null;
  }

  return mapDbPostToPost(data);
}

export async function toggleResonance(postId: string, userId: string): Promise<boolean> {
  // Check if resonance exists
  const { data: existing } = await supabase
    .from('resonances')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Remove resonance
    await supabase.from('resonances').delete().eq('id', existing.id);
    await supabase.rpc('decrement_resonance', { post_id: postId });
    return false;
  } else {
    // Add resonance
    await supabase.from('resonances').insert([{ post_id: postId, user_id: userId }]);
    await supabase.rpc('increment_resonance', { post_id: postId });
    return true;
  }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map(mapDbPostToPost);
}

function mapDbPostToPost(dbPost: any): Post {
  return {
    id: dbPost.id,
    userId: dbPost.user_id,
    pseudonym: dbPost.pseudonym,
    avatarSeed: dbPost.avatar_seed,
    content: dbPost.content,
    category: dbPost.category,
    mood: dbPost.mood,
    resonanceCount: dbPost.resonance_count || 0,
    resonatedBy: [],
    safetyTier: dbPost.safety_tier,
    createdAt: new Date(dbPost.created_at),
  };
}
