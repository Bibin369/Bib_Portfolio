import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Film, Clapperboard, ArrowRight, Sparkles } from 'lucide-react';
import JourneyMovie from './JourneyMovie';
import useMediaQuery from '../hooks/useMediaQuery';

export default function JourneyHub({ isOpen, onClose }) {
  const [activeView, setActiveView] = useState(null); // null = hub, 'video' = movie
  const [movieOpen, setMovieOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 640px)');

  // ESC close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { if (activeView) setActiveView(null); else onClose(); } };
    if (isOpen) { document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, onClose, activeView]);

  // Reset on close
  useEffect(() => { if (!isOpen) setActiveView(null); }, [isOpen]);

  const handleStoryMode = () => {
    onClose();
    navigate('/story');
  };

  const experiences = [
    {
      id: 'story',
      icon: <Clapperboard size={28} />,
      title: 'Story Mode',
      subtitle: 'Cinematic Storytelling',
      description: 'An immersive, scroll-driven cinematic experience covering my education, skills, work, certifications, and personal growth.',
      accent: '#8b5cf6',
      tags: ['Cinematic', 'Interactive', 'Full-Screen'],
      action: handleStoryMode,
    },
    {
      id: 'video',
      icon: <Film size={28} />,
      title: 'Journey Video',
      subtitle: 'Animated Showcase',
      description: 'A motion-graphics reel highlighting my technical skills, projects, achievements, and extra-curricular leadership — all in one cinematic trailer.',
      accent: '#6366f1',
      tags: ['Animated', 'Auto-Play', 'Developer Reel'],
      action: () => { onClose(); setMovieOpen(true); },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0,
            zIndex: 9999,
            background: 'rgba(4,4,10,0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          {/* Close */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => { if (activeView) setActiveView(null); else onClose(); }}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px', color: '#fff',
              width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            {activeView ? <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /> : <X size={20} />}
          </motion.button>

          <AnimatePresence mode="wait">
            {/* ── Hub View ── */}
            {!activeView && (
              <motion.div
                key="hub"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%', maxWidth: '820px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', textAlign: 'center',
                }}
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ marginBottom: '2.5rem' }}
                >
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                    borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '1rem',
                    fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600,
                    letterSpacing: '0.1em',
                  }}>
                    <Sparkles size={13} /> JOURNEY EXPERIENCE HUB
                  </div>
                  <h2 style={{
                    fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 800,
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #38bdf8)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', margin: '0 0 0.75rem',
                  }}>
                    Explore My Journey
                  </h2>
                  <p style={{
                    color: 'rgba(255,255,255,0.5)', fontSize: '1rem',
                    maxWidth: '480px', margin: '0 auto', lineHeight: 1.6,
                  }}>
                    Choose how you'd like to experience my professional and personal story.
                  </p>
                </motion.div>

                {/* Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: '1.5rem', width: '100%',
                }}>
                  {experiences.map((exp, i) => (
                    <motion.button
                      key={exp.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.12, type: 'spring', stiffness: 200, damping: 24 }}
                      whileHover={{ y: -6, boxShadow: `0 20px 50px ${exp.accent}25` }}
                      whileTap={{ scale: 0.98 }}
                      onClick={exp.action}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px',
                        padding: isMobile ? '1.75rem 1.25rem' : '2rem 1.75rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column',
                        gap: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'border-color 0.3s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${exp.accent}50`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    >
                      {/* Glow */}
                      <div style={{
                        position: 'absolute', top: '-30px', right: '-30px',
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: exp.accent, opacity: 0.06,
                        filter: 'blur(40px)', pointerEvents: 'none',
                      }} />

                      {/* Icon */}
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: `${exp.accent}15`,
                        border: `1.5px solid ${exp.accent}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: exp.accent,
                      }}>
                        {exp.icon}
                      </div>

                      {/* Text */}
                      <div>
                        <h3 style={{
                          fontSize: '1.25rem', fontWeight: 700, color: '#fff',
                          margin: '0 0 0.2rem',
                        }}>
                          {exp.title}
                        </h3>
                        <span style={{
                          fontSize: '0.8rem', color: exp.accent, fontWeight: 600,
                        }}>
                          {exp.subtitle}
                        </span>
                      </div>

                      <p style={{
                        fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)',
                        lineHeight: 1.6, margin: 0, flexGrow: 1,
                      }}>
                        {exp.description}
                      </p>

                      {/* Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {exp.tags.map(tag => (
                          <span key={tag} style={{
                            fontSize: '0.7rem', padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            background: `${exp.accent}12`,
                            border: `1px solid ${exp.accent}25`,
                            color: exp.accent, fontWeight: 500,
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        color: exp.accent, fontSize: '0.85rem', fontWeight: 600,
                        marginTop: '0.25rem',
                      }}>
                        Launch Experience <ArrowRight size={16} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      )}
      <JourneyMovie isOpen={movieOpen} onClose={() => setMovieOpen(false)} />
    </AnimatePresence>
  );
}
