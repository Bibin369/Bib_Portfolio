import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

export default function Certifications() {
  const { certifications } = portfolioData;

  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Certifications" subtitle="Professional credentials and ongoing learning achievements." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel"
            style={{ 
              padding: '2rem', 
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
              <Award size={150} />
            </div>

            <Award size={32} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem', zIndex: 1 }}>
              {cert.title}
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', zIndex: 1 }}>
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>
                {cert.issuer}
              </span>
              <span style={{ 
                background: 'var(--border-color)', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px', 
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                {cert.year}
              </span>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, zIndex: 1, flexGrow: 1 }}>
              {cert.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
