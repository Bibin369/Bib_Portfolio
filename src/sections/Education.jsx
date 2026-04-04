import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';

export default function Education() {
  const { education } = portfolioData;

  return (
    <section id="education" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Education" subtitle="My academic journey and qualifications." />

      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '20px',
          width: '2px',
          background: 'var(--border-color)',
          zIndex: 0
        }}></div>

        {education.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            style={{
              position: 'relative',
              paddingLeft: '60px',
              marginBottom: '3rem',
              zIndex: 1
            }}
          >
            {/* Timeline dot */}
            <div style={{
              position: 'absolute',
              left: '11px',
              top: '5px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
              border: '4px solid var(--accent-primary)',
              boxShadow: '0 0 10px var(--accent-glow)'
            }}></div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{item.degree}</h3>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: 500 }}>{item.institution}</h4>
                </div>
                <span style={{
                  background: 'var(--border-color)',
                  padding: '0.25rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  {item.year}
                </span>
              </div>
              
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {item.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
