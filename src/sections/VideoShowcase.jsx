import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { Play, Pause, Maximize2, X, Volume2, VolumeX } from 'lucide-react';
import useMediaQuery from '../hooks/useMediaQuery';

/* ── Scene data pulled from portfolio ── */
function buildScenes() {
  const d = portfolioData;
  const skillsList = Object.values(d.skills).flat();
  const certCount = d.certifications?.length || 0;

  return [
    {
      id: 'intro',
      label: 'INTRO',
      title: d.hero.name,
      subtitle: d.hero.title,
      body: 'A passionate developer building the future, one line of code at a time.',
      accent: '#6366f1',
      particles: true,
    },
    {
      id: 'education',
      label: 'EDUCATION',
      title: 'Academic Journey',
      subtitle: `${d.education.length} milestones`,
      body: d.education.map(e => `${e.degree}`).join('  →  '),
      accent: '#8b5cf6',
    },
    {
      id: 'skills',
      label: 'SKILLS',
      title: 'Technical Arsenal',
      subtitle: `${skillsList.length}+ technologies`,
      body: skillsList.slice(0, 18).join('  •  '),
      accent: '#38bdf8',
      particles: true,
    },
    {
      id: 'certifications',
      label: 'CERTIFICATIONS',
      title: 'Certified Expertise',
      subtitle: `${certCount} professional credentials`,
      body: d.certifications.slice(0, 5).map(c => c.title).join('  •  '),
      accent: '#f59e0b',
    },
    {
      id: 'experience',
      label: 'EXPERIENCE',
      title: 'Professional Growth',
      subtitle: `${d.experience.length} career milestones`,
      body: d.experience.map(e => `${e.role} @ ${e.company.split(',')[0]}`).join('  →  '),
      accent: '#4ade80',
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      title: 'Built & Shipped',
      subtitle: `${d.projects.length} applications`,
      body: d.projects.map(p => p.title).join('  •  '),
      accent: '#ec4899',
    },
    {
      id: 'extracurricular',
      label: 'LEADERSHIP',
      title: 'Beyond the Code',
      subtitle: 'Leadership · Service · Sport',
      body: d.extracurricular.slice(0, 4).join('  •  '),
      accent: '#14b8a6',
      particles: true,
    },
    {
      id: 'interests',
      label: 'PERSONAL',
      title: 'Passions & Interests',
      subtitle: 'The human behind the developer',
      body: d.interests.join('  '),
      accent: '#a78bfa',
    },
    {
      id: 'closing',
      label: 'FINALE',
      title: 'Building Solutions',
      subtitle: 'Exploring Possibilities',
      body: '"Building solutions, exploring possibilities, and continuously evolving."',
      accent: '#6366f1',
      particles: true,
      isClosing: true,
    },
  ];
}

/* ── Particle canvas ── */
function ParticleCanvas({ accent, active }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      a: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.a;
        ctx.fill();
      });
      ctx.globalAlpha = 0.08;
      pts.forEach((a, i) => {
        pts.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = accent;
            ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, accent]);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

/* ── Scene component ── */
function Scene({ scene, active }) {
  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          key={scene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '2rem',
            zIndex: 1,
          }}
        >
          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: '0.7rem', letterSpacing: '0.25em', fontWeight: 700,
              color: scene.accent, marginBottom: '1rem',
              background: `${scene.accent}15`, padding: '0.3rem 1rem',
              borderRadius: '999px', border: `1px solid ${scene.accent}30`,
            }}
          >
            {scene.label}
          </motion.span>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.7, type: 'spring', stiffness: 120 }}
            style={{
              fontSize: scene.isClosing ? 'clamp(1.8rem, 5vw, 3.5rem)' : 'clamp(1.6rem, 4vw, 3rem)',
              fontWeight: 800, margin: 0, lineHeight: 1.1,
              background: `linear-gradient(135deg, ${scene.accent}, #fff)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {scene.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '0.75rem', fontWeight: 500,
            }}
          >
            {scene.subtitle}
          </motion.p>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              width: '80px', height: '2px',
              background: scene.accent,
              margin: '1.25rem 0',
              transformOrigin: 'center',
            }}
          />

          {/* Body */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '650px', lineHeight: 1.7,
              fontStyle: scene.isClosing ? 'italic' : 'normal',
            }}
          >
            {scene.body}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main Section ── */
export default function VideoShowcase({ embedded = false }) {
  const scenes = useRef(buildScenes()).current;
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const SCENE_DURATION = 4500; // ms per scene

  const play = useCallback(() => {
    setIsPlaying(true);
    setHasStarted(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
  }, []);

  const togglePlay = () => (isPlaying ? pause() : play());

  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => {
        if (prev >= scenes.length - 1) { pause(); return prev; }
        return prev + 1;
      });
    }, SCENE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, scenes.length, pause]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ESC to exit fullscreen pause
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isFullscreen) { pause(); }
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isPlaying, isFullscreen]);

  const scene = scenes[current];
  const progress = ((current + 1) / scenes.length) * 100;

  return (
    <section style={{ padding: embedded ? '0' : (isMobile ? '3rem 1rem' : '5rem 2rem') }}>
      {/* Heading — hidden when embedded */}
      {!embedded && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <h2 className="gradient-text" style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem',
        }}>
          My Journey in Motion
        </h2>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '550px', margin: '0 auto',
        }}>
          A cinematic glimpse into my story — from code to community.
        </p>
      </motion.div>
      )}

      {/* Player */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '960px',
          aspectRatio: '16 / 9',
          margin: '0 auto',
          borderRadius: isFullscreen ? 0 : '20px',
          overflow: 'hidden',
          background: '#08080e',
          border: isFullscreen ? 'none' : '1px solid var(--border-color)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Scene background gradient */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `radial-gradient(ellipse at center, ${scene.accent}12 0%, transparent 70%)`,
          transition: 'background 0.8s ease',
        }} />

        {/* Particles */}
        {scene.particles && <ParticleCanvas accent={scene.accent} active={isPlaying || hasStarted} />}

        {/* Active scene */}
        <Scene scene={scene} active={true} />

        {/* Pre-play poster */}
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(8,8,14,0.85)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
            }}
            onClick={play}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px var(--accent-glow)',
              }}
            >
              <Play size={32} color="#fff" style={{ marginLeft: '4px' }} />
            </motion.div>
            <p style={{
              color: 'rgba(255,255,255,0.6)', marginTop: '1.25rem',
              fontSize: '0.9rem', letterSpacing: '0.05em',
            }}>
              Click to play
            </p>
          </motion.div>
        )}

        {/* ── Controls bar ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 20, padding: '0 1rem 0.75rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        }}>
          {/* Progress bar */}
          <div
            style={{
              width: '100%', height: '4px', borderRadius: '2px',
              background: 'rgba(255,255,255,0.15)',
              marginBottom: '0.6rem', cursor: 'pointer',
              overflow: 'hidden',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const idx = Math.round(pct * (scenes.length - 1));
              setCurrent(idx);
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              style={{
                height: '100%', borderRadius: '2px',
                background: `linear-gradient(to right, ${scene.accent}, var(--accent-secondary))`,
              }}
            />
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {/* Left controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={togglePlay} style={ctrlBtn}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>
              <span style={{
                color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.05em',
              }}>
                {current + 1} / {scenes.length}
              </span>
            </div>

            {/* Scene dots */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {scenes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(i)}
                  aria-label={`Scene ${i + 1}`}
                  style={{
                    width: i === current ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '999px',
                    border: 'none',
                    background: i === current ? scene.accent : 'rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Right controls */}
            <button onClick={toggleFullscreen} style={ctrlBtn}>
              {isFullscreen ? <X size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

const ctrlBtn = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: '#fff',
  width: '34px', height: '34px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 0.2s',
};
