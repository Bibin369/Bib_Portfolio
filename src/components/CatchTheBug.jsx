import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Play, Trophy, RotateCcw } from 'lucide-react';

export default function CatchTheBug() {
  const [isOpen, setIsOpen] = useState(false);
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

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('catchBugHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnBug = useCallback(() => {
    if (!playStateRef.current || !gameAreaRef.current) return;
    
    // Bounds checking
    const container = gameAreaRef.current.getBoundingClientRect();
    const size = 50; // Bug size padded
    const maxX = Math.max(10, container.width - size);
    const maxY = Math.max(10, container.height - size);
    
    const newBug = {
      id: Date.now() + Math.random(),
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      rotation: Math.random() * 360,
    };

    setBugs(prev => [...prev, newBug]);
    
    // Remove the bug automatically after a set time if not clicked
    setTimeout(() => {
      if (playStateRef.current) {
        setBugs(prev => prev.filter(b => b.id !== newBug.id));
      }
    }, 2000 + Math.random() * 1000); // 2s - 3s lifespan
  }, []);

  useEffect(() => {
    if (isPlaying) {
      playStateRef.current = true;
      // Start Timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Recursive spawner
      const scheduleSpawn = () => {
        if (!playStateRef.current) return;
        spawnBug();
        // Difficulty scaling (spawns faster as time left drops)
        const currentSpeed = 400 + Math.random() * 600; // Base speed
        spawnRef.current = setTimeout(scheduleSpawn, currentSpeed);
      };
      
      scheduleSpawn();
    } else {
      playStateRef.current = false;
      clearInterval(timerRef.current);
      clearTimeout(spawnRef.current);
    }

    return () => {
      playStateRef.current = false;
      clearInterval(timerRef.current);
      clearTimeout(spawnRef.current);
    };
  }, [isPlaying, spawnBug]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setBugs([]);
    setPlusOnes([]);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    playStateRef.current = false;
    setBugs([]);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('catchBugHighScore', score.toString());
    }
  };

  const handleClose = () => {
    if (isPlaying) endGame();
    setIsOpen(false);
  };

  const catchBug = (id, x, y) => {
    if (!isPlaying) return;
    setBugs(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
    
    const poId = Date.now();
    setPlusOnes(prev => [...prev, { id: poId, x, y }]);
    
    // Remove +1 text after animation
    setTimeout(() => {
      setPlusOnes(prev => prev.filter(p => p.id !== poId));
    }, 800);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Play a quick game!"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '2rem',
            zIndex: 999,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px var(--accent-glow)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Bug size={28} />
        </motion.button>
      )}

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 10, 15, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              color: 'var(--text-primary)'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 2rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-glass)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Bug size={30} color="var(--accent-primary)" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Catch the Bug</h2>
              </div>
              
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TIME</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: timeLeft <= 10 ? '#ef4444' : 'var(--text-primary)' }}>
                    00:{timeLeft.toString().padStart(2, '0')}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SCORE</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {score}
                  </div>
                </div>

                <div style={{ textAlign: 'center', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Trophy size={12}/> HIGH SCORE</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    {highScore}
                  </div>
                </div>

                <button 
                  onClick={handleClose} 
                  style={{ background: 'transparent', color: 'var(--text-secondary)', marginLeft: '1rem', cursor: 'pointer', border: 'none' }}
                >
                  <X size={32} />
                </button>
              </div>
            </div>

            {/* Game Area */}
            <div 
              ref={gameAreaRef}
              style={{
                flexGrow: 1,
                position: 'relative',
                overflow: 'hidden',
                cursor: isPlaying ? 'crosshair' : 'default',
              }}
            >
              {/* Start/End Screen */}
              {!isPlaying && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 10
                }}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel"
                    style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px' }}
                  >
                     <Bug size={60} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                     <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                       {timeLeft === 0 ? "Time's Up!" : "Ready to squish?"}
                     </h2>
                     {timeLeft === 0 && (
                       <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                         You caught <strong style={{ color: 'var(--accent-primary)' }}>{score}</strong> bugs!
                       </p>
                     )}
                     
                     <button 
                       className="btn-primary" 
                       onClick={startGame}
                       style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', padding: '1rem 2rem' }}
                     >
                       {timeLeft === 0 ? <><RotateCcw size={20}/> Play Again</> : <><Play size={20}/> Start Game</>}
                     </button>
                  </motion.div>
                </div>
              )}

              {/* Live Bugs */}
              <AnimatePresence>
                {bugs.map((bug) => (
                  <motion.button
                    key={bug.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    onMouseDown={() => catchBug(bug.id, bug.x, bug.y)}
                    onTouchStart={() => catchBug(bug.id, bug.x, bug.y)} /* Mobile support */
                    style={{
                      position: 'absolute',
                      left: bug.x,
                      top: bug.y,
                      transform: `rotate(${bug.rotation}deg)`,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'crosshair',
                      color: 'var(--accent-secondary)',
                      padding: 0,
                    }}
                  >
                    <Bug size={40} className="bug-icon" style={{ filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.8))' }} />
                  </motion.button>
                ))}
              </AnimatePresence>

              {/* Floating +1 Animations */}
              <AnimatePresence>
                {plusOnes.map(po => (
                  <motion.div
                    key={po.id}
                    initial={{ opacity: 1, y: po.y, x: po.x }}
                    animate={{ opacity: 0, y: po.y - 50, x: po.x }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      position: 'absolute',
                      color: '#4ade80',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      pointerEvents: 'none',
                      zIndex: 20
                    }}
                  >
                    +1
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes squirm {
          0% { transform: rotate(-10deg) scale(0.9); }
          50% { transform: rotate(10deg) scale(1.1); }
          100% { transform: rotate(-10deg) scale(0.9); }
        }
        .bug-icon {
          animation: squirm 0.3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
