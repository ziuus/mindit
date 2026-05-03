'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Heart, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOrCreateUser } from '@/lib/anonymity';
import { analyzeSafety, SafetyTier } from '@/lib/safety';
import { addPost } from '@/lib/store';
import CrisisBanner from '@/components/safety/CrisisBanner';
import SafetyModal from '@/components/safety/SafetyModal';

const MOODS = [
  { emoji: '😶', label: 'Numb', value: 'numb' },
  { emoji: '😔', label: 'Heavy', value: 'heavy' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😰', label: 'Scared', value: 'scared' },
  { emoji: '🤍', label: 'Hopeful', value: 'hopeful' },
];

const CATEGORIES = [
  { label: 'Vent', value: 'vent' },
  { label: 'Secret', value: 'secret' },
  { label: 'Confession', value: 'confession' },
  { label: 'Unsent Letter', value: 'unsent-letter' },
  { label: 'Gratitude', value: 'gratitude' },
];

interface PostComposerProps {
  onClose?: () => void;
  fullPage?: boolean;
}

export default function PostComposer({ onClose, fullPage = false }: PostComposerProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [pendingPost, setPendingPost] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (!content.trim() || !selectedMood || !selectedCategory) return;

    const safety = analyzeSafety(content);
    const user = getOrCreateUser();

    const post = {
      id: crypto.randomUUID(),
      pseudonym: user.pseudonym,
      avatarSeed: user.avatarSeed,
      content: content.trim(),
      category: selectedCategory as any,
      mood: selectedMood as any,
      resonanceCount: 0,
      resonatedBy: [],
      safetyTier: safety.tier,
      createdAt: new Date(),
      userId: user.id,
    };

    if (safety.tier === 'crisis') {
      setPendingPost(post);
      setShowSafetyModal(true);
      return;
    }

    addPost(post);

    if (safety.tier === 'watch') {
      setShowCrisisBanner(true);
    }

    setContent('');
    setSelectedMood('');
    setSelectedCategory('');

    if (fullPage) {
      router.push('/feed');
    } else if (onClose) {
      onClose();
    }
  };

  const handleSafetyProceed = () => {
    if (pendingPost) {
      addPost(pendingPost);
      setPendingPost(null);
      setContent('');
      setSelectedMood('');
      setSelectedCategory('');
      setShowSafetyModal(false);
      if (fullPage) {
        router.push('/feed');
      } else if (onClose) {
        onClose();
      }
    }
  };

  const containerStyle = fullPage
    ? {
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        padding: '80px 20px 100px',
      }
    : {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 15, 20, 0.97)',
        backdropFilter: 'blur(20px)',
        zIndex: 100,
        padding: '80px 20px 100px',
        overflowY: 'auto' as const,
      };

  return (
    <>
      <div style={containerStyle}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                fontStyle: 'italic',
                color: '#e8edf2',
                fontWeight: 400,
              }}
            >
              What&apos;s on your mind?
            </h1>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a8b5c4',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <X size={24} />
              </button>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Say what you can't say anywhere else..."
            style={{
              width: '100%',
              minHeight: '200px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e8edf2',
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              lineHeight: 1.7,
              resize: 'vertical' as const,
              marginBottom: '24px',
            }}
          />

          {content.length > 20 && (
            <div style={{
              textAlign: 'right' as const,
              marginBottom: '24px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: content.length > 2000 ? '#e8a0a0' : '#6b7a8d',
              animation: 'fadeUp 0.3s ease forwards',
            }}>
              {content.length} / 3000
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#6b7a8d', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
              How are you feeling?
            </p>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' as const, paddingBottom: '8px' }}>
              {MOODS.map(({ emoji, label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedMood(value)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                    gap: '4px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: `1px solid ${selectedMood === value ? 'rgba(127, 182, 154, 0.3)' : 'var(--border)'}`,
                    background: selectedMood === value ? 'rgba(127, 182, 154, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    minWidth: '80px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{emoji}</span>
                  <span style={{
                    fontSize: '11px',
                    color: selectedMood === value ? '#7fb69a' : '#6b7a8d',
                    fontWeight: selectedMood === value ? 500 : 400,
                  }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ color: '#6b7a8d', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
              Category
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
              {CATEGORIES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedCategory(value)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '20px',
                    border: `1px solid ${selectedCategory === value ? 'rgba(127, 182, 154, 0.3)' : 'var(--border)'}`,
                    background: selectedCategory === value ? 'rgba(127, 182, 154, 0.1)' : 'transparent',
                    color: selectedCategory === value ? '#7fb69a' : '#a8b5c4',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: selectedCategory === value ? 500 : 400,
                    transition: 'all 0.2s ease',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  #{label.toLowerCase().replace(' ', '-')}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || !selectedMood || !selectedCategory}
              className="btn-primary"
              style={{
                flex: 1,
                opacity: !content.trim() || !selectedMood || !selectedCategory ? 0.5 : 1,
                cursor: !content.trim() || !selectedMood || !selectedCategory ? 'not-allowed' : 'pointer',
              }}
            >
              <Heart size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Share this
            </button>
          </div>
        </div>
      </div>

      {showCrisisBanner && (
        <CrisisBanner
          onDismiss={() => setShowCrisisBanner(false)}
          onShowSupport={() => {
            setShowCrisisBanner(false);
            setShowSafetyModal(true);
          }}
        />
      )}

      {showSafetyModal && (
        <SafetyModal
          onClose={() => setShowSafetyModal(false)}
          onProceed={handleSafetyProceed}
        />
      )}
    </>
  );
}
