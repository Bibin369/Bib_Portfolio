import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';

export default function Interests() {
  const { interests } = portfolioData;

  if (!interests || interests.length === 0) return null;

  return (
    <section id="interests" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Interests & Hobbies" subtitle="What I enjoy doing when I'm not coding." />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {interests.map((interest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="glass-panel"
            style={{ 
              padding: '1rem 2rem', 
              borderRadius: '999px',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontSize: '1.1rem'
            }}
            whileHover={{ 
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              borderColor: 'var(--accent-primary)'
            }}
          >
            {interest}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
