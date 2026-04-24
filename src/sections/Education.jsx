import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';
import useMediaQuery from '../hooks/useMediaQuery';

export default function Education() {
  const { education } = portfolioData;

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section id="education" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Education" subtitle="My academic journey and qualifications." />

      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: isMobile ? '10px' : '20px',
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
              paddingLeft: isMobile ? '35px' : '60px',
              marginBottom: isMobile ? '2rem' : '3rem',
              zIndex: 1
            }}
          >
            {/* Timeline dot */}
            <div style={{
              position: 'absolute',
              left: isMobile ? '1px' : '11px',
              top: '5px',
              width: isMobile ? '16px' : '20px',
              height: isMobile ? '16px' : '20px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
              border: '4px solid var(--accent-primary)',
              boxShadow: '0 0 10px var(--accent-glow)'
            }}></div>

            <div className="glass-panel" style={{ padding: isMobile ? '1.25rem' : '2rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                flexWrap: 'wrap', 
                gap: '0.5rem', 
                marginBottom: '1rem' 
              }}>
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <h3 style={{ fontSize: isMobile ? '1.15rem' : '1.5rem', color: 'var(--text-primary)', marginBottom: '0.3rem', wordWrap: 'break-word', lineHeight: 1.3 }}>{item.degree}</h3>
                  <h4 style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', color: 'var(--accent-primary)', fontWeight: 500, wordWrap: 'break-word' }}>{item.institution}</h4>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    background: 'var(--border-color)',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    display: 'inline-block'
                  }}>
                  {item.year}
                  </span>
                </div>
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
