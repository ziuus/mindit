'use client';

import { useEffect, useState } from 'react';
import { getOrCreateUser, getAvatarUrl } from '@/lib/anonymity';
import { getUserPosts } from '@/lib/store';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const u = getOrCreateUser();
    setUser(u);
    setPosts(getUserPosts(u.id));
  }, []);

  const moodData = posts.reduce((acc: any, post) => {
    acc[post.mood] = (acc[post.mood] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(moodData).map(([name, value]) => ({ name, value: Number(value) }));

  const MOOD_COLORS: Record<string, string> = {
    numb: '#6b7a8d',
    heavy: '#e8a0a0',
    frustrated: '#d4a96a',
    scared: '#9b8ec4',
    hopeful: '#7fb69a',
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px' }}>
      {/* User header */}
      <div style={{
        textAlign: 'center',
        padding: '32px 20px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto 16px',
          border: '3px solid rgba(127, 182, 154, 0.3)',
        }}>
          <img
            src={getAvatarUrl(user.avatarSeed)}
            width={100}
            height={100}
            alt="avatar"
            style={{ display: 'block' }}
          />
        </div>
        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '20px',
          color: '#e8edf2',
          fontWeight: 500,
          marginBottom: '4px',
        }}>
          {user.pseudonym}
        </h1>
        <p style={{ color: '#6b7a8d', fontSize: '13px', marginBottom: '16px' }}>
          Your Mindit identity
        </p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <div>
            <p style={{ color: '#7fb69a', fontSize: '24px', fontWeight: 600 }}>{posts.length}</p>
            <p style={{ color: '#6b7a8d', fontSize: '12px' }}>Posts</p>
          </div>
          <div>
            <p style={{ color: '#7fb69a', fontSize: '24px', fontWeight: 600 }}>
              {posts.reduce((sum: number, p: any) => sum + p.resonanceCount, 0)}
            </p>
            <p style={{ color: '#6b7a8d', fontSize: '12px' }}>Resonances</p>
          </div>
        </div>
      </div>

      {/* Mood distribution */}
      {chartData.length > 0 && (
        <div style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '18px',
            color: '#e8edf2',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            Mood Distribution
          </h2>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name] || '#6b7a8d'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '12px',
          }}>
            {chartData.map(({ name, value }) => (
              <div key={name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: MOOD_COLORS[name] || '#6b7a8d',
                  display: 'inline-block',
                }} />
                <span style={{ color: '#a8b5c4', fontSize: '12px' }}>
                  {name} ({Number(value)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User posts */}
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '18px',
        color: '#e8edf2',
        marginBottom: '16px',
        fontWeight: 600,
      }}>
        Your Posts
      </h2>

      {posts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          background: 'var(--bg-glass)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
        }}>
          <p style={{ color: '#a8b5c4', fontSize: '14px', marginBottom: '8px' }}>
            Your vault is empty
          </p>
          <Link
            href="/compose"
            style={{
              color: '#7fb69a',
              fontSize: '13px',
              textDecoration: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Write your first thought →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>
                  {post.mood === 'numb' ? '😶' : post.mood === 'heavy' ? '😔' : post.mood === 'frustrated' ? '😤' : post.mood === 'scared' ? '😰' : '🤍'}
                </span>
                <span style={{ color: '#6b7a8d', fontSize: '12px' }}>
                  {timeAgo(post.createdAt)}
                </span>
              </div>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#e8edf2',
                marginBottom: '12px',
              }}>
                {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  fontSize: '12px',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: 'rgba(127, 182, 154, 0.1)',
                  color: '#7fb69a',
                }}>
                  #{post.category}
                </span>
                <span style={{ color: '#6b7a8d', fontSize: '12px' }}>
                  {post.resonanceCount} resonances
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
