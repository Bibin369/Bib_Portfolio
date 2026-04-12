import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Send } from 'lucide-react';

/* ─── Lightweight canvas confetti ─── */
function launchConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#4ade80', '#f59e0b', '#ec4899', '#38bdf8'];
  const PIECES = 140;

  const particles = Array.from({ length: PIECES }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.4 - canvas.height * 0.2,
    r: Math.random() * 7 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    tilt: Math.random() * 10,
    tiltAngle: 0,
    tiltSpeed: Math.random() * 0.1 + 0.05,
    speed: Math.random() * 4 + 2,
    spin: (Math.random() - 0.5) * 0.3,
    opacity: 1,
  }));

  let frame;
  let elapsed = 0;

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elapsed++;

    particles.forEach(p => {
      p.y += p.speed;
      p.tiltAngle += p.tiltSpeed;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      if (elapsed > 80) p.opacity -= 0.012;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.beginPath();
      ctx.ellipse(p.x + p.tilt, p.y, p.r, p.r * 0.4, p.spin, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    });

    if (particles.some(p => p.opacity > 0)) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  draw();
  return () => cancelAnimationFrame(frame);
}

/* ─── Main Modal ─── */
export default function SuccessModal({ isOpen, onClose, onReset, senderName }) {
  const canvasRef = useRef(null);
  const cancelConfetti = useRef(null);

  // Launch confetti when modal opens
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      if (cancelConfetti.current) cancelConfetti.current();
      cancelConfetti.current = launchConfetti(canvasRef.current);
    }
    return () => {
      if (cancelConfetti.current) cancelConfetti.current();
    };
  }, [isOpen]);

  // ESC to close
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Auto-close after 6 seconds
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Canvas confetti layer */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'fixed', inset: 0,
              zIndex: 10000,
              pointerEvents: 'none',
              width: '100vw', height: '100vh',
            }}
          />

          {/* Dim overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 9998,
            }}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Message sent successfully"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              width: 'min(480px, 92vw)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '3rem 2.5rem 2.5rem',
              textAlign: 'center',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'transparent', border: 'none',
                color: 'var(--text-secondary)', cursor: 'pointer',
                padding: '0.35rem', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <X size={20} />
            </button>

            {/* Animated check icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.15 }}
              style={{ marginBottom: '1.5rem', display: 'inline-block' }}
            >
              <motion.div
                animate={{ boxShadow: ['0 0 0 0 rgba(99,102,241,0.4)', '0 0 0 20px rgba(99,102,241,0)', '0 0 0 0 rgba(99,102,241,0)'] }}
                transition={{ repeat: 3, duration: 1.2, delay: 0.4 }}
                style={{
                  width: '90px', height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <CheckCircle size={48} color="#fff" strokeWidth={2.5} />
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}
            >
              Message Sent Successfully!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.5rem' }}
            >
              {senderName ? `Hey ${senderName}, thanks` : 'Thanks'} for reaching out!{' '}
              I've received your message and will get back to you within <strong>24–48 hours</strong>.
            </motion.p>

            {/* Progress bar auto-close indicator */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 6, ease: 'linear' }}
              style={{
                height: '3px',
                background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                borderRadius: '2px',
                transformOrigin: 'left',
                margin: '1.5rem 0',
              }}
            />

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <button
                onClick={() => { onReset(); onClose(); }}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              >
                <Send size={18} /> Send Another
              </button>
              <button
                onClick={onClose}
                className="btn-outline"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
