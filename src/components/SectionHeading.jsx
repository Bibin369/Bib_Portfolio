import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700,
          marginBottom: '1rem',
          color: 'var(--text-primary)'
        }}
        className="gradient-text"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
