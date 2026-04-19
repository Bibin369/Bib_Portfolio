import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Zap } from 'lucide-react';
import CatchTheBug from '../components/CatchTheBug';

export default function GameSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section style={{
        padding: '4rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '680px',
            padding: '2.5rem 3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
            borderTop: '3px solid var(--accent-primary)',
          }}
        >
          {/* Left – text */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1, minWidth: '200px' }}>

            {/* Animated bug icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{
                width: '56px', height: '56px', flexShrink: 0,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px var(--accent-glow)',
              }}
            >
              <Bug size={28} color="#fff" />
            </motion.div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Play a Quick Game
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Take a quick break and try this fun mini‑game — catch the bugs and test your reflexes!
              </p>
            </div>
          </div>

          {/* Right – CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsOpen(true)}
            className="btn-primary"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 1.75rem',
              fontSize: '1rem', fontWeight: 600,
              flexShrink: 0,
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            <Zap size={18} />
            Play Now
          </motion.button>
        </motion.div>
      </section>

      <CatchTheBug isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
