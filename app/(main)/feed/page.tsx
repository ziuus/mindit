'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Hash, TrendingUp, Clock } from 'lucide-react';
import { getPosts, getTrendingPosts } from '@/lib/store';
import { getOrCreateUser } from '@/lib/anonymity';
import PostCard from '@/components/post/PostCard';
import PostComposer from '@/components/post/PostComposer';
import DailyPrompt from '@/components/feed/DailyPrompt';
import ResonanceNotification from '@/components/feed/ResonanceNotification';

const CATEGORIES = ['all', 'vent', 'secret', 'confession', 'unsent-letter', 'gratitude'];
const MOODS = ['all', 'numb', 'heavy', 'frustrated', 'scared', 'hopeful'];
const MOOD_EMOJIS: Record<string, string> = {
  all: '✨', numb: '😶', heavy: '😔', frustrated: '😤', scared: '😰', hopeful: '🤍',
};

type SortMode = 'recent' | 'trending';

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [showComposer, setShowComposer] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getOrCreateUser());
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let data;
      if (sortMode === 'trending') {
        data = await getTrendingPosts();
        // Apply client-side filters on top of trending
        if (selectedCategory !== 'all') data = data.filter((p: any) => p.category === selectedCategory);
        if (selectedMood !== 'all') data = data.filter((p: any) => p.mood === selectedMood);
      } else {
        data = await getPosts({ category: selectedCategory, mood: selectedMood });
      }
      setPosts(data);
      setLoading(false);
    };
    load();
  }, [selectedCategory, selectedMood, sortMode]);

  const handlePostAdded = async () => {
    const data = await getPosts({ category: selectedCategory, mood: selectedMood });
    setPosts(data);
    setShowComposer(false);
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px' }}>

      {/* Daily Prompt */}
      <DailyPrompt />

      {/* Sort toggle */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        background: 'var(--bg-glass)',
        borderRadius: '12px',
        padding: '4px',
        border: '1px solid var(--border)',
        width: 'fit-content',
      }}>
        {([['recent', 'Recent', Clock], ['trending', 'Trending', TrendingUp]] as const).map(([mode, label, Icon]) => (
          <button
            key={mode}
            onClick={() => setSortMode(mode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '9px',
              border: 'none',
              background: sortMode === mode ? 'rgba(127, 182, 154, 0.15)' : 'transparent',
              color: sortMode === mode ? '#7fb69a' : '#6b7a8d',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: sortMode === mode ? 600 : 400,
              transition: 'all 0.2s ease',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '12px',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: `1px solid ${selectedCategory === cat ? 'rgba(127, 182, 154, 0.3)' : 'var(--border)'}`,
                background: selectedCategory === cat ? 'rgba(127, 182, 154, 0.1)' : 'transparent',
                color: selectedCategory === cat ? '#7fb69a' : '#6b7a8d',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: selectedCategory === cat ? 500 : 400,
                whiteSpace: 'nowrap' as const,
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Hash size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {cat}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none',
        }}>
          {MOODS.map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: `1px solid ${selectedMood === mood ? 'rgba(127, 182, 154, 0.3)' : 'var(--border)'}`,
                background: selectedMood === mood ? 'rgba(127, 182, 154, 0.1)' : 'transparent',
                color: selectedMood === mood ? '#7fb69a' : '#6b7a8d',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: selectedMood === mood ? 500 : 400,
                whiteSpace: 'nowrap' as const,
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span style={{ marginRight: '4px' }}>{MOOD_EMOJIS[mood]}</span>
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Trending label */}
      {sortMode === 'trending' && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: '#6b7a8d',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '16px',
            letterSpacing: '0.5px',
          }}
        >
          🔥 Most resonated in the last 48 hours
        </motion.p>
      )}

      {/* Posts */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              className="glass"
              style={{ height: '160px', width: '100%' }}
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', animation: 'breathe 4s ease-in-out infinite' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '20px',
            color: '#a8b5c4',
            marginBottom: '8px',
          }}>
            {sortMode === 'trending' ? 'Nothing trending yet.' : 'Be the first to speak.'}
          </p>
          <p style={{ color: '#6b7a8d', fontSize: '14px' }}>
            Your words might help someone else feel less alone.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <PostCard post={post} currentUserId={user.id} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Write FAB */}
      <button
        onClick={() => setShowComposer(true)}
        style={{
          position: 'fixed',
          bottom: '96px',
          right: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#7fb69a',
          color: '#0a0f14',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(127, 182, 154, 0.3)',
          transition: 'all 0.2s ease',
          zIndex: 30,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(127, 182, 154, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(127, 182, 154, 0.3)';
        }}
        className="md:flex hidden"
      >
        <PenLine size={24} />
      </button>

      {/* Resonance notification toast */}
      <ResonanceNotification />

      {showComposer && (
        <PostComposer onClose={handlePostAdded} />
      )}
    </div>
  );
}
