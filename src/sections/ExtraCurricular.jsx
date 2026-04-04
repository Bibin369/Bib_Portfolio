import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function ExtraCurricular() {
  const { extracurricular } = portfolioData;

  if (!extracurricular || extracurricular.length === 0) return null;

  return (
    <section id="extracurricular" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Extra-Curricular" subtitle="Activities and achievements outside of daily work." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {extracurricular.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel"
            style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: '1rem' 
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div style={{ 
              background: 'var(--border-color)', 
              padding: '0.75rem', 
              borderRadius: '12px',
              color: 'var(--accent-secondary)'
            }}>
              <Star size={20} />
            </div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5, marginTop: '0.2rem' }}>
              {item}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
