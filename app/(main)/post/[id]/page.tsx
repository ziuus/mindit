'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { getPost, toggleResonance } from '@/lib/store';
import { getOrCreateUser, getAvatarUrl } from '@/lib/anonymity';
import { timeAgo } from '@/lib/utils';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [hasResonated, setHasResonated] = useState(false);

  useEffect(() => {
    setUser(getOrCreateUser());
    const found = getPost(params.id as string);
    if (found) {
      setPost(found);
      setHasResonated(found.resonatedBy.includes(getOrCreateUser().id));
    }
  }, [params.id]);

  const handleResonance = () => {
    const result = toggleResonance(params.id as string, user.id);
    if (result) {
      setPost(result);
      setHasResonated(result.resonatedBy.includes(user.id));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!post || !user) {
    return (
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center',
        color: '#6b7a8d',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px' }}>
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#a8b5c4',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '24px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <img
            src={getAvatarUrl(post.avatarSeed)}
            width={44}
            height={44}
            style={{ borderRadius: '50%' }}
            alt="avatar"
          />
          <div style={{ flex: 1 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              color: '#a8b5c4',
              fontWeight: 500,
            }}>
              {post.pseudonym}
            </span>
            <span style={{ color: '#6b7a8d', fontSize: '12px', marginLeft: '8px' }}>
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>

        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '18px',
          lineHeight: 1.8,
          color: '#e8edf2',
          marginBottom: '24px',
          fontWeight: 400,
        }}>
          {post.content}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleResonance}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: hasResonated ? '1px solid rgba(127, 182, 154, 0.3)' : '1px solid var(--border)',
              background: hasResonated ? 'rgba(127, 182, 154, 0.1)' : 'transparent',
              color: hasResonated ? '#7fb69a' : '#a8b5c4',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
          >
            <Heart size={16} fill={hasResonated ? '#7fb69a' : 'none'} />
            <span>{post.resonanceCount}</span>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>I felt this too</span>
          </button>

          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: '#a8b5c4',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
