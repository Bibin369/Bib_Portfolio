import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import useMediaQuery from '../hooks/useMediaQuery';

export default function Certifications() {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const { certifications } = portfolioData;

  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Certifications" subtitle="Professional credentials and ongoing learning achievements." />

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: isMobile ? '0.75rem' : '1.5rem' 
      }}>
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel"
            style={{ 
              padding: isMobile ? '1rem' : '2rem', 
              position: 'relative', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '-20px', 
              right: '-20px', 
              opacity: 0.05, 
              color: 'var(--text-primary)' 
            }}>
              <Award size={isMobile ? 80 : 150} />
            </div>
            
            <Award size={isMobile ? 24 : 32} color="var(--accent-primary)" style={{ marginBottom: isMobile ? '0.5rem' : '1rem' }} />
            
            <h3 style={{ 
              fontSize: isMobile ? '0.9rem' : '1.25rem', 
              color: 'var(--text-primary)', 
              marginBottom: isMobile ? '0.5rem' : '1rem', 
              zIndex: 1, 
              display: 'flex', 
              alignItems: 'flex-start', 
              minHeight: isMobile ? '2.5rem' : '3.5rem',
              lineHeight: 1.3
            }}>
              {cert.title}
            </h3>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'flex-start' : 'flex-start', 
              marginBottom: isMobile ? '0.75rem' : '1.5rem', 
              zIndex: 1, 
              gap: isMobile ? '0.25rem' : '1rem' 
            }}>
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 500, fontSize: isMobile ? '0.75rem' : '0.9rem', wordWrap: 'break-word', flex: 1 }}>
                {cert.issuer}
              </span>
              <span style={{ 
                background: 'var(--border-color)', 
                padding: '0.15rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {cert.year}
              </span>
            </div>
            
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: isMobile ? '0.8rem' : '0.95rem', 
              lineHeight: 1.4, 
              zIndex: 1, 
              flexGrow: 1,
              display: isMobile ? '-webkit-box' : 'block',
              WebkitLineClamp: isMobile ? 3 : 'none',
              WebkitBoxOrient: isMobile ? 'vertical' : 'unset',
              overflow: isMobile ? 'hidden' : 'visible'
            }}>
              {cert.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
