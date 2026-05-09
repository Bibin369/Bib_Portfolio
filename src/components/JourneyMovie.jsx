import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Maximize2, Minimize2 } from 'lucide-react';

const VIDEO_SRC = '/journey.mp4';

export default function JourneyMovie({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFs, setIsFs] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const hideTimer = useRef(null);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setProgress(0); setCurrent(0); setShowControls(true); setLoaded(false);
      // Auto-play after mount
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
      }, 300);
    } else {
      if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      setPlaying(false);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Auto-hide controls
  const showCtrl = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => { if (videoRef.current && !videoRef.current.paused) setShowControls(false); }, 3000);
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
      if (e.key === 'Escape') handleClose();
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'm' || e.key === 'M') toggleMute();
      if (e.key === 'f' || e.key === 'F') toggleFs();
      if (e.key === 'ArrowRight' && videoRef.current) videoRef.current.currentTime += 5;
      if (e.key === 'ArrowLeft' && videoRef.current) videoRef.current.currentTime -= 5;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, playing]);

  const handleClose = () => {
    if (videoRef.current) videoRef.current.pause();
    if (document.fullscreenElement) document.exitFullscreen?.();
    setPlaying(false);
    onClose();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); showCtrl(); }
    else { videoRef.current.pause(); setPlaying(false); setShowControls(true); }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const toggleFs = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrent(videoRef.current.currentTime);
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const onSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: showControls ? 'default' : 'none',
        }}
        onClick={() => { if (!showControls) showCtrl(); }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onLoadedMetadata={() => { setDuration(videoRef.current.duration); setLoaded(true); }}
          onTimeUpdate={onTimeUpdate}
          onEnded={() => { setPlaying(false); setShowControls(true); }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          playsInline
          preload="auto"
        />

        {/* Center play button (when paused) */}
        {!playing && loaded && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={togglePlay}
            style={{
              position: 'absolute',
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 50px rgba(99,102,241,0.5)',
              zIndex: 5,
            }}
          >
            <Play size={32} style={{ marginLeft: 4 }} />
          </motion.button>
        )}

        {/* Controls */}
        <motion.div
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            padding: '2.5rem 1.5rem 1rem',
            pointerEvents: showControls ? 'auto' : 'none',
          }}
        >
          {/* Progress bar */}
          <div onClick={onSeek} style={{
            width: '100%', height: 5, borderRadius: 3,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            marginBottom: 12, position: 'relative',
          }}>
            <div style={{
              width: `${progress}%`, height: '100%', borderRadius: 3,
              background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
              transition: 'width 0.1s linear',
            }} />
            <div style={{
              position: 'absolute', left: `${progress}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 14, height: 14, borderRadius: '50%',
              background: '#fff', boxShadow: '0 0 8px rgba(0,0,0,0.4)',
              transition: 'left 0.1s linear',
            }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={togglePlay} style={btnStyle}>
                {playing ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
              </button>
              <button onClick={toggleMute} style={btnStyle}>
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, fontFamily: 'monospace' }}>
                {fmt(currentTime)} / {fmt(duration)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={toggleFs} style={btnStyle}>
                {isFs ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Close */}
        <motion.button
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          style={{
            position: 'absolute', top: 20, right: 20, zIndex: 10,
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
  borderRadius: 10, color: '#fff',
  width: 38, height: 38,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'background 0.2s',
};
