'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Hash, Heart } from 'lucide-react';
import { getPosts } from '@/lib/store';
import { getOrCreateUser } from '@/lib/anonymity';
import PostCard from '@/components/post/PostCard';
import PostComposer from '@/components/post/PostComposer';

const CATEGORIES = ['all', 'vent', 'secret', 'confession', 'unsent-letter', 'gratitude'];
const MOODS = ['all', 'numb', 'heavy', 'frustrated', 'scared', 'hopeful'];

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [showComposer, setShowComposer] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getOrCreateUser());
    setPosts(getPosts());
  }, []);

  useEffect(() => {
    setPosts(getPosts({
      category: selectedCategory,
      mood: selectedMood,
    }));
  }, [selectedCategory, selectedMood]);

  const handlePostAdded = () => {
    setPosts(getPosts({
      category: selectedCategory,
      mood: selectedMood,
    }));
    setShowComposer(false);
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px' }}>
      {/* Filter bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '12px',
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
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            animation: 'breathe 4s ease-in-out infinite',
          }}
        >
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '20px',
            color: '#a8b5c4',
            marginBottom: '8px',
          }}>
            Be the first to speak.
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
              transition={{ duration: 0.4, delay: index * 0.08 }}
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

      {showComposer && (
        <PostComposer onClose={() => setShowComposer(false)} />
      )}
    </div>
  );
}
