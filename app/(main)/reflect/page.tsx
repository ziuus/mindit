'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

const PROMPTS = [
  "What's weighing on you today?",
  "What do you wish someone would ask you?",
  "What are you pretending is okay?",
  "What would you tell yourself from a year ago?",
  "What are you holding back?",
  "What does your heart need right now?",
];

const AI_RESPONSES = [
  "Thank you for sharing that. What do you think is the first small step toward what you need?",
  "I hear you. Sometimes just naming what we feel creates space for healing. Want to explore that more?",
  "That sounds really heavy. What would it look like to be gentle with yourself about this?",
  "Your feelings are valid. When did you first start feeling this way?",
  "I'm glad you expressed this. What would offer you comfort right now?",
];

interface Reflection {
  id: string;
  content: string;
  aiResponse: string;
  createdAt: Date;
}

export default function ReflectPage() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [content, setContent] = useState('');
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mindit_reflections');
    if (stored) {
      setReflections(JSON.parse(stored).map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
      })));
    }

    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % PROMPTS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textareaRef.current && !submitted) {
      textareaRef.current.focus();
    }
  }, [submitted]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    const reflection: Reflection = {
      id: crypto.randomUUID(),
      content: content.trim(),
      aiResponse: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
      createdAt: new Date(),
    };

    const updated = [reflection, ...reflections];
    setReflections(updated);
    localStorage.setItem('mindit_reflections', JSON.stringify(updated));

    setContent('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      padding: '20px',
      minHeight: 'calc(100vh - 160px)',
    }}>
      {/* Prompt */}
      <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentPrompt}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              color: '#e8edf2',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            {PROMPTS[currentPrompt]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Textarea */}
      <div style={{ marginBottom: '24px' }}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reflection here..."
          style={{
            width: '100%',
            minHeight: '200px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            color: '#e8edf2',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            lineHeight: 1.7,
            outline: 'none',
            resize: 'vertical' as const,
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(127, 182, 154, 0.3)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: content.length > 2000 ? '#e8a0a0' : '#6b7a8d',
          }}>
            {content.length} / 3000
          </span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="btn-primary"
            style={{
              opacity: !content.trim() ? 0.5 : 1,
              cursor: !content.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            <Send size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Reflect
          </button>
        </div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: '12px',
              padding: '12px 16px',
              background: 'rgba(127, 182, 154, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(127, 182, 154, 0.2)',
            }}
          >
            <p style={{ color: '#7fb69a', fontSize: '14px' }}>
              ✓ Reflection saved
            </p>
          </motion.div>
        )}
      </div>

      {/* Past reflections */}
      {reflections.length > 0 && (
        <div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '18px',
            color: '#e8edf2',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            Past Reflections
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reflections.map((reflection) => (
              <div
                key={reflection.id}
                style={{
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <p style={{
                  color: '#a8b5c4',
                  fontSize: '13px',
                  marginBottom: '12px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {reflection.createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#e8edf2',
                  marginBottom: '16px',
                }}>
                  {reflection.content}
                </p>
                <div style={{
                  background: 'rgba(127, 182, 154, 0.05)',
                  borderLeft: '2px solid rgba(127, 182, 154, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '0 12px 12px 0',
                }}>
                  <p style={{
                    color: '#7fb69a',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                  }}>
                    {reflection.aiResponse}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
