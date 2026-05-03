'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Trash2, Check, Lock, AlertTriangle } from 'lucide-react';
import { getFlaggedPosts, deletePost, type Post } from '@/lib/store';
import { timeAgo } from '@/lib/utils';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // Check if auth token is in localStorage
    if (localStorage.getItem('mindit_admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchPosts();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side auth for MVP admin
    if (password === 'mindit_admin_2026') {
      localStorage.setItem('mindit_admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
      fetchPosts();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    const flagged = await getFlaggedPosts();
    setPosts(flagged);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    // In a real app, we'd update safety_tier to 'safe'. 
    // Since we don't have an update method yet, we just remove it from view locally for the MVP.
    setTimeout(() => {
      setPosts(prev => prev.filter(p => p.id !== id));
      setProcessingId(null);
    }, 600);
  };

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    const success = await deletePost(id);
    if (success) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
    setProcessingId(null);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.form 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin}
          style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '360px', textAlign: 'center' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(232, 160, 160, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Lock size={20} color="#e8a0a0" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#e8edf2', marginBottom: '8px' }}>Moderation</h1>
          <p style={{ color: '#6b7a8d', fontSize: '13px', marginBottom: '24px', fontFamily: "'Inter', sans-serif" }}>Restricted access.</p>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passcode"
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${error ? '#e8a0a0' : 'var(--border)'}`, borderRadius: '12px', padding: '12px 16px', color: '#e8edf2', fontSize: '14px', outline: 'none', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px' }}>
            Enter
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#e8edf2', marginBottom: '8px' }}>
            Safety Queue
          </h1>
          <p style={{ color: '#6b7a8d', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
            Posts flagged as 'hold' or 'crisis' by the AI pipeline.
          </p>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('mindit_admin_auth'); setIsAuthenticated(false); }}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: '#a8b5c4', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3].map(i => <div key={i} className="glass" style={{ height: '140px', borderRadius: '16px', opacity: 0.3, animation: 'breathe 2s infinite' }} />)}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'var(--bg-glass)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
          <Check size={32} color="#7fb69a" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#e8edf2', fontSize: '16px', fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>Queue is empty</p>
          <p style={{ color: '#6b7a8d', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>No posts require moderation right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden', padding: 0, margin: 0 }}
                style={{
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border)',
                  borderLeft: `4px solid ${post.safetyTier === 'crisis' ? '#e8a0a0' : '#d4a96a'}`,
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: post.safetyTier === 'crisis' ? 'rgba(232, 160, 160, 0.1)' : 'rgba(212, 169, 106, 0.1)',
                      color: post.safetyTier === 'crisis' ? '#e8a0a0' : '#d4a96a',
                      padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                      marginBottom: '12px'
                    }}>
                      {post.safetyTier === 'crisis' ? <ShieldAlert size={12} /> : <AlertTriangle size={12} />}
                      {post.safetyTier}
                    </span>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#e8edf2', lineHeight: 1.6, marginBottom: '8px' }}>
                      {post.content}
                    </p>
                    <p style={{ color: '#6b7a8d', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                      by {post.pseudonym} · {timeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <button
                    onClick={() => handleApprove(post.id)}
                    disabled={processingId === post.id}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px',
                      background: 'rgba(127, 182, 154, 0.1)', color: '#7fb69a', border: '1px solid rgba(127, 182, 154, 0.3)',
                      cursor: processingId === post.id ? 'wait' : 'pointer', fontSize: '13px', fontWeight: 500,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <Check size={14} />
                    Approve (Safe)
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={processingId === post.id}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px',
                      background: 'rgba(232, 160, 160, 0.1)', color: '#e8a0a0', border: '1px solid rgba(232, 160, 160, 0.3)',
                      cursor: processingId === post.id ? 'wait' : 'pointer', fontSize: '13px', fontWeight: 500,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <Trash2 size={14} />
                    Remove Post
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
