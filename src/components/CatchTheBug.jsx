import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Play, RotateCcw, Trophy } from 'lucide-react';

/* ─── Pure Game Overlay — no floating button ─── */
export default function CatchTheBug({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bugs, setBugs] = useState([]);
  const [plusOnes, setPlusOnes] = useState([]);

  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const playStateRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('catchBugHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // ESC closes the overlay
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  // Reset game state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      playStateRef.current = false;
      setBugs([]);
      setPlusOnes([]);
      setTimeLeft(30);
      setScore(0);
      clearInterval(timerRef.current);
      clearTimeout(spawnRef.current);
    }
  }, [isOpen]);

  const spawnBug = useCallback(() => {
    if (!playStateRef.current || !gameAreaRef.current) return;
    const container = gameAreaRef.current.getBoundingClientRect();
    const size = 50;
    const maxX = Math.max(10, container.width - size);
    const maxY = Math.max(10, container.height - size);
    const newBug = {
      id: Date.now() + Math.random(),
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      rotation: Math.random() * 360,
    };
    setBugs(prev => [...prev, newBug]);
    setTimeout(() => {
      if (playStateRef.current) setBugs(prev => prev.filter(b => b.id !== newBug.id));
    }, 2000 + Math.random() * 1000);
  }, []);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    playStateRef.current = false;
    setBugs([]);
    clearInterval(timerRef.current);
    clearTimeout(spawnRef.current);
    setScore(prev => {
      if (prev > highScore) {
        setHighScore(prev);
        localStorage.setItem('catchBugHighScore', prev.toString());
      }
      return prev;
    });
  }, [highScore]);

  useEffect(() => {
    if (isPlaying) {
      playStateRef.current = true;
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { endGame(); return 0; }
          return prev - 1;
        });
      }, 1000);
      const scheduleSpawn = () => {
        if (!playStateRef.current) return;
        spawnBug();
        spawnRef.current = setTimeout(scheduleSpawn, 400 + Math.random() * 600);
      };
      scheduleSpawn();
    } else {
      playStateRef.current = false;
      clearInterval(timerRef.current);
      clearTimeout(spawnRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(spawnRef.current);
    };
  }, [isPlaying, spawnBug, endGame]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setBugs([]);
    setPlusOnes([]);
    setIsPlaying(true);
  };

  const handleClose = () => {
    if (isPlaying) endGame();
    onClose();
  };

  const catchBug = (id, x, y) => {
    if (!isPlaying) return;
    setBugs(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
    const poId = Date.now();
    setPlusOnes(prev => [...prev, { id: poId, x, y }]);
    setTimeout(() => setPlusOnes(prev => prev.filter(p => p.id !== poId)), 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,10,15,0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            color: 'var(--text-primary)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-glass)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Bug size={28} color="var(--accent-primary)" />
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Catch the Bug</h2>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>TIME</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: timeLeft <= 10 ? '#ef4444' : 'var(--text-primary)' }}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>SCORE</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{score}</div>
              </div>
              <div style={{ textAlign: 'center', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Trophy size={11} /> BEST
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{highScore}</div>
              </div>
              <button onClick={handleClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}>
                <X size={28} />
              </button>
            </div>
          </div>

          {/* Game Area */}
          <div ref={gameAreaRef} style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', cursor: isPlaying ? 'crosshair' : 'default' }}>

            {/* Start / End Screen */}
            {!isPlaying && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 10 }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '380px' }}>
                  <Bug size={56} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                    {timeLeft === 0 ? "Time's Up!" : 'Ready to squish?'}
                  </h2>
                  {timeLeft === 0 && (
                    <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                      You caught <strong style={{ color: 'var(--accent-primary)' }}>{score}</strong> bugs!
                    </p>
                  )}
                  <button className="btn-primary" onClick={startGame} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', padding: '0.9rem 2rem' }}>
                    {timeLeft === 0 ? <><RotateCcw size={18} /> Play Again</> : <><Play size={18} /> Start Game</>}
                  </button>
                </motion.div>
              </div>
            )}

            {/* Bugs */}
            <AnimatePresence>
              {bugs.map(bug => (
                <motion.button
                  key={bug.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  onMouseDown={() => catchBug(bug.id, bug.x, bug.y)}
                  onTouchStart={() => catchBug(bug.id, bug.x, bug.y)}
                  style={{ position: 'absolute', left: bug.x, top: bug.y, transform: `rotate(${bug.rotation}deg)`, background: 'transparent', border: 'none', cursor: 'crosshair', color: 'var(--accent-secondary)', padding: 0 }}
                >
                  <Bug size={38} style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.8))', animation: 'squirm 0.3s infinite ease-in-out' }} />
                </motion.button>
              ))}
            </AnimatePresence>

            {/* +1 floaters */}
            <AnimatePresence>
              {plusOnes.map(po => (
                <motion.div key={po.id} initial={{ opacity: 1, y: po.y, x: po.x }} animate={{ opacity: 0, y: po.y - 50, x: po.x }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                  style={{ position: 'absolute', color: '#4ade80', fontWeight: 800, fontSize: '1.4rem', pointerEvents: 'none', zIndex: 20 }}>
                  +1
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      <style>{`@keyframes squirm { 0%{transform:rotate(-10deg) scale(0.9)} 50%{transform:rotate(10deg) scale(1.1)} 100%{transform:rotate(-10deg) scale(0.9)} }`}</style>
    </AnimatePresence>
  );
}
