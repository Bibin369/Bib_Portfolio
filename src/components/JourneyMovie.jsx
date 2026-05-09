import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause } from 'lucide-react';
import { SCENES } from '../utils/scenes';

export default function JourneyMovie({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneStart, setSceneStart] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [fade, setFade] = useState(1); // 1=black, 0=clear
  const hideTimer = useRef(null);
  const playRef = useRef(false);

  const totalDur = SCENES.reduce((s,sc)=>s+sc.dur,0);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setSceneIdx(0); setSceneStart(0); setPlaying(false);
      startRef.current = null; setFade(1); playRef.current = false;
    } else {
      cancelAnimationFrame(frameRef.current);
      playRef.current = false;
    }
  }, [isOpen]);

  // Fullscreen
  useEffect(() => {
    if (!isOpen) return;
    const el = document.documentElement;
    el.requestFullscreen?.().catch(()=>{});
    return () => { document.exitFullscreen?.().catch(()=>{}); };
  }, [isOpen]);

  // Auto-hide controls
  const showCtrl = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => { if(playRef.current) setShowControls(false); }, 3000);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onMove = () => showCtrl();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchstart', onMove);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('touchstart', onMove); };
  }, [isOpen, showCtrl]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { handleClose(); }
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, playing]);

  const handleClose = () => {
    setPlaying(false); playRef.current = false;
    cancelAnimationFrame(frameRef.current);
    onClose();
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false); playRef.current = false;
    } else {
      startRef.current = null;
      setPlaying(true); playRef.current = true;
      setFade(0);
      showCtrl();
    }
  };

  // Main render loop
  useEffect(() => {
    if (!isOpen || !playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = (timestamp) => {
      if (!playRef.current) return;
      if (!startRef.current) startRef.current = timestamp - sceneStart;
      const elapsed = timestamp - startRef.current;

      // Resize canvas
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth, h = window.innerHeight;
      if (canvas.width !== w*dpr || canvas.height !== h*dpr) {
        canvas.width = w*dpr; canvas.height = h*dpr;
        canvas.style.width = w+'px'; canvas.style.height = h+'px';
        ctx.scale(dpr, dpr);
      }

      // Find current scene
      let acc = 0, si = 0;
      for (let i = 0; i < SCENES.length; i++) {
        if (elapsed < acc + SCENES[i].dur) { si = i; break; }
        acc += SCENES[i].dur;
        if (i === SCENES.length - 1) { si = i; }
      }

      // End check
      if (elapsed >= totalDur) {
        setPlaying(false); playRef.current = false;
        setFade(1);
        return;
      }

      if (si !== sceneIdx) setSceneIdx(si);

      const scene = SCENES[si];
      const sceneElapsed = elapsed - acc;
      const progress = Math.min(sceneElapsed / scene.dur, 1);

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw scene
      scene.draw(ctx, w, h, elapsed, progress);

      // Scene transition fade (first/last 0.4s of each scene)
      const fadeIn = Math.min(sceneElapsed / 400, 1);
      const fadeOut = Math.min((scene.dur - sceneElapsed) / 400, 1);
      const sceneFade = 1 - Math.min(fadeIn, fadeOut);
      if (sceneFade > 0) {
        ctx.fillStyle = `rgba(0,0,0,${sceneFade})`;
        ctx.fillRect(0, 0, w, h);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isOpen, playing, sceneIdx, totalDur]);

  // Calculate overall progress for timeline
  let elapsed = 0;
  for (let i = 0; i < sceneIdx; i++) elapsed += SCENES[i].dur;
  const overallProgress = (elapsed / totalDur) * 100;

  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    let target = pct * totalDur, acc = 0;
    for (let i = 0; i < SCENES.length; i++) {
      if (target < acc + SCENES[i].dur) {
        setSceneIdx(i);
        setSceneStart(target);
        startRef.current = null;
        break;
      }
      acc += SCENES[i].dur;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: '#000', cursor: showControls ? 'default' : 'none',
        }}
        onClick={() => { if (!showControls) showCtrl(); }}
      >
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

        {/* Initial play overlay */}
        {!playing && fade > 0 && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
          }}>
            <motion.button
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={togglePlay}
              style={{
                width: 90, height: 90, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border: 'none', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 50px rgba(99,102,241,0.5)',
              }}
            >
              <Play size={36} style={{ marginLeft: 4 }} />
            </motion.button>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 20, fontSize: 14, letterSpacing: 2 }}>
              {sceneIdx > 0 ? 'RESUME' : 'PLAY CINEMATIC'}
            </p>
          </div>
        )}

        {/* Controls overlay */}
        <motion.div
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            padding: '2rem 1.5rem 1rem', pointerEvents: showControls ? 'auto' : 'none',
          }}
        >
          {/* Timeline */}
          <div onClick={handleTimelineClick} style={{
            width: '100%', height: 4, borderRadius: 2,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer', marginBottom: 12, overflow: 'hidden',
          }}>
            <motion.div animate={{ width: `${overallProgress}%` }} transition={{ duration: 0.3 }}
              style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(to right,#6366f1,#8b5cf6)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={togglePlay} style={btnStyle}>
                {playing ? <Pause size={18}/> : <Play size={18} style={{marginLeft:2}}/>}
              </button>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
                {SCENES[sceneIdx]?.id.toUpperCase()} • {sceneIdx+1}/{SCENES.length}
              </span>
            </div>

            {/* Scene dots */}
            <div style={{ display: 'flex', gap: 4 }}>
              {SCENES.map((s,i) => (
                <button key={s.id} onClick={() => { setSceneIdx(i); setSceneStart(SCENES.slice(0,i).reduce((a,x)=>a+x.dur,0)); startRef.current=null; }}
                  style={{
                    width: i===sceneIdx?16:6, height:6, borderRadius:999,
                    background: i===sceneIdx?'#8b5cf6':'rgba(255,255,255,0.25)',
                    border:'none', cursor:'pointer', padding:0, transition:'all 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Close button */}
        <motion.button
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          style={{
            position: 'absolute', top: 20, right: 20, zIndex: 20,
            ...btnStyle, pointerEvents: showControls ? 'auto' : 'none',
          }}
        >
          <X size={20} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

const btnStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8, color: '#fff',
  width: 36, height: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};
